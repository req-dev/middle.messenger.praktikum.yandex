import ProfileApi, { UpdateProfileRequest } from '../api/profile-api';
import PasswordApi, { UpdatePasswordRequest } from '../api/password-api';
import Store from '../framework/Store';
import Router, { Routes } from '../framework/Router';
import { UserModel } from '../types/data';
import AvatarApi from '../api/avatar-api';

const store = new Store();
const profileApi = new ProfileApi();
const passwordApi = new PasswordApi();
const avatarApi = new AvatarApi();
const router = new Router();

class UserAccountController {
  private static __instance: UserAccountController;
  constructor() {
    if (UserAccountController.__instance) {
      return UserAccountController.__instance;
    }
    UserAccountController.__instance = this;
  }

  public async updateProfile(data: UpdateProfileRequest) {
    let willExitEditingMode = true;
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
          willExitEditingMode = false;
          store.set('profilePage.editProfileFormData.generalFormError', result.response.reason);
          break;
        case 500:
          router.go(Routes.Error500);
          break;
        case 200:
          store.set('profilePage.userData', result.response as UserModel);
          store.set('globalModalMessage', {
            title: 'Done',
            bodyMessage: 'Your profile has been successfully updated.',
            visible: true
          });
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
      store.set('profilePage.editProfileFormData.disabled', false);
      if (willExitEditingMode) {
        store.set('profilePage.editingMode', false);
      }
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
          router.go(Routes.Error500);
          break;
        case 200:
          store.set('globalModalMessage', {
            title: 'Done',
            bodyMessage: 'Your password has been updated successfully. Please try to remember it at least one week :)',
            visible: true
          });
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
      store.set('profilePage.editPasswordFormData.disabled', false);
      if (willExitEditingMode){
        store.set('profilePage', {
          editingPasswordMode: false,
          editingMode: false,
        });
      }
    }
  }

  public async updateAvatar(data: FormData) {
    try {
      // Запускаем крутилку
      store.set('profilePage.updateAvatarModal', {
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
          store.set('profilePage.updateAvatarModal.formData.generalFormError', result.response.reason);
          break;
        case 500:
          router.go(Routes.Error500);
          break;
        case 200:
          store.set('profilePage.userData', result.response as UserModel);
          store.set('profilePage.updateAvatarModal.visible', false);
          store.set('globalModalMessage', {
            title: 'Done',
            bodyMessage: 'Your profile avatar has been successfully updated. Enjoy!',
            visible: true
          });
      }

    } catch (error) {
      console.error(error);
      store.set('profilePage.updateAvatarModal.formData.generalFormError', 'Request failed, check your internet connection and try again');
    } finally {
      // Останавливаем крутилку
      store.set('profilePage.updateAvatarModal', {
        closable: true,
        formData: {
          disabled: false
        }
      });
    }
  }

}

export default UserAccountController;
