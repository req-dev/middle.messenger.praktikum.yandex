import ProfileApi from '../api/profile-api';
import PasswordApi from '../api/password-api';
import store from '../framework/Store';
import Router from '../framework/Router';
import { UpdatePasswordRequest, UpdateProfileRequest, UserModel } from '../types/data';
import AvatarApi from '../api/avatar-api';

const profileApi = new ProfileApi();
const passwordApi = new PasswordApi();
const avatarApi = new AvatarApi();
const router = new Router();

class UserAccountController {
  public async updateProfile(data: UpdateProfileRequest) {
    try {
      // Запускаем крутилку
      store.set('profilePage.editProfileFormData', {
        generalFormError: '',
        disabled: true
      });

      const result = await profileApi.update(data);

      switch (result.status) {
        case 401:
          store.set('authorized', false);
          break;
        case 400:
          store.set('profilePage.editProfileFormData.generalFormError', result.response.reason);
          break;
        case 500:
          router.go('/500');
          break;
        case 200:
          store.set('profilePage.userData', result.response as UserModel);
          break;
      }


    } catch (error) {
      console.error(error);
      store.set('profilePage.editProfileFormData.generalFormError', 'Request failed, check your internet connection');
    } finally {
      // Останавливаем крутилку
      store.set('profilePage.editProfileFormData.disabled', false);
      store.set('profilePage.editingMode', false);
    }
  }

  public async updatePassword(data: UpdatePasswordRequest) {
    let willExitEditingMode = true;
    try {
      // Запускаем крутилку
      store.set('profilePage.editPasswordFormData', {
        generalFormError: '',
        disabled: true
      });

      const result = await passwordApi.update(data);

      switch (result.status) {
        case 401:
          store.set('authorized', false);
          break;
        case 400:
          store.set('profilePage.editPasswordFormData.generalFormError', result.response.reason);
          willExitEditingMode = false;
          break;
        case 500:
          router.go('/500');
          break;
        case 200:
          // TODO: popup says everything was right
      }


    } catch (error) {
      console.error(error);
      store.set('profilePage.editPasswordFormData.generalFormError', 'Request failed, check your internet connection');
    } finally {
      // Останавливаем крутилку
      store.set('profilePage.editPasswordFormData.disabled', false);
      if (willExitEditingMode){
        store.set('profilePage.editingMode', false);
      }
    }
  }

  public async updateAvatar(data: FormData) {
    try {
      // Запускаем крутилку
      store.set('profilePage.modal', {
        closable: false,
        formData: {
          generalFormError: '',
          disabled: true
        }
      });

      const result = await avatarApi.update(data);

      switch (result.status) {
        case 401:
          store.set('authorized', false);
          break;
        case 400:
          store.set('profilePage.modal.formData.generalFormError', result.response.reason);
          break;
        case 500:
          router.go('/500');
          break;
        case 200:
          store.set('profilePage.userData', result.response as UserModel);
          store.set('profilePage.modal.visible', false);
      }

    } catch (error) {
      console.error(error);
      store.set('profilePage.modal.formData.generalFormError', 'Request failed, check your internet connection');
    } finally {
      // Останавливаем крутилку
      store.set('profilePage.modal.formData.disabled', false);
      store.set('profilePage.modal', {
        closable: true,
        formData: {
          disabled: false
        }
      });
    }
  }

}

export default UserAccountController;
