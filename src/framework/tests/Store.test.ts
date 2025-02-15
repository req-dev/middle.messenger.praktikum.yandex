import Store from '../Store';

describe('Store', () => {
  let store: Store;

  beforeEach(() => {
    store = new Store();
  });

  test('should be only one instance (singleton)', () => {
    const secondStore = new Store();

    expect(store).toStrictEqual(secondStore);
  });

  test('should change the value in the Store', () => {
    const newValue = true;

    store.set('testValue', newValue);
    const changedValue = store.getState().testValue;

    expect(changedValue).toBe(newValue);

  });

  test('should call the callback about store changes after subscribe to the whole state', () => {

    const callback = jest.fn();
    // path isn't specified intentionally to subscribe to the whole state
    store.subscribe('', () => callback());

    store.set('random value', true);

    expect(callback).toBeCalled();

  });

  test('should call the callback about store changes after subscribe to a specific path', () => {

    const callback = jest.fn();
    store.subscribe('testValue2', () => callback());

    store.set('testValue2', true);

    expect(callback).toBeCalled();

  });

});
