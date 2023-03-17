import { Snackbar, SnackbarProps as MuiSnackbarProps } from '@mui/material';
import React from 'react';
import EntryManager from '../utils/entry-manager';
import randomId from '../utils/random-id';
import useRerender from '../utils/use-rerender';

type SnackbarProps = MuiSnackbarProps & {
  icon?: React.ReactNode;
};

type Entry = {
  id: string;
  props: SnackbarProps;
};

type SnackbarQueueProps = {
  manager: EntryManager<Entry>;
  defaultProps?: SnackbarProps;
};

export function SnackbarQueue({ manager, defaultProps }: SnackbarQueueProps) {
  const rerender = useRerender();
  const [currentEntry, setCurrentEntry] = React.useState(manager.get(0));

  React.useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    function handleChange() {
      const nextEntry = manager.get(0);
      const needsUpdate = currentEntry?.id !== nextEntry?.id;

      if (needsUpdate) {
        rerender();

        timerId = setTimeout(() => {
          setCurrentEntry(nextEntry);
        }, 150);
      }
    }

    manager.on('change', handleChange);

    return () => {
      clearTimeout(timerId);
      manager.off('change', handleChange);
    };
  }, [currentEntry, manager, rerender]);

  const open = currentEntry?.id === manager.get(0)?.id;
  const props = currentEntry?.props || {};
  const message = React.useMemo(() => {
    const icon = props.icon || defaultProps?.icon;

    if (!icon) return props.message;

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <div style={{ width: 16, flexShrink: 0 }} />
        {props.message}
      </div>
    );
  }, []);

  return (
    <Snackbar
      autoHideDuration={2000}
      {...defaultProps}
      {...props}
      open={open}
      message={message}
      onClose={(e, reason) => {
        props.onClose?.(e, reason);
        manager.remove(currentEntry);
      }}
    />
  );
}

export const createSnackbarQueue = function () {
  const manager = new EntryManager<Entry>();

  return {
    snackbarManager: manager,
    clearAll: () => manager.clear(),
    notify: (props: SnackbarProps) => {
      const id = randomId();

      manager.add({ id, props });

      return {
        close: () => manager.remove((x) => x.id === id),
      };
    },
  };
};
