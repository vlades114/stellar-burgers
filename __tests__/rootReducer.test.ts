import store, { rootReducer } from '@store';

describe('Проверка rootReducer', () => {
  test('Вызов rootReducer с undefined состоянием и экшеном, который не обрабатывается ни одним редьюсером и возвращает корректное начальное состояние хранилища', () => {
    const initialState = store.getState();

    const newState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(newState).toEqual(initialState);
  });
});
