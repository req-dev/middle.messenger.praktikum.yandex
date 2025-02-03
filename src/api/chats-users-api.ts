import { HTTP } from '../unitilies/HTTP';
import BaseAPI from './base-api'

export interface ChatUsersRequest {
  users: number[],
  chatId: number
}

const chatsUsersAPIInstance = new HTTP('https://ya-praktikum.tech/api/v2/chats/users');

class ChatsUsersApi extends BaseAPI {

  create(data: ChatUsersRequest) {
    return chatsUsersAPIInstance.put('/',
      {
        data,
        withCredentials: true,
      }
    );
  }

  delete(data: ChatUsersRequest) {
    return chatsUsersAPIInstance.delete('/',
      {
        data,
        withCredentials: true,
      }
    );
  }

}

export default ChatsUsersApi;
