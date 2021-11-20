export const randomId = function (prefix) {
  var id =
    process.env.NODE_ENV === 'test'
      ? 'test'
      : (Math.random() + Math.random() + 1).toString(36).substring(2);
  return prefix + '-' + id;
};

export class EventEmitter {
  constructor() {
    this.events_ = {};
  }
  on(event, cb) {
    if (!this.events_[event]) {
      this.events_[event] = [];
    }

    this.events_[event].push(cb);
  }
  off(event, cb) {
    if (event in this.events_) {
      this.events_[event].splice(this.events_[event].indexOf(cb), 1);
    }
  }
  trigger(event, ...args) {
    if (event in this.events_) {
      this.events_[event].forEach((callback) => {
        callback.apply(this, args);
      });
    }
  }
}

export class ArrayEmitter extends EventEmitter {
  constructor() {
    super(arguments);
    this.array = [];
  }
  push() {
    var _a;
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      items[_i] = arguments[_i];
    }
    var rVal = (_a = this.array).push.apply(_a, [...items]);
    this.trigger('change');
    return rVal;
  }
  empty() {
    this.array.length = 0;
    this.trigger('change');
  }
  remove(item) {
    var index = this.array.indexOf(item);
    if (index > -1) {
      this.array.splice(index, 1);
      this.trigger('change');
      return true;
    }
    return false;
  }
}
