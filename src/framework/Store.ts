import { EventBus } from './EventBus';
import set from '../unitilies/set';
import get from '../unitilies/get';
import { IFormStateData } from '../components/Form';
import { UserModel, ChatListItemModel } from '../types/data';
import isEqual from '../unitilies/isEqual';

export enum StoreEvents {
  Updated = 'updated',
}

export interface IAppState {
  authorized: boolean,
  signinPage: { FormStateData?: IFormStateData },
  signupPage: { FormStateData?: IFormStateData },
  profilePage: {
    editAvatarFormData: IFormStateData,
    editProfileFormData: IFormStateData,
    editPasswordFormData: IFormStateData,
    updateAvatarModal: {
      formData: IFormStateData,
      closable: boolean,
      visible: boolean,
    },
    userData?: UserModel,
    editingPasswordMode: boolean,
    editingMode: boolean,
  },
  chatsPage: {
    createChatModal: { formData: IFormStateData },
    chatList: ChatListItemModel[] | null,
    selectedChat: number | null,
    token: string | null,
    wsConnected: boolean
  },
  globalModalMessage: {
    title: string,
    bodyMessage: string,
    visible: boolean,
  }
  user: UserModel | null
}

const initialState: IAppState = {
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
    createChatModal: { formData: { disabled: false } },
    chatList: null,
    selectedChat: null,
    token: null,
    wsConnected: false
  },
  globalModalMessage: {
    title: '',
    bodyMessage: '',
    visible: false,
  },
  user: null
};

class Store {
  private state: IAppState;
  private eventBus: EventBus;

  constructor() {
    this.state = initialState;
    this.eventBus = new EventBus();
  }

  public onUpdate(callback: (...args: unknown) => void) {
    this.eventBus.on(StoreEvents.Updated, callback);
  }

  public subscribe(path: string, callback: (currentState: unknown) => void) {
    let stateCache = get(this.getState(), path);

    this.eventBus.on(StoreEvents.Updated, () => {
      const currentState = get(this.getState(), path);

      if(!isEqual(stateCache, currentState)) {
        stateCache = currentState;
        callback(currentState);
      }
    });
  }

  public getState() {
    return this.state;
  }

  public set(path: string, value: unknown) {
    this.state = set(this.state, path, value) as IAppState;

    if (path === 'authorized'){
      localStorage.setItem('authorized', value.toString()); // cache auth status
    }

    this.eventBus.emit(StoreEvents.Updated);
  }
}

export default new Store();
