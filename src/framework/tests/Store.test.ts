import store from '../Store';

describe('Store', () => {

  test('should change the value in the Store', () => {
    const newValue = true;

    store.set('testValue', newValue);
    const changedValue = store.getState().testValue;

    expect(changedValue).toBe(newValue);

  });

  test('should notify about store changes after subscribe to the whole state', () => {

    const callback = jest.fn();
    store.subscribe('', () => callback()); // path isn't specified

    store.set('random value', true);

    expect(callback).toBeCalled();

  });

  test('should notify about store changes after subscribe to a specific path', () => {

    const callback = jest.fn();
    store.subscribe('testValue2', () => callback());

    store.set('testValue2', true);

    expect(callback).toBeCalled();

  });

});
