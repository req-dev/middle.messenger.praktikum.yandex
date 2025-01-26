import SignupApi from '../api/signup-api';
import store from '../framework/Store';
import Router from '../framework/Router';
import UserSessionController from './user-session-controller';
import { SignupFormModel } from '../types/data';

const signupApi = new SignupApi();
const router = new Router();
const userAuthController = new UserSessionController();

class UserSignupController {
  public async signup(data: SignupFormModel) {
    try {
      // Запускаем крутилку
      store.set('signupPage.FormStateData', {
        generalFormError: '',
        disabled: true
      });

      const result = await signupApi.request(data);

      switch (result.status) {
        case 401:
          store.set('signupPage.FormStateData.generalFormError', result.response.reason);
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
      store.set('signupPage.FormStateData.generalFormError', 'Request failed, check your internet connection');
    } finally {
      // Останавливаем крутилку
      store.set('signupPage.FormStateData.disabled', false);
    }
  }
}

export default UserSignupController;
