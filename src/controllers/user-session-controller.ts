import SessionApi from '../api/session-api';
import store from '../framework/Store';

const authApi = new SessionApi();

class UserSessionController {
  public async getUser() {
    try {
      const result = await authApi.request();

      switch (result.status) {
        case 401:
          store.set('authorized', false);
          break;
        case 500:
          alert('500 error'); // TODO fix
          break;
        case 200:
          store.set('authorized', true);
          store.set('user', result.response);
          store.set('profilePage.userData', result.response);
          break;
      }

    } catch (error) {
      console.error(error);
      alert('Request failed, check your internet connection');
    }
  }

  public async logout() {
    try {
      const result = await authApi.delete();

      switch (result.status) {
        case 500:
          alert('500 error'); // TODO fix
          break;
        case 200:
          store.set('authorized', false);
          break;
      }

    } catch (error) {
      console.error(error);
      alert('Request failed, check your internet connection');
    }
  }
}

export default UserSessionController;
