import { HTTP } from '../unitilies/HTTP';
import BaseAPI from './base-api'

const authAPIInstance = new HTTP('https://ya-praktikum.tech/api/v2/auth');

class SessionApi extends BaseAPI {

  request() {
    return authAPIInstance.get('/user',
      {
        withCredentials: true
      }
    );
  }

  delete() {
    return authAPIInstance.post('/logout',
      {
        withCredentials: true
      }
    );
  }

}

export default SessionApi;
