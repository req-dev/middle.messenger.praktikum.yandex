import { EventBus } from './EventBus';
import set from '../unitilies/set';
import { IFormStateData } from '../components/Form';
import { UserModel } from '../types/data';

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
    modal: { formData: IFormStateData },
    userData?: UserModel,
    editingPasswordMode: boolean,
    editingMode: boolean,
  },
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
    modal: { formData: { disabled: false } },
    editingPasswordMode: false,
    editingMode: false,
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
