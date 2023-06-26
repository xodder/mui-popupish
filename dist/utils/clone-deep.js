"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cloneDeep(value) {
    if (Array.isArray(value)) {
        return value.map((x) => cloneDeep(x));
    }
    else if (typeof value === 'object') {
        const cloned = {};
        for (const key in value) {
            cloned[key] = cloneDeep(value[key]);
        }
        return cloned;
    }
    return value;
}
exports.default = cloneDeep;
//# sourceMappingURL=clone-deep.js.map