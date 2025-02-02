import { HTTP } from '../unitilies/HTTP';
import BaseAPI from './base-api'

export interface SignupFormModel {
  email: string,
  login: string,
  first_name: string,
  second_name: string,
  phone: string
  password: string,
}

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
