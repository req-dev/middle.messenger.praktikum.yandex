import LoginApi, { LoginFormModel } from '../api/login-api';
import store from '../framework/Store';
import Router, { Routes } from '../framework/Router';
import UserSessionController from './user-session-controller';

const loginApi = new LoginApi();
const router = new Router();
const userAuthController = new UserSessionController();

class UserLoginController {
  private static __instance: UserLoginController;
  constructor() {
    if (UserLoginController.__instance) {
      return UserLoginController.__instance;
    }
    UserLoginController.__instance = this;
  }

  public async login(data: LoginFormModel) {
    try {
      // Запускаем крутилку
      store.set('signinPage.FormStateData', {
        generalFormError: '',
        disabled: true
      });

      const result = await loginApi.request(data);

      switch (result.status) {
        case 401:
          store.set('signinPage.FormStateData.generalFormError', result.response.reason);
          break;
        case 500:
          router.go(Routes.Error500);
          break;
        case 200:
          await userAuthController.getUser();
          break;
      }


    } catch (error) {
      console.error(error);
      store.set('globalModalMessage', {
        title: 'Network error',
        bodyMessage: 'Request failed, check your internet connection and try again',
        visible: true
      });
    } finally {
      // Останавливаем крутилку
      store.set('signinPage.FormStateData.disabled', false);
    }
  }
}

export default UserLoginController;
