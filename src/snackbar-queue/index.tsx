import { Snackbar, SnackbarProps } from '@mui/material';
import React from 'react';
import useRerender from '~/utils/use-rerender';
import { ArrayEmitter, randomId } from '../utils';

type OwnSnackbarProps = SnackbarProps & {
  icon?: React.ReactNode;
};

type Message = {
  id: string;
  props: OwnSnackbarProps;
};

type SnackbarQueueProps = {
  manager: ArrayEmitter<Message>;
  defaultProps?: OwnSnackbarProps;
};

export function SnackbarQueue({ manager, defaultProps }: SnackbarQueueProps) {
  const rerender = useRerender();
  const [currentMessageDef, setCurrentMessageDef] = React.useState(
    manager.entries[0]
  );

  React.useEffect(() => {
    let timerId: number;

    function handleChange() {
      if (currentMessageDef?.id !== manager.entries[0]?.id) {
        rerender();

        timerId = window.setTimeout(() => {
          setCurrentMessageDef(manager.entries[0]);
        }, 150);
      }
    }

    manager.on('change', handleChange);

    return () => {
      clearTimeout(timerId);
      manager.off('change', handleChange);
    };
  }, [currentMessageDef, manager, rerender]);

  const { onClose, icon, message, ...props } = currentMessageDef?.props || {};

  let resolvedMessage: React.ReactNode = message;

  const resolvedIcon = icon || defaultProps?.icon;

  if (resolvedIcon) {
    resolvedMessage = (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {resolvedIcon}
        <div style={{ width: 16, flexShrink: 0 }} />
        {message}
      </div>
    );
  }

  const open =
    currentMessageDef && currentMessageDef?.id === manager.entries[0]?.id;

  return (
    <Snackbar
      autoHideDuration={2000}
      {...defaultProps}
      {...props}
      open={open}
      message={resolvedMessage}
      onClose={(e, reason) => {
        onClose && onClose(e, reason);
        manager.remove(currentMessageDef);
      }}
    />
  );
}

export const createSnackbarQueue = function () {
  const manager = new ArrayEmitter<Message>();

  return {
    snackbarManager: manager,
    clearAll: () => {
      manager.empty();
    },
    notify: function (props: OwnSnackbarProps) {
      const messageDef = {
        id: randomId(),
        props,
      };

      manager.push(messageDef);

      return {
        close: function () {
          manager.remove((x) => x.id === messageDef.id);
        },
      };
    },
  };
};
