interface IHTTPOptions {
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT',
  headers?: Record<string, string>,
  data?: Record<string, string>,
  timeout?: number,
}

class HTTP {
  private queryStringify = (data: Record<string, string>): string => {
    const keys = Object.keys(data);
    let params = '?';

    keys.forEach((key, index) => {
      params += `${key}=${data[key]}`;

      if (index < keys.length - 1) {
        params += '&';
      }
    });
    return params;
  };

  get = (url: string, options: IHTTPOptions = {}) => {
    return this.request(url, {
      ...options,
      method: 'GET'
    }, options.timeout);
  };

  post = (url: string, options: IHTTPOptions = {}) => {
    return this.request(url, {
      ...options,
      method: 'POST'
    }, options.timeout);
  };

  put = (url: string, options: IHTTPOptions = {}) => {
    return this.request(url, {
      ...options,
      method: 'PUT'
    }, options.timeout);
  };

  delete = (url: string, options: IHTTPOptions = {}) => {
    return this.request(url, {
      ...options,
      method: 'DELETE'
    }, options.timeout);
  };

  request = (url: string, options: IHTTPOptions = {}, timeout = 5000): Promise<XMLHttpRequest> => {
    const {
      method = 'GET',
      data,
      headers = {}
    } = options;
    const isGet = method === 'GET';

    return new Promise((resolve, reject) => {
      if (!method) {
        reject('No method');
        return;
      }

      const xhr = new XMLHttpRequest();

      if (isGet && data) {
        url += this.queryStringify(data);
      }

      xhr.open(method, url);
      if (headers) {
        Object.keys(headers)
          .forEach((header) => {
            xhr.setRequestHeader(header, headers[header]);
          });
      }

      xhr.timeout = timeout;
      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;
      xhr.onload = () => {
        resolve(xhr);
      };

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  };

  requestWithRetry = (url: string, options: { tries?: number } & IHTTPOptions = {}): Promise<XMLHttpRequest> => {
    const { tries = 1 } = options;

    const onError = (err: Error) => {
      const triesLeft = tries - 1;
      if (!triesLeft) {
        throw err;
      }

      return this.requestWithRetry(url, {
        ...options,
        tries: triesLeft
      });
    }

    return this.request(url, options)
      .catch(onError);
  };
}

export { HTTP, IHTTPOptions };
