import { Snackbar } from '@material-ui/core';
import React from 'react';
import { ArrayEmitter } from '../utils';

export function SnackbarQueue({ queue, ...defaultSnackbarProps }) {
  const currentSnackbar = queue.array[0];
  const [, setIteration] = React.useState(0);
  const [snackbar, setSnackbar] = React.useState(currentSnackbar);

  const removeSnackbar = React.useCallback(
    function (snackbar) {
      snackbar && queue.remove(snackbar);
    },
    [queue]
  );

  React.useEffect(() => {
    var timerId;
    var doChange = () => {
      if (queue.array[0] !== snackbar) {
        setIteration((val) => val + 1);
        timerId = window.setTimeout(() => setSnackbar(queue.array[0]), 150);
      }
    };
    queue.on('change', doChange);
    return () => {
      timerId && clearTimeout(timerId);
      queue.off('change', doChange);
    };
  }, [queue, snackbar]);

  const { onClose, icon, message, ...snackbarProps } = snackbar || {};

  let resolvedMessage = message;

  if (icon) {
    resolvedMessage = (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <div style={{ width: 16, flexShrink: 0 }} />
        {message}
      </div>
    );
  }

  const open = snackbar && snackbar === currentSnackbar;

  return (
    <Snackbar
      autoHideDuration={2000}
      {...defaultSnackbarProps}
      {...snackbarProps}
      open={open}
      message={resolvedMessage}
      onClose={(e) => {
        onClose && onClose(e);
        removeSnackbar(snackbar);
      }}
    />
  );
}

/** Creates a snackbar queue */
export const createSnackbarQueue = function () {
  const queue = new ArrayEmitter();
  return {
    snackbarQueue: queue,
    clearAll: function () {
      return queue.empty();
    },
    notify: function (snackbar) {
      queue.push(snackbar);
      return {
        close: function () {
          queue.remove(snackbar);
        },
      };
    },
  };
};
