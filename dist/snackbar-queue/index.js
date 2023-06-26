"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSnackbarQueue = exports.SnackbarQueue = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const react_1 = __importDefault(require("react"));
const entry_manager_1 = __importDefault(require("../utils/entry-manager"));
const random_id_1 = __importDefault(require("../utils/random-id"));
const use_rerender_1 = __importDefault(require("../utils/use-rerender"));
function SnackbarQueue({ manager, defaultProps }) {
    const rerender = (0, use_rerender_1.default)();
    const [currentEntry, setCurrentEntry] = react_1.default.useState(manager.get(0));
    react_1.default.useEffect(() => {
        let timerId;
        function handleChange() {
            const nextEntry = manager.get(0);
            const needsUpdate = currentEntry?.id !== nextEntry?.id;
            if (needsUpdate) {
                rerender();
                timerId = setTimeout(() => {
                    setCurrentEntry(nextEntry);
                }, 150);
            }
        }
        manager.on('change', handleChange);
        return () => {
            clearTimeout(timerId);
            manager.off('change', handleChange);
        };
    }, [currentEntry, manager, rerender]);
    const nextEntry = manager.get(0);
    const open = currentEntry?.id === nextEntry?.id && !!currentEntry;
    const props = currentEntry?.props || {};
    const message = react_1.default.useMemo(() => {
        const icon = props.icon || defaultProps?.icon;
        if (!icon)
            return props.message;
        return ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center' }, children: [icon, (0, jsx_runtime_1.jsx)("div", { style: { width: 16, flexShrink: 0 } }), props.message] }));
    }, [props?.icon, defaultProps?.icon, props?.message]);
    return ((0, jsx_runtime_1.jsx)(material_1.Snackbar, { autoHideDuration: 2000, ...defaultProps, ...props, open: open, message: message, onClose: (e, reason) => {
            props.onClose?.(e, reason);
            manager.remove(currentEntry);
        } }));
}
exports.SnackbarQueue = SnackbarQueue;
const createSnackbarQueue = function () {
    const manager = new entry_manager_1.default();
    return {
        snackbarManager: manager,
        clearAll: () => manager.clear(),
        notify: (props) => {
            const id = (0, random_id_1.default)();
            manager.add({ id, props });
            return {
                close: () => manager.remove((x) => x.id === id),
            };
        },
    };
};
exports.createSnackbarQueue = createSnackbarQueue;
//# sourceMappingURL=index.js.map