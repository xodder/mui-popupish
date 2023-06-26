"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDialogQueue = exports.DialogQueue = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const react_1 = __importDefault(require("react"));
const entry_manager_1 = __importDefault(require("../utils/entry-manager"));
const omit_1 = __importDefault(require("../utils/omit"));
const random_id_1 = __importDefault(require("../utils/random-id"));
const use_rerender_1 = __importDefault(require("../utils/use-rerender"));
const simple_dialog_1 = __importDefault(require("./simple-dialog"));
function DialogQueue({ manager, defaultProps }) {
    const rerender = (0, use_rerender_1.default)();
    const [isClosing, setIsClosing] = react_1.default.useState({});
    react_1.default.useEffect(() => {
        manager.on('change', rerender);
        return () => {
            manager.off('change', rerender);
        };
    }, [manager, rerender]);
    function handleDialogClose(event, entry) {
        setIsClosing({ ...isClosing, [entry.id]: true });
        entry.resolve(event);
        setTimeout(() => {
            manager.remove((x) => x.id === entry.id);
            setIsClosing((x) => (0, omit_1.default)(x, entry.id) || {});
        }, 150);
        entry.props?.onClose?.(event, 'backdropClick');
    }
    let foundOpen = false;
    return ((0, jsx_runtime_1.jsx)(react_1.default.Fragment, { children: manager.getEntries().map((entry) => {
            const dialog = ((0, jsx_runtime_1.jsx)(simple_dialog_1.default, { ...defaultProps, ...entry.props, open: !isClosing[entry.id] && !foundOpen, onClose: (e) => handleDialogClose(e, entry) }, entry.id));
            if (!isClosing[entry.id])
                foundOpen = true;
            return dialog;
        }) }));
}
exports.DialogQueue = DialogQueue;
function createDialogQueue() {
    const manager = new entry_manager_1.default();
    return {
        dialogManager: manager,
        alert: createDialogQueuePart(alertFactory, manager),
        confirm: createDialogQueuePart(confirmFactory, manager),
        prompt: createDialogQueuePart(promptFactory, manager),
    };
}
exports.createDialogQueue = createDialogQueue;
function createDialogQueuePart(factory, manager) {
    return (props) => {
        return new Promise(function (resolve, reject) {
            manager.add(factory({
                id: (0, random_id_1.default)(),
                props,
                resolve,
                reject,
            }));
        });
    };
}
function promptFactory(entry) {
    let getValue = undefined;
    const body = ((0, jsx_runtime_1.jsx)(PromptBody, { body: entry.props.body, inputProps: 'inputProps' in entry.props ? entry.props.inputProps : {}, apiRef: (callback) => (getValue = callback) }));
    return {
        ...entry,
        props: {
            title: 'Prompt',
            ...entry.props,
            body,
        },
        resolve: (e) => {
            const value = getValue?.() || '';
            entry.resolve(e.detail.action === 'accept' ? value : null);
            getValue = undefined;
        },
    };
}
function PromptBody({ body, inputProps, apiRef }) {
    const [value, setValue] = react_1.default.useState('');
    react_1.default.useEffect(() => {
        apiRef(() => value);
    }, [apiRef, value]);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [body && (0, jsx_runtime_1.jsx)("div", { style: { marginBottom: '1rem' }, children: body }), (0, jsx_runtime_1.jsx)(material_1.TextField, { value: value, onChange: (e) => setValue(e.target.value), ...inputProps, autoFocus: true, fullWidth: true })] }));
}
function alertFactory(entry) {
    return {
        ...entry,
        props: {
            title: 'Alert',
            body: 'You have been alerted!',
            acceptLabel: 'OK',
            cancelLabel: null,
            ...entry.props,
        },
        resolve: (e) => entry.resolve(e.detail.action),
    };
}
function confirmFactory(entry) {
    return {
        ...entry,
        props: {
            title: 'Confirm',
            body: 'Are you sure you want do that?',
            acceptLabel: 'OK',
            cancelLabel: 'Cancel',
            ...entry.props,
        },
        resolve: (e) => entry.resolve(e.detail.action === 'accept'),
    };
}
//# sourceMappingURL=index.js.map