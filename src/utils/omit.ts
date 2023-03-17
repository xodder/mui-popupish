import cloneDeep from './clone-deep';
import isNonNull from './is-non-null';

function omit<T extends object>(object: T, path: string) {
  if (!isNullish(object)) return undefined;

  const result = cloneDeep(object);

  if (!path) return result;

  let currentContext: Record<string, any> = result;

  const keys = path.split('.');
  const lastKeyIndex = keys.length - 1;

  if (keys.length > 1) {
    for (const key of keys.slice(0, lastKeyIndex)) {
      currentContext = currentContext[key];
      if (!isNullish(currentContext)) return result;
    }
  }

  if (!isNullish(currentContext)) {
    const key = keys[lastKeyIndex];

    if (Array.isArray(currentContext) && /\d+/.test(key)) {
      currentContext.splice(Number(key), 1);
    } else {
      delete currentContext[keys[lastKeyIndex]];
    }
  }

  return result;
}

function isNullish(value: unknown) {
  return !isNonNull(value);
}

export default omit;
