import Router, { Routes } from '../Router';

// Mock the Store class
jest.mock('../Store', () => {
  let instance: any;
  return {
    default: jest.fn().mockImplementation(() => {
      if (instance) {
        return instance;
      }

      let state = { authorized: false };
      let callback = () => {};
      instance = {
        set: jest.fn((path: string, authorized: boolean) => {
          if (path === 'authorized') {
            state = { authorized };
            callback();
          }
        }),
        subscribe: jest.fn((_: string, cb: () => void) => {
          callback = cb;
        }),
        getState: jest.fn(() => state),
      };

      return instance;
    }),
  };
});

// Mock the Block class
jest.mock('../Block', () => {
  return {
    default: jest.fn().mockImplementation(() => {
      return {
        dispatchComponentDidMount: jest.fn(),
        dispatchComponentDestroy: jest.fn(),
        hide: jest.fn(),
        show: jest.fn(),
        getContent: jest.fn(() => document.createElement('div')),
        render: jest.fn(() => ''),
      };
    }),
  };
});

// import mocked modules
import Block from '../Block';
import Store from '../Store';

class FakeBlock extends Block {
  constructor() {
    super();
  }
  render() {
    return '';
  }
}

describe('Router', () => {
  let router: Router;

  beforeEach(() => {
    jest.resetModules();

    // Clear the singleton instances
    (Store as any).__instance = null;
    (Router as any).__instance = null;

    document.body.innerHTML = '<body><main id="app"></main></body>';
    router = new Router();
  });

  it('should be only one instance (singleton)', () => {
    const secondRouter = new Router();

    expect(router).toStrictEqual(secondRouter);
  });

  it('Should stay be at the auth page', () => {
    router
      .use(Routes.SignIn, FakeBlock)
      .use(Routes.Messenger, FakeBlock);

    router.start();

    expect(window.location.pathname).toBe('/');
  });

  it('Should redirect to the sign-up page', () => {
    router
      .use(Routes.SignIn, FakeBlock)
      .use(Routes.SignUp, FakeBlock)
      .start();

    router.go(Routes.SignUp);

    expect(window.location.pathname).toBe('/sign-up');
  });

  it('Should redirect to the auth page', () => {
    window.history.pushState({}, "", '/messenger');
    router
      .use(Routes.SignIn, FakeBlock)
      .use(Routes.Messenger, FakeBlock);

    router.start();

    expect(window.location.pathname).toBe('/');
  });

  it('Should stay at the messenger page', () => {
    window.history.pushState({}, "", '/messenger');
    const store = new Store();
    store.set('authorized', true);
    router
      .use(Routes.SignIn, FakeBlock)
      .use(Routes.Messenger, FakeBlock)

    router.start();

    expect(window.location.pathname).toBe('/messenger');
  });

  it('Should redirect to the messenger page', () => {
    const store = new Store();
    store.set('authorized', true);
    router
      .use(Routes.SignIn, FakeBlock)
      .use(Routes.Messenger, FakeBlock)

    router.start();

    expect(window.location.pathname).toBe('/messenger');
  });

});
