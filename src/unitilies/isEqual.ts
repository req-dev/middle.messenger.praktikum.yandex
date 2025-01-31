function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object'
    && value !== null
    && value.constructor === Object
    && Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isArrayOrObject(value: unknown): value is (Record<string | number, unknown>) {
  return isPlainObject(value) || isArray(value);
}

function isEqual(a: unknown, b: unknown): boolean {

  if (!isArrayOrObject(a) || !isArrayOrObject(b)) {
    return a === b;
  }

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const [key, value] of Object.entries(a)){

    if(isArrayOrObject(value) && isArrayOrObject(b[key])){

      if (!isEqual(value, b[key])) { // objects comparing
        return false;
      }

    } else if (b[key] !== value) { // direct comparing
      return false;
    }

  }

  return true;
}

export default isEqual;
