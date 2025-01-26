function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object'
    && value !== null
    && value.constructor === Object
    && Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value: unknown): value is [] {
  return Array.isArray(value);
}

function isArrayOrObject(value: unknown): value is ([] | Record<string, unknown>) {
  return isPlainObject(value) || isArray(value);
}

function isEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const [key, value] of Object.entries(a)){

    if(isArrayOrObject(value) && isArrayOrObject(b[key])){

      if (!isEqual(value as Record<string, unknown>, b[key] as Record<string, unknown>)) { // objects comparing
        return false;
      }

    } else if (b[key] !== value) { // direct comparing
      return false;
    }

  }

  return true;
}

export default isEqual;
