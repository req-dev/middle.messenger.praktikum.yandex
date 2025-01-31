import store from '../framework/Store';
import Router from '../framework/Router';
import ChatTokenApi from '../api/chat-token-api';

type ServerWSResponse = { type: string } & Record<string, unknown>

const chatTokenApi = new ChatTokenApi();
const router = new Router();

class DialogController {
  private static __instance: DialogController;
  private ws: WebSocket | null;
  private _disconnecting: boolean;
  private keepConnectionId: number | null;

  constructor() {
    if (DialogController.__instance) {
      return DialogController.__instance;
    }
    this.ws = null;
    this._disconnecting = false;
    this.keepConnectionId = null;

    DialogController.__instance = this;
  }

  get canConnect(): boolean {
    return !this._disconnecting && this.keepConnectionId === null || this.ws === null;
  }

  get canDisconnect(): boolean {
    return !this._disconnecting;
  }

  async createWSConnection(id: number) {
    if (!this.canConnect) {
      alert('can not create connection');
      return;
    }
    const token = await this.getWsToken(id);
    const userId = store.getState().user?.id;
    const chatId = store.getState().chatsPage.selectedChat;

    if (!token || !userId || !chatId) {
      store.set('chatsPage.selectedChat', null);
      if (this.canDisconnect) {
        await this.disconnect();
      }
      throw new Error('Fatal error: can not proceed any further. token, userId and chatId can not be null.');
    }
    if (this.ws) {
      store.set('chatsPage.selectedChat', null);
      if (this.canDisconnect) {
        await this.disconnect();
      }
      return;
    }

    this.ws = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);

    this.ws.addEventListener('open', () => {
      this.enableKeepConnection();
      store.set('chatsPage.wsConnected', true);

      // get unread messages after connected
      this.sendData({
        content: "0",
        type: "get old"
      });
    });

    this.ws.addEventListener('close', async (event) => {
      if (this.canDisconnect) {
        await this.disconnect();
      }

      if (event.wasClean) {
        return;
      }

      console.log(`Connection closed unexpectedly, Code: ${event.code} | Reason: ${event.reason}`);
      store.set('globalModalMessage', {
        title: 'Network Error',
        bodyMessage: `Could not connect to the chat, check your internet connection and try again. Code: ${event.code} | Reason: ${event.reason}`,
        visible: true,
      });
    });

    this.ws.addEventListener('message', event => {
      this.receivedData(JSON.parse(event.data));
    });
  }

  private receivedData(data: ServerWSResponse | ServerWSResponse[]) {
    if (Array.isArray(data)) {
      // list of messages
      store.set('chatsPage.dialogArea.messages', [ ...store.getState().chatsPage.dialogArea.messages, ...data ]);
    } else {
      switch (data.type) {
        case 'pong':
          console.log('pong');
          break;
        case 'message':
        case 'sticker':
        case 'file':
          store.set('chatsPage.dialogArea.messages', [ ...store.getState().chatsPage.dialogArea.messages, data ]);
          break;
      }
    }
  }

  public sendData(data: Record<string, unknown>): boolean {
    if (this._disconnecting || this.keepConnectionId === null || this.ws === null) {
      return false;
    }
    this.ws.send(JSON.stringify(data));
    return true;
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      if (!this.canDisconnect) {
        reject(new Error('WS is already disconnecting, can not disconnect twice'));
      }

      this._disconnecting = true;
      this.disableKeepConnection();
      store.set('chatsPage.dialogArea.messages', []);
      if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
        store.set('chatsPage', {
          wsConnected: false,
          token: null,
          dialogArea: {
            messages: []
          }
        });
        this.ws = null;
        this._disconnecting = false;
        resolve('disconnected');
        return;
      }

      this.ws.addEventListener('close', () => {
        if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
          this.ws = null;
          this._disconnecting = false;
          store.set('chatsPage', {
            wsConnected: false,
            token: null,
            dialogArea: {
              messages: []
            }
          });
          resolve('disconnected');
        }
      });

      if (this.ws.readyState !== WebSocket.CLOSING) {
        this.ws.close();
      }
    });
  }

  private enableKeepConnection() {
    this.keepConnectionId = setInterval(() => {
      if (this.ws) {
        this.ws.send(JSON.stringify({type: "ping"}));
      } else {
        this.disableKeepConnection();
      }
    }, 6000) as unknown as number;
  }

  private disableKeepConnection() {
    if (this.keepConnectionId) {
      clearInterval(this.keepConnectionId);
      this.keepConnectionId = null;
    }
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
