type StringIndexed = Record<string, unknown>;

function queryStringify(data: StringIndexed): string | never {
  if (typeof data !== 'object') {
    throw new Error('input must be an object');
  }
  let url = '';
  for (const [prefix, value] of Object.entries(data)) {
    if (value == null) {
      continue;
    }
    if(url) url += '&';

    if (Array.isArray(value)) {

      value.forEach((el, index) => {
        url += `${prefix}[${index}]=${encodeURIComponent(el.toString())}`;
        if (index != value.length - 1) {
          url += '&';
        }
      });

    } else if (typeof value === 'object') {

      for (const [key, nestedValue] of Object.entries(value.toString())) {
        url += queryStringify({[`${prefix}[${key}]`]: nestedValue});
      }

    } else {
      url += `${prefix}=${encodeURIComponent(value.toString())}`;
    }
  }
  return url;
}

export default queryStringify;
