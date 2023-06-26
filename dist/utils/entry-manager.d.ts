/// <reference types="node" />
import EventEmitter from 'events';
declare class EntryManager<T> extends EventEmitter {
    private entries;
    get(index: number): T;
    add(entry: T): void;
    clear(): void;
    remove(entry: T | ((e: T) => boolean)): boolean;
    getEntries(): readonly T[];
}
export default EntryManager;
//# sourceMappingURL=entry-manager.d.ts.map