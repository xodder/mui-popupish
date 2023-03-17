import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from '@mui/material';
import React from 'react';

export type SimpleDialogProps = DialogProps &
  Partial<{
    title: React.ReactNode;
    header: React.ReactNode;
    body: React.ReactNode;
    acceptLabel: string | null;
    cancelLabel: string | null;
    acceptButtonProps: ButtonProps;
    cancelButtonProps: ButtonProps;
  }>;

function SimpleDialog({
  title,
  header,
  body,
  acceptLabel = 'Accept',
  cancelLabel = 'Cancel',
  acceptButtonProps,
  cancelButtonProps,
  children,
  open,
  ...props
}: SimpleDialogProps) {
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
      {...props}
      sx={{ zIndex: 2400, ...props.sx }}
      PaperProps={{
        ...props.PaperProps,
        sx: { pt: 2, pb: 1, ...props.PaperProps?.sx },
      }}
    >
      {(!!title || !!header) && (
        <DialogTitle sx={{ pb: 1 }}>{title || header}</DialogTitle>
      )}
      {!!content && <DialogContent>{content}</DialogContent>}
      {(!!cancelLabel || !!acceptLabel) && (
        <DialogActions sx={{ px: 2 }}>
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

export default SimpleDialog;
