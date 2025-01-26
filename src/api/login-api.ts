import { HTTP } from '../unitilies/HTTP';
import BaseAPI from './base-api'
import { LoginFormModel } from '../types/data';

const loginAPIInstance = new HTTP('https://ya-praktikum.tech/api/v2/auth/signin');

class LoginApi extends BaseAPI {

  request(data: LoginFormModel) {
    return loginAPIInstance.post('/',
      {
        data,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

}

export default LoginApi;
