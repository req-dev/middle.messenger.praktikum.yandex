import { HTTP } from '../unitilies/HTTP';
import BaseAPI from './base-api'

export interface UserSearchRequest {
  login: string,
}

const userSearchAPIInstance = new HTTP('https://ya-praktikum.tech/api/v2/user/search');

class UserSearchApi extends BaseAPI {

  request(data: UserSearchRequest) {
    return userSearchAPIInstance.post('/',
      {
        data,
        withCredentials: true
      }
    );
  }

}

export default UserSearchApi;
