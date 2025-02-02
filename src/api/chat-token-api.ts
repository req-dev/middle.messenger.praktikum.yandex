import { HTTP } from '../unitilies/HTTP';
import BaseAPI from './base-api'

interface ICreateChatRequest {
  id: number
}

const chatTokenAPIInstance = new HTTP('https://ya-praktikum.tech/api/v2/chats/token');

class ChatTokenApi extends BaseAPI {

  request(data: ICreateChatRequest) {
    return chatTokenAPIInstance.post(`/${data.id}`,
      {
        withCredentials: true,
      }
    );
  }

}

export default ChatTokenApi;
