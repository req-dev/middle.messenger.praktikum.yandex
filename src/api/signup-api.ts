import { HTTP } from '../unitilies/HTTP';
import BaseAPI from './base-api'
import { SignupFormModel } from '../types/data';

const signupAPIInstance = new HTTP('https://ya-praktikum.tech/api/v2/auth/signup');

class SignupApi extends BaseAPI {

  request(data: SignupFormModel) {
    return signupAPIInstance.post('/',
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

export default SignupApi;
