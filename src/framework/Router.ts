import Route from './Route';
import Block from './Block';
import Store from './Store';

export enum Routes {
  SignIn = '/',
  SignUp = '/sign-up',
  Messenger = '/messenger',
  Settings = '/settings',
  Error404 = '/404',
  Error500 = '/500',
}

const pagesRequireAuth = [Routes.Messenger, Routes.Settings];
const authPages = [Routes.SignIn, Routes.SignUp];

class Router {

  private store: Store;
  private static __instance: Router;
  private authorized: boolean;
  private routes: Route[];
  private history: History;
  private _currentRoute: Route | null;
  private readonly _rootQuery: string;

  constructor(rootQuery: string = '#app') {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.store = new Store();
    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;
    this.authorized = false;

    Router.__instance = this;
  }

  private getRouteEnumByLink(pathname: string): Routes | undefined {
    const routesMap: Record<string, Routes> = Object.entries(Routes).reduce((acc, [key, value]) => {
      acc[value] = Routes[key as keyof typeof Routes];
      return acc;
    }, {} as Record<string, Routes>);

    return routesMap[pathname];
  }

  use(pathname: string, block: new (...args: unknown[]) => Block) {
    const route = new Route(pathname, block, {rootQuery: this._rootQuery});

    this.routes.push(route);

    return this;
  }

  start() {
    this.authorized = this.store.getState().authorized;
    this.store.subscribe('authorized', () => {
      this.authStateChanged();
    });

    // rerender when pathname is updated
    window.addEventListener('popstate', (event) => {
      const target = event.currentTarget as Window;
      this._onRoute(target.location.pathname);
    });

    this.go(window.location.pathname);
  }

  private _onRoute(pathname: string) {
    let route = this.getRoute(pathname);
    if (!route) {
      route = this.getRoute(Routes.Error404)!;
    }

    if (this._currentRoute) {
      this._currentRoute.leave();
    }
    this._currentRoute = route;

    route.render();
  }

  go(pathname: string) {
    // forbid redirect if an unauthorized user tries to go anywhere but allowed pages
    const pathEnum = this.getRouteEnumByLink(pathname) ?? Routes.Error404;
    const redirectForbidden = this.authorized ? authPages.includes(pathEnum) : pagesRequireAuth.includes(pathEnum);
    if (redirectForbidden) {
      pathname = this.authorized ? Routes.Messenger : Routes.SignIn;
    }

    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  getRoute(pathname: string) {
    return this.routes.find(route => route.match(pathname));
  }

  authStateChanged() {
    this.authorized = this.store.getState().authorized;
    if (this.authorized) {
      this._rerenderAuthPages();
    }
    this.go(this.authorized ? Routes.Messenger : Routes.SignIn);
  }

  private _rerenderAuthPages() {
    const messenger = this.getRoute(Routes.Messenger);
    const settings = this.getRoute(Routes.Settings);

    if (messenger) {
      messenger.render(true);
    }
    if (settings) {
      settings.render(true);
    }
  }
}

export default Router;
