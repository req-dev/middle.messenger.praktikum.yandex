import { EventBus } from './EventBus';
import set from '../unitilies/set';
import get from '../unitilies/get';
import { IFormStateData } from '../components/Form';
import { UserModel, ChatListItemModel, MessageModel } from '../types/data';
import isEqual from '../unitilies/isEqual';
import { IModalState } from '../components/Modal';

export enum StoreEvents {
  Updated = 'updated',
}

export interface IAppState {
  testValue: boolean,
  testValue2: boolean,
  authorized: boolean,
  signinPage: { FormStateData?: IFormStateData },
  signupPage: { FormStateData?: IFormStateData },
  profilePage: {
    editAvatarFormData: IFormStateData,
    editProfileFormData: IFormStateData,
    editPasswordFormData: IFormStateData,
    updateAvatarModal: IModalState,
    userData?: UserModel,
    editingPasswordMode: boolean,
    editingMode: boolean,
  },
  chatsPage: {
    createChatModal: IModalState,
    addUserModal: IModalState,
    deleteUserModal: IModalState,
    deleteChatModal: IModalState,
    header: {
      avatar: string | null,
      name: string,
      submenuOpened: boolean
    },
    chatList: ChatListItemModel[] | null,
    selectedChat: number | null,
    token: string | null,
    wsConnected: boolean,
    dialogArea: {
      messages: MessageModel[]
    }
  },
  globalModalMessage: {
    title: string,
    bodyMessage: string,
    visible: boolean,
  }
  user: UserModel | null
}

const initialState: IAppState = {
  testValue: false,
  testValue2: false,
  authorized: localStorage.getItem('authorized') === 'true',
  signinPage: { FormStateData: { disabled: false } },
  signupPage: { FormStateData: { disabled: false } },
  profilePage: {
    editAvatarFormData: { disabled: false },
    editProfileFormData: { disabled: false },
    editPasswordFormData: { disabled: false },
    updateAvatarModal: {
      formData: { disabled: false },
      closable: true,
      visible: false,
    },
    editingPasswordMode: false,
    editingMode: false,
  },
  chatsPage: {
    createChatModal: { formData: { disabled: false }, visible: false, closable: true },
    addUserModal: { formData: { disabled: false }, visible: false, closable: true },
    deleteUserModal: { formData: { disabled: false }, visible: false, closable: true },
    deleteChatModal: { formData: { disabled: false }, visible: false, closable: true },
    header: {
      avatar: null,
      name: '',
      submenuOpened: false,
    },
    chatList: null,
    selectedChat: null,
    token: null,
    wsConnected: false,
    dialogArea: {
      messages: []
    }

  },
  globalModalMessage: {
    title: '',
    bodyMessage: '',
    visible: false,
  },
  user: null
};

class Store {
  private static __instance: Store;
  private state: IAppState;
  private eventBus: EventBus;
  private subscribed: boolean;

  constructor() {
    if (Store.__instance) {
      return Store.__instance;
    }

    this.state = initialState;
    this.eventBus = new EventBus();
    this.subscribed = false;
    Store.__instance = this;
  }

  public subscribe(path: string, callback: (currentState: unknown) => void) {
    // if the path is an empty string subscribes to the whole state
    let stateCache = path ? get(this.getState() as unknown as Record<string, unknown>, path) : this.getState();

    this.eventBus.on(StoreEvents.Updated, () => {
      const currentState = path ? get(this.getState() as unknown as Record<string, unknown>, path) : this.getState();

      if(!isEqual(stateCache, currentState)) {
        stateCache = currentState;
        callback(currentState);
      }
    });
    this.subscribed = true;
  }

  public getState() {
    return this.state;
  }

  public set(path: string, value: unknown) {
    this.state = set(this.state, path, value) as IAppState;

    if (path === 'authorized'){
      localStorage.setItem('authorized', (value as boolean).toString()); // cache auth status
    }

    if (this.subscribed) {
      this.eventBus.emit(StoreEvents.Updated);
    }
  }
}

export default Store;
