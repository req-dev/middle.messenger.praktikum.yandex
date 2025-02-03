import SignupApi, { SignupFormModel } from '../api/signup-api';
import store from '../framework/Store';
import Router from '../framework/Router';
import UserSessionController from './user-session-controller';

const signupApi = new SignupApi();
const router = new Router();
const userAuthController = new UserSessionController();

class UserSignupController {
  private static __instance: UserSignupController;
  constructor() {
    if (UserSignupController.__instance) {
      return UserSignupController.__instance;
    }
    UserSignupController.__instance = this;
  }

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
        case 409:
          store.set('signupPage.FormStateData.generalFormError', 'Conflict: User is already registered.');
          break;
        case 500:
          router.go('/500');
          break;
        case 200:
          store.set('globalModalMessage', {
            title: 'Welcome',
            bodyMessage: 'Your account has been created successfully.',
            visible: true
          });
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
      store.set('signupPage.FormStateData.disabled', false);
    }
  }
}

export default UserSignupController;
