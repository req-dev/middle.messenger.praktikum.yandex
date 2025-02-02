import * as Pages from './pages';
import '../global.pcss';
import Router from './framework/Router';

export default class App {
  private _rootQuery: string;
  constructor(rootQuery: string) {
    this._rootQuery = rootQuery;
  }

  render(){
    const router = new Router(this._rootQuery);

    router
      .use('/', Pages.SignInPage)
      .use('/sign-up', Pages.SignUpPage)
      .use('/messenger', Pages.ChatsPage)
      .use('/settings', Pages.ProfilePage)
      .use('/404', Pages.Error404)
      .use('/500', Pages.Error500)
      .start();
  }
}
