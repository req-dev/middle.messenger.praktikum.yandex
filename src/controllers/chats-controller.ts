import store from '../framework/Store';
import Router, { Routes } from '../framework/Router';
import ChatsApi, { GetChatsRequest, DeleteChatRequest, CreateChatRequest } from '../api/chats-api';
import DialogController from './dialog-controller';
import ChatsUsersApi from '../api/chats-users-api';
import UserSearchApi from '../api/user-search';
import { UserModel } from '../types/data';

const chatsApi = new ChatsApi();
const chatsUsersApi = new ChatsUsersApi();
const userSearchApi = new UserSearchApi();
const router = new Router();

class ChatsController {
  private static __instance: ChatsController;
  private dialogController: DialogController;

  constructor() {
    if (ChatsController.__instance) {
      return ChatsController.__instance;
    }

    this.dialogController = new DialogController();
    store.subscribe('authorized', () => {
      if (store.getState().authorized) {
        this.getChats({});
      }
    });

    ChatsController.__instance = this;
  }
  public async getChats(data: GetChatsRequest) {
    try {
      // Starting spinner
      store.set('chatsPage.chatList', null);

      const result = await chatsApi.request(data);

      switch (result.status) {
        case 401:
          store.set('authorized', false);
          break;
        case 500:
          router.go(Routes.Error500);
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
      // Starting spinner
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
          router.go(Routes.Error500);
          break;
        case 200:
          success = true;
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

  async deleteChat(data?: DeleteChatRequest) {
    // Starting spinner
    store.set('chatsPage.deleteChatModal', {
      formData: {
        disabled: true
      },
      closable: false,
    });
    let success = false;
    const chatId = data?.chatId ?? store.getState().chatsPage.selectedChat;

    if (!chatId) {
      throw new Error('Fatal error: can not proceed any further: Could not get chatId. It was not provided in args and neither in chatsPage.selectedChat')
    }

    try {
      const result = await chatsApi.delete({ chatId });

      switch (result.status) {
        case 401:
          store.set('authorized', false);
          break;
        case 500:
          router.go(Routes.Error500);
          break;
        case 400:
        case 403:
          store.set('globalModalMessage', {
            title: 'Delete Chat Failed',
            bodyMessage: 'Maybe Chat has already been deleted or you do not have right to delete it.',
            visible: true,
          });
          break;
        case 200:
          success = true;
          if (this.dialogController.canDisconnect) {
            await this.dialogController.disconnect();
          }
          await this.getChats({});
          break;
      }

    } catch (error) {
      console.error(error);
      store.set('globalModalMessage', {
        title: 'Network Error',
        bodyMessage: 'Request failed, check your internet connection and try again',
        visible: true,
      });
    } finally {
      store.set('chatsPage', {
        deleteChatModal: {
          formData: { disabled: false },
          closable: true,
          visible: false
        },
        selectedChat: null
      });
    }
    return success;
  }

  async addUser(login: string) {
    let success = false;
    const chatId = store.getState().chatsPage.selectedChat;
    if (!chatId) {
      throw new Error('Fatal error: can not proceed any further: chatsPage.selectedChat can not be null. Maybe user is unauthorized')
    }
    try {
      // Starting spinner
      store.set('chatsPage.addUserModal', {
        formData: {
          generalFormError: '',
          disabled: true
        },
        closable: false,
      });
      const user = await this.getUser(login);
      if (!user) {
        store.set('chatsPage.addUserModal', {
          formData: {
            generalFormError: 'User not found. Please make sure you did not misspell it',
            disabled: false
          },
          closable: true
        });
        return false;
      }
      const result = await chatsUsersApi.create({
        chatId,
        users: [
          user.id
        ]
      });

      switch (result.status) {
        case 401:
          store.set('authorized', false);
          break;
        case 400:
          store.set('chatsPage.addUserModal.formData.generalFormError', result.response.reason);
          break;
        case 500:
          router.go(Routes.Error500);
          break;
        case 200:
          success = true;
          store.set('chatsPage.addUserModal', {
            visible: false
          });
          break;
      }

    } catch (error) {
      console.error(error);
      store.set('chatsPage.addUserModal.formData.generalFormError', 'Request failed, check your internet connection and try again');
    } finally {
      store.set('chatsPage.addUserModal', {
        formData: { disabled: false },
        closable: true
      });
    }
    return success;
  }

  async deleteUser(login: string) {
    let success = false;
    const chatId = store.getState().chatsPage.selectedChat;
    if (!chatId) {
      throw new Error('Fatal error: can not proceed any further: chatsPage.selectedChat can not be null. Maybe user is unauthorized')
    }
    try {
      // Starting spinner
      store.set('chatsPage.deleteUserModal', {
        formData: {
          generalFormError: '',
          disabled: true
        },
        closable: false,
      });
      const user = await this.getUser(login);
      if (!user) {
        store.set('chatsPage.deleteUserModal', {
          formData: {
            generalFormError: 'User not found. Please make sure you did not misspell it',
            disabled: false
          },
          closable: true
        });
        return false;
      }
      const result = await chatsUsersApi.delete({
        chatId,
        users: [user.id]
      });

      switch (result.status) {
        case 401:
          store.set('authorized', false);
          break;
        case 400:
          store.set('chatsPage.deleteUserModal.formData.generalFormError', result.response.reason);
          break;
        case 500:
          router.go(Routes.Error500);
          break;
        case 200:
          success = true;
          store.set('chatsPage.deleteUserModal', {
            visible: false
          });
          break;
      }

    } catch (error) {
      console.error(error);
      store.set('chatsPage.deleteUserModal.formData.generalFormError', 'Request failed, check your internet connection and try again');
    } finally {
      store.set('chatsPage.deleteUserModal', {
        formData: { disabled: false },
        closable: true
      });
    }
    return success;
  }

  private async getUser(login: string) {
    let result: UserModel[] | null = null;
    const request = await userSearchApi.request({ login });

    switch (request.status) {
      case 401:
        store.set('authorized', false);
        break;
      case 500:
        router.go(Routes.Error500);
        break;
      case 200:
        result = request.response as UserModel[];
    }
    if (result && result.length !== 0 && result[0].login === login) {
      return result[0];
    }
    return null;
  }
}

export default ChatsController;
