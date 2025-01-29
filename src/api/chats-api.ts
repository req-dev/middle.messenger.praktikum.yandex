import { HTTP } from '../unitilies/HTTP';
import BaseAPI from './base-api'
import { GetChatsRequest, CreateChatRequest } from '../types/data';

const chatsAPIInstance = new HTTP('https://ya-praktikum.tech/api/v2/chats');

class ChatsApi extends BaseAPI {

  request(data: GetChatsRequest) {
    return chatsAPIInstance.get('/',
      {
        data,
        withCredentials: true,
      }
    );
  }

  create(data: CreateChatRequest) {
    return chatsAPIInstance.post('/',
      {
        data,
        withCredentials: true,
      }
    );
  }

}

export default ChatsApi;
