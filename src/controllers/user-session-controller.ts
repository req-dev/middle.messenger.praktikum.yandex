import SessionApi from '../api/session-api';
import store from '../framework/Store';
import Router from '../framework/Router';

const authApi = new SessionApi();
const router = new Router();

class UserSessionController {
  private static __instance: UserSessionController;
  constructor() {
    if (UserSessionController.__instance) {
      return UserSessionController.__instance;
    }
    UserSessionController.__instance = this;
  }

  public async getUser() {
    try {
      const result = await authApi.request();

      switch (result.status) {
        case 401:
          store.set('authorized', false);
          break;
        case 500:
          router.go('/500');
          break;
        case 200:
          store.set('authorized', true);
          store.set('user', result.response);
          store.set('profilePage.userData', result.response);
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

  public async logout() {
    try {
      const result = await authApi.delete();

      switch (result.status) {
        case 500:
          router.go('/500');
          break;
        case 200:
          store.set('authorized', false);
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
}

export default UserSessionController;
