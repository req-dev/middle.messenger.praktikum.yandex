import { Indexed } from './merge';
import merge from './merge';

function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
  if (typeof path !== 'string' || path.length === 0) {
    throw new Error('path must be a non-empty string');
  }
  if (typeof object !== 'object' || object === null) {
    return object;
  }

  const keys = path.split('.');
  let settedValue: Indexed = {[keys[keys.length - 1]]: value};

  for (let i = keys.length - 2; i >= 0; i--){
    settedValue = { [keys[i]]: settedValue };
  }

  return merge(object as Indexed, settedValue);
}

export default set;
