import queryStringify from './queryStringify';

interface IHTTPOptions<T> {
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT',
  headers?: Record<string, string>,
  data?: T,
  timeout?: number,
  withCredentials?: boolean,
}

class HTTP {

  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  get = <T>(url: string, options: IHTTPOptions<T> = {}) => {
    return this.request(url, {
      ...options,
      method: 'GET'
    });
  };

  post = <T>(url: string, options: IHTTPOptions<T> = {}) => {
    return this.request(url, {
      ...options,
      method: 'POST'
    });
  };

  put = <T>(url: string, options: IHTTPOptions<T> = {}) => {
    return this.request(url, {
      ...options,
      method: 'PUT'
    });
  };

  delete = <T>(url: string, options: IHTTPOptions<T> = {}) => {
    return this.request(url, {
      ...options,
      method: 'DELETE'
    });
  };

  request = <T>(url: string, options: IHTTPOptions<T> = {}): Promise<XMLHttpRequest> => {
    const {
      method = 'GET',
      data,
      headers,
      timeout = 5000
    } = options;
    const isGet = method === 'GET';

    return new Promise((resolve, reject) => {
      if (!method) {
        reject('No method');
        return;
      }

      const xhr = new XMLHttpRequest();

      if (isGet && data) {
        url += queryStringify(data);
      }

      xhr.open(method, this.url + url);

      // setting headers
      const hasContentType = Boolean(headers ? headers['content-type'] ?? headers['Content-Type'] : null);
      if (data && !hasContentType && typeof data === 'object' && !(data instanceof FormData)) {
        // application/json value by default
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      }
      if (headers) {
        for (const [headerName, headerValue] of Object.entries(headers)) {
          xhr.setRequestHeader(headerName, headerValue);
        }
      }

      xhr.withCredentials = Boolean(options.withCredentials);
      xhr.responseType = 'json';
      xhr.timeout = timeout;
      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;
      xhr.onload = () => {
        resolve(xhr);
      };

      if (isGet || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  };

  requestWithRetry = <T>(url: string, options: { tries?: number } & IHTTPOptions<T> = {}): Promise<XMLHttpRequest> => {
    const { tries = 1 } = options;

    const onError = (err: Error) => {
      const triesLeft = tries - 1;
      if (!triesLeft) {
        throw err;
      }

      return this.requestWithRetry<T>(url, {
        ...options,
        tries: triesLeft
      });
    }

    return this.request<T>(url, options)
      .catch(onError);
  };
}

export { HTTP, IHTTPOptions };
