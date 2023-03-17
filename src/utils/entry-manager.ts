import EventEmitter from 'events';

class EntryManager<T> extends EventEmitter {
  private entries: T[] = [];

  get(index: number) {
    return this.entries[index];
  }

  add(entry: T) {
    this.entries.push(entry);
    this.emit('change');
  }

  clear() {
    this.entries.length = 0;
    this.emit('change');
  }

  remove(entry: T | ((e: T) => boolean)) {
    const index =
      typeof entry === 'function'
        ? this.entries.findIndex(entry as any)
        : this.entries.indexOf(entry);

    if (index !== -1) {
      this.entries.splice(index, 1);
      this.emit('change');

      return true;
    }

    return false;
  }

  getEntries(): readonly T[] {
    return this.entries;
  }
}

export default EntryManager;
