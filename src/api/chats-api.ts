import { HTTP } from '../unitilies/HTTP';
import BaseAPI from './base-api'

export interface GetChatsRequest {
  offset?: number,
  limit?: number,
  title?: string
}

export interface CreateChatRequest {
  title: string
}

export interface DeleteChatRequest {
  chatId: number
}

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

  delete(data: DeleteChatRequest) {
    return chatsAPIInstance.delete('/',
      {
        data,
        withCredentials: true,
      }
    );
  }

}

export default ChatsApi;
