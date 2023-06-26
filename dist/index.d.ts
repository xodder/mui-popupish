import React from 'react';
export declare const popupish: {
    dialogManager: import("./utils/entry-manager").default<{
        id: string;
        props: (Partial<import("./dialog-queue/simple-dialog").SimpleDialogProps> & {
            inputProps: Omit<import("@mui/material").TextFieldProps, "onChange" | "value">;
        }) | Partial<import("./dialog-queue/simple-dialog").SimpleDialogProps>;
        resolve: (value: {
            detail: {
                action: string;
            };
        }) => void;
        reject: (reason: string) => void;
    }>;
    alert: (props: (Partial<import("./dialog-queue/simple-dialog").SimpleDialogProps> & {
        inputProps: Omit<import("@mui/material").TextFieldProps, "onChange" | "value">;
    }) | Partial<import("./dialog-queue/simple-dialog").SimpleDialogProps>) => Promise<string>;
    confirm: (props: (Partial<import("./dialog-queue/simple-dialog").SimpleDialogProps> & {
        inputProps: Omit<import("@mui/material").TextFieldProps, "onChange" | "value">;
    }) | Partial<import("./dialog-queue/simple-dialog").SimpleDialogProps>) => Promise<boolean>;
    prompt: (props: (Partial<import("./dialog-queue/simple-dialog").SimpleDialogProps> & {
        inputProps: Omit<import("@mui/material").TextFieldProps, "onChange" | "value">;
    }) | Partial<import("./dialog-queue/simple-dialog").SimpleDialogProps>) => Promise<string | null>;
    snackbarManager: import("./utils/entry-manager").default<{
        id: string;
        props: import("@mui/material").SnackbarProps & {
            icon?: React.ReactNode;
        };
    }>;
    clearAll: () => void;
    notify: (props: import("@mui/material").SnackbarProps & {
        icon?: React.ReactNode;
    }) => {
        close: () => boolean;
    };
};
export declare function PopupIsh(): JSX.Element;
//# sourceMappingURL=index.d.ts.map