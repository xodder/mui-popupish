import {
  Button,
  ButtonProps,
  Dialog,
  DialogProps,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  TextFieldProps,
} from '@mui/material';
import omit from 'lodash/omit';
import React from 'react';
import useRerender from '~/utils/use-rerender';
import { ArrayEmitter, randomId } from '../utils';

type SimpleDialogProps = DialogProps &
  Partial<{
    title: React.ReactNode;
    header: React.ReactNode;
    body: React.ReactNode;
    footer: React.ReactNode;
    acceptLabel: string | null;
    cancelLabel: string | null;
    acceptButtonProps: ButtonProps;
    cancelButtonProps: ButtonProps;
  }>;

type DialogEvent = {
  detail: {
    action: string;
  };
};

type MessageDialogProps = Partial<SimpleDialogProps>;

type PromptProps = MessageDialogProps & {
  inputProps: Omit<TextFieldProps, 'value' | 'onChange'>;
};

type Message = {
  id: string;
  props: MessageDialogProps | PromptProps;
  resolve: (event: unknown) => void;
  reject: (reason: string) => void;
};

type DialogQueueProps = {
  manager: ArrayEmitter<Message>;
  defaultProps?: Message['props'];
};

export function DialogQueue({ manager, defaultProps }: DialogQueueProps) {
  const rerender = useRerender();
  const [isClosing, setIsClosing] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    manager.on('change', rerender);

    return () => {
      manager.off('change', rerender);
    };
  }, [manager, rerender]);

  let foundOpen = false;

  function handleDialogClose(event: unknown, message: Message) {
    setIsClosing({
      ...isClosing,
      [message.id]: true,
    });

    message.resolve(event);

    setTimeout(() => {
      manager.remove((x) => x.id === message.id); // maybe tell it not to trigger
      setIsClosing((x) => omit(x, message.id));
    }, 150);

    message.props?.onClose?.({}, 'backdropClick');
  }

  return (
    <>
      {manager.entries.map((message) => {
        const { id, props } = message;

        const renderedDialog = (
          <SimpleDialog
            key={id}
            {...defaultProps}
            {...props}
            open={!isClosing[id] && !foundOpen}
            onClose={(evt) => handleDialogClose(evt, message)}
          />
        );

        if (!isClosing[id]) {
          foundOpen = true;
        }

        return renderedDialog;
      })}
    </>
  );
}

// export function createDialogQueue(): {
//   dialogManager: DialogQueueProps['manager'];
//   alert: (props: DialogProps) => Promise<string>;
//   confirm: (props: DialogProps) => Promise<boolean>;
//   prompt: (props: PromptProps) => Promise<string>;
// };

/** Creates a snackbar queue */
export function createDialogQueue() {
  const manager = new ArrayEmitter<Message>();

  return {
    dialogManager: manager,
    alert: createDialogFactory(alertFactory, manager),
    confirm: createDialogFactory(confirmFactory, manager),
    prompt: createDialogFactory(promptFactory, manager),
  };
}

type MessageFactory = (message: Message) => Message;

function createDialogFactory(
  factory: MessageFactory,
  manager: ArrayEmitter<Message>
) {
  return (props: Message['props']) => {
    return new Promise(function (resolve, reject) {
      manager.push(
        factory({
          id: randomId(),
          props,
          resolve,
          reject,
        })
      );
    });
  };
}

function promptFactory(message: Message): Message {
  let getValue: (() => string) | undefined = () => '';

  const body = (
    <PromptBody
      body={message.props.body}
      inputProps={'inputProps' in message.props ? message.props.inputProps : {}}
      apiRef={(callback) => (getValue = callback)}
    />
  );

  return {
    ...message,
    props: {
      title: 'Prompt',
      ...message.props,
      body,
    },
    resolve: function (event) {
      const evt = event as DialogEvent;
      message.resolve(evt.detail.action === 'accept' ? getValue?.() : null);
      getValue = undefined;
    },
  };
}

type PromptBodyProps = {
  body: PromptProps['body'];
  inputProps: PromptProps['inputProps'];
  apiRef: (callback: () => string) => void;
};

function PromptBody({ body, inputProps, apiRef }: PromptBodyProps) {
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    apiRef(() => value);
  }, [apiRef, value]);

  return (
    <div>
      {body && <div style={{ marginBottom: '1rem' }}>{body}</div>}
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        {...inputProps}
        autoFocus={true}
        fullWidth
      />
    </div>
  );
}

/** Alerts */
function alertFactory(def: Message): Message {
  return {
    ...def,
    props: {
      title: 'Alert',
      body: 'You have been alerted!',
      acceptLabel: 'OK',
      cancelLabel: null,
      ...def.props,
    },
    resolve: function (event) {
      const evt = event as DialogEvent;
      return def.resolve(evt.detail.action);
    },
  };
}

/** Confirm */
function confirmFactory(def: Message): Message {
  return {
    ...def,
    props: {
      title: 'Confirm',
      body: 'Are you sure you want do that?',
      acceptLabel: 'OK',
      cancelLabel: 'Cancel',
      ...def.props,
    },
    resolve: function (event) {
      const evt = event as DialogEvent;
      return def.resolve(evt.detail.action === 'accept');
    },
  };
}

function SimpleDialog(props: SimpleDialogProps) {
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
    children || typeof body === 'string' ? (
      <DialogContentText>{body}</DialogContentText>
    ) : (
      body
    );

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      {...rest}
      sx={{ zIndex: 2400, ...rest.sx }}
      PaperProps={{
        ...rest.PaperProps,
        sx: { pt: 2, pb: 1, ...rest.PaperProps?.sx },
      }}
    >
      {(!!title || !!header) && (
        <DialogTitle sx={{ pb: 1 }}>{title || header}</DialogTitle>
      )}
      {!!content && <DialogContent>{content}</DialogContent>}
      {(!!cancelLabel || !!acceptLabel || !!footer) && (
        <DialogActions sx={{ px: 2 }}>
          {footer}
          {!!cancelLabel && (
            <Button
              color="inherit"
              {...cancelButtonProps}
              sx={{ color: 'text.secondary', ...cancelButtonProps }}
              onClick={() =>
                props.onClose?.(
                  { detail: { action: 'close' } },
                  'backdropClick'
                )
              }
            >
              {cancelLabel}
            </Button>
          )}
          {!!acceptLabel && (
            <Button
              {...acceptButtonProps}
              sx={{ fontWeight: 700, ...cancelButtonProps }}
              onClick={() =>
                props.onClose?.(
                  { detail: { action: 'accept' } },
                  'backdropClick'
                )
              }
            >
              {acceptLabel}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
