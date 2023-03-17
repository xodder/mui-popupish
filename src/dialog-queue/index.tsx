import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import EntryManager from '../utils/entry-manager';
import omit from '../utils/omit';
import randomId from '../utils/random-id';
import useRerender from '../utils/use-rerender';
import SimpleDialog, { SimpleDialogProps } from './simple-dialog';

type DialogEvent = {
  detail: {
    action: string;
  };
};

type MessageDialogProps = Partial<SimpleDialogProps>;

type PromptProps = MessageDialogProps & {
  inputProps: Omit<TextFieldProps, 'value' | 'onChange'>;
};

type Entry<V = DialogEvent> = {
  id: string;
  props: MessageDialogProps | PromptProps;
  resolve: (value: V) => void;
  reject: (reason: string) => void;
};

type DialogQueueProps = {
  manager: EntryManager<Entry>;
  defaultProps?: Entry['props'];
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

  function handleDialogClose(event: DialogEvent, entry: Entry) {
    setIsClosing({ ...isClosing, [entry.id]: true });

    entry.resolve(event);

    setTimeout(() => {
      manager.remove((x) => x.id === entry.id); // maybe tell it not to trigger
      setIsClosing((x) => omit(x, entry.id));
    }, 150);

    entry.props?.onClose?.(event as any, 'backdropClick');
  }

  let foundOpen = false;

  return (
    <React.Fragment>
      {manager.getEntries().map((entry) => {
        const dialog = (
          <SimpleDialog
            key={entry.id}
            {...defaultProps}
            {...entry.props}
            open={!isClosing[entry.id] && !foundOpen}
            onClose={(e) => handleDialogClose(e as any, entry)}
          />
        );

        if (!isClosing[entry.id]) foundOpen = true;

        return dialog;
      })}
    </React.Fragment>
  );
}

export function createDialogQueue() {
  const manager = new EntryManager<Entry>();

  return {
    dialogManager: manager,
    alert: createDialogQueuePart(alertFactory, manager),
    confirm: createDialogQueuePart(confirmFactory, manager),
    prompt: createDialogQueuePart(promptFactory, manager),
  };
}

type EntryFactory<T = unknown> = (entry: Entry<T>) => Entry<DialogEvent>;

function createDialogQueuePart<T>(
  factory: EntryFactory<T>,
  manager: EntryManager<Entry>
) {
  return (props: Entry['props']) => {
    return new Promise<T>(function (resolve, reject) {
      manager.add(
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

type Maybe<T> = T | undefined;

function promptFactory(entry: Entry<string | null>): Entry {
  let getValue: Maybe<() => string> = undefined;

  const body = (
    <PromptBody
      body={entry.props.body}
      inputProps={'inputProps' in entry.props ? entry.props.inputProps : {}}
      apiRef={(callback) => (getValue = callback)}
    />
  );

  return {
    ...entry,
    props: {
      title: 'Prompt',
      ...entry.props,
      body,
    },
    resolve: (e) => {
      const value = getValue?.() || '';
      entry.resolve(e.detail.action === 'accept' ? value : null);
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

function alertFactory(entry: Entry<string>): Entry {
  return {
    ...entry,
    props: {
      title: 'Alert',
      body: 'You have been alerted!',
      acceptLabel: 'OK',
      cancelLabel: null,
      ...entry.props,
    },
    resolve: (e) => entry.resolve(e.detail.action),
  };
}

function confirmFactory(entry: Entry<boolean>): Entry {
  return {
    ...entry,
    props: {
      title: 'Confirm',
      body: 'Are you sure you want do that?',
      acceptLabel: 'OK',
      cancelLabel: 'Cancel',
      ...entry.props,
    },
    resolve: (e) => entry.resolve(e.detail.action === 'accept'),
  };
}
