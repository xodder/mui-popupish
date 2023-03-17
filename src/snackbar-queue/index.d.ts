import { SnackbarProps } from '@material-ui/core';
import React from 'react';

type Props = SnackbarProps & { icon?: React.ReactNode };

type SnackbarQueueProps = { messageQueue: ArrayEmitter } & Props;

export const SnackbarQueue: React.FC<SnackbarQueueProps>;

export function createSnackbarQueue(): {
  queue: SnackbarQueueProps['messageQueue'];
  clearAll: () => void;
  notify: (snackbar: Props) => { close: () => void };
};
