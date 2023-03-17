import React from 'react';
import { createDialogQueue, DialogQueue } from './dialog-queue';
import { createSnackbarQueue, SnackbarQueue } from './snackbar-queue';

export const popupish = {
  ...createSnackbarQueue(),
  ...createDialogQueue(),
};

export function PopupIsh() {
  return (
    <>
      <SnackbarQueue manager={popupish.snackbarManager} />
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
