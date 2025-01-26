export type Indexed<T = unknown> = {
  [key in string]: T;
};

function merge(lhs: Indexed, rhs: Indexed): Indexed {
  const res = { ...lhs };

  for (const [key, value] of Object.entries(rhs)){

    if (
      typeof res[key] === 'object' &&
      res[key] !== null &&
      !Array.isArray(res[key]) &&
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
    ) {
      // If both values are objects, we merge them again
      res[key] = merge(res[key] as Indexed, value as Indexed);
    } else {
      // Otherwise, we simply overwrite the value
      res[key] = value;
    }

  }
  return res;
}

export default merge;
