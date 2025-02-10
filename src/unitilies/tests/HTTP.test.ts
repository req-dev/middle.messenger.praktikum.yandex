import { HTTP } from '../HTTP';
import { newServer } from 'mock-xmlhttprequest';

describe('HTTPTransport', () => {

  it('should perform the GET request', async () => {
    // set up the environment
    // replace XMLHttpRequest with a Mock
    const server = newServer({
      get: ['https://api.test.com/ping', {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: '{ "message": "Success!" }',
      }],
    });
    try {
      server.install();
      const http = new HTTP('https://api.test.com');

      const result = await http.get('/ping');

      expect(result.status).toBe(200);
    } finally {
      // clean the environment
      server.remove();
    }
  });

  it('should perform the POST request', async () => {
    // set up the environment
    // replace XMLHttpRequest with a Mock
    const server = newServer({
      post: ['https://api.test.com/messages', {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: '{ "message": "Success!" }',
      }],
    });
    try {
      server.install();
      const http = new HTTP('https://api.test.com');

      const result = await http.post('/messages', { data: { "message": "hi server" } });

      expect(result.status).toBe(201);
    } finally {
      // clean the environment
      server.remove();
    }
  });

  it('should perform the DELETE request', async () => {
    // set up the environment
    // replace XMLHttpRequest with a Mock
    const server = newServer({
      delete: ['https://api.test.com/messages', {
        status: 204
      }],
    });
    try {
      server.install();
      const http = new HTTP('https://api.test.com');

      const result = await http.delete('/messages', { data: { "message": 22 } });

      expect(result.status).toBe(204);
    } finally {
      // clean the environment
      server.remove();
    }
  });

  it('should retry perform the request 3 times', async () => {
    const http = new HTTP('https://api.test.com');
    const retryFunc = jest.spyOn(http, 'requestWithRetry');

    try {
      await http.requestWithRetry('/messages', { tries: 3, timeout: 5 });
    } catch (err) {

    }

    expect(retryFunc).toBeCalledTimes(3);
  });

});
