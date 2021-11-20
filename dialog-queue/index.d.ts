import { ButtonProps, DialogProps } from '@material-ui/core';
import React from 'react';

type DialogQueueProps = { dialogQueue: ArrayEmitter } & DialogProps;

export const DialogQueue: React.FC<DialogQueueProps>;

type SimpleDialogProps = {
  title?: string;
  header?: React.ReactNode;
  body?: string | React.ReactNode;
  footer?: React.ReactNode;
  acceptLabel?: string;
  cancelLabel?: string;
  acceptButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
} & Omit<Partial<DialogProps>, 'open'>;

export function createDialogQueue(): {
  queue: DialogQueueProps['dialogQueue'];
  alert: (dialog: SimpleDialogProps) => Promise<string>;
  confirm: (dialog: SimpleDialogProps) => Promise<boolean>;
  prompt: (dialog: SimpleDialogProps) => Promise<string>;
};
