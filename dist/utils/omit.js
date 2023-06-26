"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_deep_1 = __importDefault(require("./clone-deep"));
const is_non_null_1 = __importDefault(require("./is-non-null"));
function omit(object, path) {
    if (!isNullish(object))
        return undefined;
    const result = (0, clone_deep_1.default)(object);
    if (!path)
        return result;
    let currentContext = result;
    const keys = path.split('.');
    const lastKeyIndex = keys.length - 1;
    if (keys.length > 1) {
        for (const key of keys.slice(0, lastKeyIndex)) {
            currentContext = currentContext[key];
            if (!isNullish(currentContext))
                return result;
        }
    }
    if (!isNullish(currentContext)) {
        const key = keys[lastKeyIndex];
        if (Array.isArray(currentContext) && /\d+/.test(key)) {
            currentContext.splice(Number(key), 1);
        }
        else {
            delete currentContext[keys[lastKeyIndex]];
        }
    }
    return result;
}
function isNullish(value) {
    return !(0, is_non_null_1.default)(value);
}
exports.default = omit;
//# sourceMappingURL=omit.js.map