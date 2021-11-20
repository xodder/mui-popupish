export function randomId(prefix: string): string;

export interface EventEmitter {
  on(event: string, cb: (...args: any[]) => void): void;
  off(event: string, cb: (...args: any[]) => void): void;
  trigger(event: string, ...args: any[]);
}

export interface ArrayEmitter<T = any> {
  array: Array<T>;
  push(): void;
  empty(): void;
  remove(item: T): boolean;
}
