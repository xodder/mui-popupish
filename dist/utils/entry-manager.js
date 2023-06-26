"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
class EntryManager extends events_1.default {
    entries = [];
    get(index) {
        return this.entries[index];
    }
    add(entry) {
        this.entries.push(entry);
        this.emit('change');
    }
    clear() {
        this.entries.length = 0;
        this.emit('change');
    }
    remove(entry) {
        const index = typeof entry === 'function'
            ? this.entries.findIndex(entry)
            : this.entries.indexOf(entry);
        if (index !== -1) {
            this.entries.splice(index, 1);
            this.emit('change');
            return true;
        }
        return false;
    }
    getEntries() {
        return this.entries;
    }
}
exports.default = EntryManager;
//# sourceMappingURL=entry-manager.js.map