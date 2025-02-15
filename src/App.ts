import * as Pages from './pages';
import '../global.pcss';
import Router, { Routes } from './framework/Router';

export default class App {
  private _rootQuery: string;
  constructor(rootQuery: string) {
    this._rootQuery = rootQuery;
  }

  render(){
    const router = new Router(this._rootQuery);

    router
      .use(Routes.SignIn, Pages.SignInPage)
      .use(Routes.SignUp, Pages.SignUpPage)
      .use(Routes.Messenger, Pages.ChatsPage)
      .use(Routes.Settings, Pages.ProfilePage)
      .use(Routes.Error404, Pages.Error404)
      .use(Routes.Error500, Pages.Error500)
      .start();
  }
}
