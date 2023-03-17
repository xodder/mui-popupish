import React from 'react';
import { createDialogQueue, DialogQueue } from './dialog-queue';
import { createSnackbarQueue, SnackbarQueue } from './snackbar-queue';

export const popupish = {
  ...createSnackbarQueue(),
  ...createDialogQueue(),
};

export function PopupIshPresenter() {
  return (
    <>
      <SnackbarQueue queue={popupish.snackbarQueue} />
      <DialogQueue queue={popupish.dialogQueue} />
    </>
  );
}
