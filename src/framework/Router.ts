import Route from './Route';
import Block from './Block';
import store from './Store';
import UserSessionController from '../controllers/user-session-controller';

const pagesRequireAuth = ['/messenger', '/settings'];
const authPages = ['/', '/sign-up'];

class Router {

  private static __instance: Router;
  private authorized: boolean;
  private routes: Route[];
  private history: History;
  private _currentRoute: Route | null;
  private _rootQuery: string;
  private userSessionController: UserSessionController;

  constructor(rootQuery: string = '#app') {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;
    this.authorized = false;
    this.userSessionController = new UserSessionController();

    store.subscribe('authorized', () => {
      this.stateChanged();
    })

    Router.__instance = this;
  }

  use(pathname: string, block: new (...args: unknown[]) => Block) {
    const route = new Route(pathname, block, {rootQuery: this._rootQuery});

    this.routes.push(route);

    return this;
  }

  start() {
    this.authorized = store.getState().authorized;
    // rerender when pathname is updated
    window.onpopstate = event => {
      this._onRoute(event.currentTarget.location.pathname);
    };

    this.go(window.location.pathname);
    this.userSessionController.getUser();
  }

  _onRoute(pathname) {
    let route = this.getRoute(pathname);
    if (!route) {
      route = this.getRoute('/404')!;
    }

    if (this._currentRoute) {
      this._currentRoute.leave();
    }
    this._currentRoute = route;

    route.render();
  }

  go(pathname) {
    // forbid redirect if an unauthorized user tries to go anywhere but allowed pages
    const redirectForbidden = this.authorized ? authPages.includes(pathname) : pagesRequireAuth.includes(pathname);
    if (redirectForbidden) {
      pathname = this.authorized ? '/messenger' : '/';
    }

    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  getRoute(pathname) {
    return this.routes.find(route => route.match(pathname));
  }

  private _rerenderAuthPages() {
    const messenger = this.getRoute('/messenger');
    const settings = this.getRoute('/settings');

    if (messenger) {
      messenger.forceRerender();
    }
    if (settings) {
      settings.forceRerender();
    }
  }

  stateChanged() {
    const stateAuthorized = store.getState().authorized;
    this.authorized = stateAuthorized;
    if (stateAuthorized) {
      this._rerenderAuthPages();
    }
    this.go(stateAuthorized ? '/messenger' : '/');
  }
}

export default Router;
