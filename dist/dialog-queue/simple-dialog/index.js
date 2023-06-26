"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
function SimpleDialog({ title, header, body, acceptLabel = 'Accept', cancelLabel = 'Cancel', acceptButtonProps, cancelButtonProps, children, open, ...props }) {
    const content = children || typeof body === 'string' ? ((0, jsx_runtime_1.jsx)(material_1.DialogContentText, { children: body })) : (body);
    return ((0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: open, maxWidth: "sm", ...props, sx: { zIndex: 2400, ...props.sx }, PaperProps: {
            ...props.PaperProps,
            sx: { pt: 2, pb: 1, ...props.PaperProps?.sx },
        }, children: [(!!title || !!header) && ((0, jsx_runtime_1.jsx)(material_1.DialogTitle, { sx: { pb: 1 }, children: title || header })), !!content && (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: content }), (!!cancelLabel || !!acceptLabel) && ((0, jsx_runtime_1.jsxs)(material_1.DialogActions, { sx: { px: 2 }, children: [!!cancelLabel && ((0, jsx_runtime_1.jsx)(material_1.Button, { color: "inherit", ...cancelButtonProps, sx: { color: 'text.secondary', ...cancelButtonProps }, onClick: () => props.onClose?.({ detail: { action: 'close' } }, 'backdropClick'), children: cancelLabel })), !!acceptLabel && ((0, jsx_runtime_1.jsx)(material_1.Button, { ...acceptButtonProps, sx: { fontWeight: 700, ...cancelButtonProps }, onClick: () => props.onClose?.({ detail: { action: 'accept' } }, 'backdropClick'), children: acceptLabel }))] }))] }));
}
exports.default = SimpleDialog;
//# sourceMappingURL=index.js.map