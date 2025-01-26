type StringIndexed = Record<string, unknown>;

function queryStringify(data: StringIndexed): string | never {
  if (typeof data !== 'object') {
    throw new Error('input must be an object');
  }
  let url = '';
  for (const [prefix, value] of Object.entries(data)) {
    if(url) url += '&';

    if (Array.isArray(value)) {

      value.forEach((el, index) => {
        url += `${prefix}[${index}]=${encodeURIComponent(el)}`;
        if (index != value.length - 1) {
          url += '&';
        }
      });

    } else if (typeof value === 'object' && value !== null) {

      for (const [key, nestedValue] of Object.entries(value)) {
        url += queryStringify({[`${prefix}[${key}]`]: nestedValue});
      }

    } else {
      url += `${prefix}=${encodeURIComponent(value)}`;
    }
  }
  return url;
}

export default queryStringify;
