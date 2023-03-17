import React from 'react';
import { Information } from 'mdi-material-ui';
import { createDialogQueue, DialogQueue } from './dialog-queue';
import { createSnackbarQueue, SnackbarQueue } from './snackbar-queue';

export const popupish = {
  ...createSnackbarQueue(),
  ...createDialogQueue(),
};

export function PopupIsh() {
  return (
    <>
      <SnackbarQueue
        manager={popupish.snackbarManager}
        defaultProps={{
          icon: <Information />,
        }}
      />
      <DialogQueue
        manager={popupish.dialogManager}
        defaultProps={{
          PaperProps: {
            sx: { verticalAlign: 'top' },
          },
          // showHighlight: true,
        }}
      />
    </>
  );
}