import { HTTP } from '../unitilies/HTTP';
import BaseAPI from './base-api'

export interface UpdateProfileRequest {
  first_name: string,
  second_name: string,
  display_name: string,
  login: string,
  email: string,
  phone: string
}

const profileAPIInstance = new HTTP('https://ya-praktikum.tech/api/v2/user/profile');

class ProfileApi extends BaseAPI {

  update(data: UpdateProfileRequest) {
    return profileAPIInstance.put('/',
      {
        data,
        withCredentials: true,
      }
    );
  }

}

export default ProfileApi;
