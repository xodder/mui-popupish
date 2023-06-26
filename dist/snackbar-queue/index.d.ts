import { SnackbarProps as MuiSnackbarProps } from '@mui/material';
import React from 'react';
import EntryManager from '../utils/entry-manager';
type SnackbarProps = MuiSnackbarProps & {
    icon?: React.ReactNode;
};
type Entry = {
    id: string;
    props: SnackbarProps;
};
type SnackbarQueueProps = {
    manager: EntryManager<Entry>;
    defaultProps?: SnackbarProps;
};
export declare function SnackbarQueue({ manager, defaultProps }: SnackbarQueueProps): JSX.Element;
export declare const createSnackbarQueue: () => {
    snackbarManager: EntryManager<Entry>;
    clearAll: () => void;
    notify: (props: SnackbarProps) => {
        close: () => boolean;
    };
};
export {};
//# sourceMappingURL=index.d.ts.map