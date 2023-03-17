export const randomId = function () {
  return (Math.random() + Math.random() + 1).toString(36).substring(2);
};

type Callback = (...args: unknown[]) => void;

export class EventEmitter {
  __events: Record<string, Callback[]> = {};

  on(event: string, cb: Callback) {
    if (!this.__events[event]) {
      this.__events[event] = [];
    }

    this.__events[event].push(cb);
  }

  off(event: string, cb: Callback) {
    if (event in this.__events) {
      this.__events[event].splice(this.__events[event].indexOf(cb), 1);
    }
  }

  trigger(event: string, ...args: unknown[]) {
    if (event in this.__events) {
      this.__events[event].forEach((callback) => {
        callback.apply(this, args);
      });
    }
  }
}

export class ArrayEmitter<T> extends EventEmitter {
  entries: T[] = [];

  push(...args: T[]) {
    this.entries = this.entries.concat(Array.from(args));
    this.trigger('change');
    return this.entries.length;
  }

  empty() {
    this.entries.length = 0;
    this.trigger('change');
  }

  remove(itemOrPredicate: T | ((a: T) => boolean)) {
    const index =
      typeof itemOrPredicate === 'function'
        ? this.entries.findIndex(itemOrPredicate as any)
        : this.entries.indexOf(itemOrPredicate);

    if (index !== -1) {
      this.entries.splice(index, 1);
      this.trigger('change');
      return true;
    }

    return false;
  }
}
