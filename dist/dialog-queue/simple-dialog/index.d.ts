import { ButtonProps, DialogProps } from '@mui/material';
import React from 'react';
export type SimpleDialogProps = DialogProps & Partial<{
    title: React.ReactNode;
    header: React.ReactNode;
    body: React.ReactNode;
    acceptLabel: string | null;
    cancelLabel: string | null;
    acceptButtonProps: ButtonProps;
    cancelButtonProps: ButtonProps;
}>;
declare function SimpleDialog({ title, header, body, acceptLabel, cancelLabel, acceptButtonProps, cancelButtonProps, children, open, ...props }: SimpleDialogProps): JSX.Element;
export default SimpleDialog;
//# sourceMappingURL=index.d.ts.map