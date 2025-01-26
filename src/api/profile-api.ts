import { HTTP } from '../unitilies/HTTP';
import BaseAPI from './base-api'
import { UpdateProfileRequest } from '../types/data';

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
