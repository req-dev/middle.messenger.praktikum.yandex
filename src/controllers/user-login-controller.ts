import LoginApi from '../api/login-api';
import store from '../framework/Store';
import Router from '../framework/Router';
import UserSessionController from './user-session-controller';
import { LoginFormModel } from '../types/data';

const loginApi = new LoginApi();
const router = new Router();
const userAuthController = new UserSessionController();

class UserLoginController {
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
          router.go('/500');
          break;
        case 200:
          await userAuthController.getUser();
          break;
      }


    } catch (error) {
      console.error(error);
      store.set('signinPage.FormStateData.generalFormError', 'Request failed, check your internet connection');
    } finally {
      // Останавливаем крутилку
      store.set('signinPage.FormStateData.disabled', false);
    }
  }
}

export default UserLoginController;
