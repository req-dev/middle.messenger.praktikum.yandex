import { HTTP } from '../unitilies/HTTP';
import BaseAPI from './base-api'

const avatarAPIInstance = new HTTP('https://ya-praktikum.tech/api/v2/user/profile/avatar');

class AvatarApi extends BaseAPI {

  update(data: FormData) {
    return avatarAPIInstance.put('/',
      {
        data,
        withCredentials: true,
      }
    );
  }

}

export default AvatarApi;
