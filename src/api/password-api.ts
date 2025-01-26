import { HTTP } from '../unitilies/HTTP';
import BaseAPI from './base-api'
import { UpdatePasswordRequest } from '../types/data';

const passwordAPIInstance = new HTTP('https://ya-praktikum.tech/api/v2/user/password');

class PasswordApi extends BaseAPI {

  update(data: UpdatePasswordRequest) {
    return passwordAPIInstance.put('/',
      {
        data,
        withCredentials: true,
      }
    );
  }

}

export default PasswordApi;
