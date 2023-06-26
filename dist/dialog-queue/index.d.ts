/// <reference types="react" />
import { TextFieldProps } from '@mui/material';
import EntryManager from '../utils/entry-manager';
import { SimpleDialogProps } from './simple-dialog';
type DialogEvent = {
    detail: {
        action: string;
    };
};
type MessageDialogProps = Partial<SimpleDialogProps>;
type PromptProps = MessageDialogProps & {
    inputProps: Omit<TextFieldProps, 'value' | 'onChange'>;
};
type Entry<V = DialogEvent> = {
    id: string;
    props: MessageDialogProps | PromptProps;
    resolve: (value: V) => void;
    reject: (reason: string) => void;
};
type DialogQueueProps = {
    manager: EntryManager<Entry>;
    defaultProps?: Entry['props'];
};
export declare function DialogQueue({ manager, defaultProps }: DialogQueueProps): JSX.Element;
export declare function createDialogQueue(): {
    dialogManager: EntryManager<Entry<DialogEvent>>;
    alert: (props: PromptProps | Partial<SimpleDialogProps>) => Promise<string>;
    confirm: (props: PromptProps | Partial<SimpleDialogProps>) => Promise<boolean>;
    prompt: (props: PromptProps | Partial<SimpleDialogProps>) => Promise<string | null>;
};
export {};
//# sourceMappingURL=index.d.ts.map