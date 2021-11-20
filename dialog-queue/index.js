import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import React from 'react';
import { ArrayEmitter } from '../utils';
import { randomId } from '../utils';

export function DialogQueue({ queue, ...defaultDialogProps }) {
  const [, setIteration] = React.useState(0);
  const [closingDialogs, setClosingDialogs] = React.useState(0);

  React.useEffect(() => {
    var forceUpdate = () => setIteration((val) => val + 1);
    queue.on('change', forceUpdate);
    return () => {
      queue.off('change', forceUpdate);
    };
  }, [queue]);

  const removeDialog = (evt, dialog) => {
    setClosingDialogs({ ...closingDialogs, [dialog.id]: true });
    dialog.resolve(evt);
    setTimeout(function () {
      const index = queue.array.indexOf(dialog);
      if (index !== -1) {
        queue.array.splice(index, 1);
      }
      const newClosingDialogs = { ...closingDialogs };
      delete newClosingDialogs[dialog.id];
      setClosingDialogs(newClosingDialogs);
    }, 150);
  };

  let foundOpen = false;

  return (
    <>
      {queue.array.map((dialog) => {
        const { resolve, reject, id, inputProps, ...rest } = dialog;
        const renderedDialog = (
          <SimpleDialog
            {...defaultDialogProps}
            {...rest}
            key={id}
            open={!closingDialogs[id] && !foundOpen}
            onClose={(evt) => {
              removeDialog(evt, dialog);
              dialog.onClose && dialog.onClose(evt);
            }}
          />
        );
        if (!closingDialogs[id]) {
          foundOpen = true;
        }
        return renderedDialog;
      })}
    </>
  );
}

/**
 * A base dialog factory that handle setting up the promise
 * With some consistent behavior
 */
const dialogFactory = function (factory, queue) {
  return function (dialog) {
    return new Promise(function (resolve, reject) {
      queue.push(
        factory({
          id: randomId(),
          ...dialog,
          resolve,
          reject,
        })
      );
    });
  };
};

/**
 * Handle prompt queue
 * We have to jump through a few hoops to get the value back out
 */
function PromptBody({ body, inputProps, apiRef }) {
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    apiRef(() => value);
  }, [apiRef, value]);

  return (
    <div>
      {body && <div style={{ marginBottom: '1rem' }}>{body}</div>}
      <TextField
        style={{ width: '100%' }}
        autoFocus={true}
        {...inputProps}
        value={value}
        onChange={(e) => setValue(e)}
      />
    </div>
  );
}

const promptFactory = function (dialog) {
  let getValue = function () {
    return '';
  };

  const body = (
    <PromptBody
      body={dialog.body}
      inputProps={dialog.inputProps}
      apiRef={(callback) => (getValue = callback)}
    />
  );
  return {
    title: 'Prompt',
    ...dialog,
    body: body,
    resolve: function (evt) {
      dialog.resolve(evt.detail.action === 'accept' ? getValue() : null);
      getValue = undefined;
    },
  };
};

/** Alerts */
const alertFactory = function (dialog) {
  return {
    title: 'Alert',
    body: 'You have been alerted!',
    acceptLabel: 'OK',
    cancelLabel: null,
    ...dialog,
    resolve: function (evt) {
      return dialog.resolve(evt.detail.action);
    },
  };
};

/** Confirm */
const confirmFactory = function (dialog) {
  return {
    body: 'Are you sure you want do that?',
    acceptLabel: 'OK',
    cancelLabel: 'Cancel',
    ...dialog,
    resolve: function (evt) {
      return dialog.resolve(evt.detail.action === 'accept');
    },
  };
};

/** Creates a dialog queue */
export function createDialogQueue() {
  const queue = new ArrayEmitter();
  return {
    dialogQueue: queue,
    alert: dialogFactory(alertFactory, queue),
    confirm: dialogFactory(confirmFactory, queue),
    prompt: dialogFactory(promptFactory, queue),
  };
}

/** A SimpleDialog component for ease of use. */
function SimpleDialog(props) {
  const {
    title,
    header,
    body,
    footer,
    acceptLabel = 'Accept',
    cancelLabel = 'Cancel',
    acceptButtonProps,
    cancelButtonProps,
    children,
    open,
    ...rest
  } = props;

  const content =
    typeof body === 'string' ? (
      <DialogContentText>{body}</DialogContentText>
    ) : (
      body || children
    );

  return (
    <Dialog open={open} {...rest}>
      {!!header
        ? header
        : !!title && (
            <DialogTitle style={{ paddingBottom: 0 }}>
              {title || header}
            </DialogTitle>
          )}
      {!!content && <DialogContent>{content}</DialogContent>}
      {(!!cancelLabel || !!acceptLabel || !!footer) && (
        <DialogActions>
          {footer}
          {!!cancelLabel && (
            <Button
              {...cancelButtonProps}
              onClick={() => props.onClose({ detail: { action: 'close' } })}
            >
              {cancelLabel}
            </Button>
          )}
          {!!acceptLabel && (
            <Button
              {...acceptButtonProps}
              onClick={() => props.onClose({ detail: { action: 'accept' } })}
            >
              {acceptLabel}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
