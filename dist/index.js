"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopupIsh = exports.popupish = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const dialog_queue_1 = require("./dialog-queue");
const snackbar_queue_1 = require("./snackbar-queue");
exports.popupish = {
    ...(0, snackbar_queue_1.createSnackbarQueue)(),
    ...(0, dialog_queue_1.createDialogQueue)(),
};
function PopupIsh() {
    return ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsx)(snackbar_queue_1.SnackbarQueue, { manager: exports.popupish.snackbarManager }), (0, jsx_runtime_1.jsx)(dialog_queue_1.DialogQueue, { manager: exports.popupish.dialogManager, defaultProps: {
                    PaperProps: {
                        sx: { verticalAlign: 'top' },
                    },
                } })] }));
}
exports.PopupIsh = PopupIsh;
//# sourceMappingURL=index.js.map