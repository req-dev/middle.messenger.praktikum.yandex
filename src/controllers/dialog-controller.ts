import store from '../framework/Store';
import Router from '../framework/Router';
import ChatTokenApi from '../api/chat-token-api';

const chatTokenApi = new ChatTokenApi();
const router = new Router();

class DialogController {
  private static __instance: DialogController;
  ws: WebSocket | null;

  constructor() {
    if (DialogController.__instance) {
      return DialogController.__instance;
    }
    store.subscribe('chatsPage.selectedChat', (selectedChat: number | null) => {
      if (selectedChat) {
        this.createWSConnection(selectedChat);
      }
    });
    this.ws = null;

    DialogController.__instance = this;
  }

  private async createWSConnection(id: number) {
    const token = await this.getWsToken(id);
    const userId = store.getState().user?.id;
    const chatId = store.getState().chatsPage.selectedChat;

    if (!token || !userId || !chatId) {
      store.set('chatsPage.selectedChat', null);
      return;
    }

    console.log(`Trying to connect to wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`)
    this.ws = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);

    this.ws.addEventListener('open', () => {
      console.log('WS connected');
    });

    this.ws.addEventListener('close', event => {
      if (event.wasClean) {
        console.log('Connection closed by on of the members');
      } else {
        console.log('Connection closed unexpectedly');
      }

      console.log(`Code: ${event.code} | Reason: ${event.reason}`);
    });

    this.ws.addEventListener('message', event => {
      console.log('Received data', event.data);
    });

    this.ws.addEventListener('error', event => {
      console.log('Error', event.message);
    });
  }

  private async getWsToken(id: number) {

    try {
      const tokenRequest = await chatTokenApi.request({ id });

      switch (tokenRequest.status) {
        case 401:
          store.set('authorized', false);
          break;
        case 500:
          router.go('/500');
          break;
        case 200:
          store.set('chatsPage.token', tokenRequest.response.token);
          return tokenRequest.response.token as string;
      }
    } catch (error) {
      console.error(error);
      store.set('globalModalMessage', {
        title: 'Could not open the chat',
        bodyMessage: 'Request failed, check your internet connection and try again',
        visible: true,
      });
    }
    return null;
  }
}

export default DialogController;
