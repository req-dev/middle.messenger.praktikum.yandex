import store from '../framework/Store';
import Router from '../framework/Router';
import { CreateChatRequest, GetChatsRequest } from '../types/data';
import ChatsApi from '../api/chats-api';

const chatsApi = new ChatsApi();
const router = new Router();

class ChatsController {
  private static __instance: ChatsController;

  constructor() {
    if (ChatsController.__instance) {
      return ChatsController.__instance;
    }

    ChatsController.__instance = this;
  }
  public async getChats(data: GetChatsRequest) {
    try {
      // Запускаем крутилку

      const result = await chatsApi.request(data);

      switch (result.status) {
        case 401:
          store.set('authorized', false);
          break;
        case 500:
          router.go('/500');
          break;
        case 200:
          console.log(result.response);
          store.set('chatsPage.chatList', result.response);
          break;
      }

    } catch (error) {
      console.error(error);
      store.set('globalModalMessage', {
        title: 'Network error',
        bodyMessage: 'Request failed, check your internet connection and try again',
        visible: true
      });
    }
  }

  async createChat(data: CreateChatRequest) {
    let success = false;
    try {
      // Запускаем крутилку
      store.set('chatsPage.createChatModal', {
        formData: {
          generalFormError: '',
          disabled: true
        },
        closable: false,
      });

      const result = await chatsApi.create(data);

      switch (result.status) {
        case 401:
          store.set('authorized', false);
          break;
        case 400:
          store.set('chatsPage.createChatModal.formData.generalFormError', result.response.reason);
          break;
        case 500:
          router.go('/500');
          break;
        case 200:
          success = true;
          console.log(result.response.id);
          await this.getChats({});
          store.set('chatsPage.createChatModal', {
            visible: false
          });
          break;
      }

    } catch (error) {
      console.error(error);
      store.set('chatsPage.createChatModal.formData.generalFormError', 'Request failed, check your internet connection and try again');
    } finally {
      store.set('chatsPage.createChatModal', {
        formData: { disabled: false },
        closable: true
      });
    }
    return success;
  }

}

export default ChatsController;
