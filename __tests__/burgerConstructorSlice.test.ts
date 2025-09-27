import {
  burgerConstructorSlice,
  initialState,
  addBun,
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  resetConstructor
} from '../src/services/slices/burgerConstructor';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { v4 as uuid } from 'uuid';

// Мок для uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid')
}));

// Моковые данные
const mockBun: TIngredient = {
  _id: 'bun1',
  name: 'Test Bun',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: '',
  image_mobile: '',
  image_large: ''
};

const mockMain: TIngredient = {
  _id: 'main1',
  name: 'Test Main',
  type: 'main',
  proteins: 30,
  fat: 20,
  carbohydrates: 5,
  calories: 300,
  price: 500,
  image: '',
  image_mobile: '',
  image_large: ''
};

const mockConstructorMain: TConstructorIngredient = {
  ...mockMain,
  id: 'mocked-uuid'
};

describe('Тестирование burgerConstructorSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Проверка initial state для unknown action', () => {
    const state = burgerConstructorSlice.reducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialState);
  });

  it('Проверка addBun', () => {
    const state = burgerConstructorSlice.reducer(initialState, addBun(mockBun));
    expect(state).toEqual({
      ...initialState,
      bun: mockBun
    });
  });

  it('Проверка addIngredient для булки', () => {
    const state = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(mockBun)
    );
    expect(state).toEqual({
      ...initialState,
      bun: { ...mockBun, id: 'mocked-uuid' }
    });
  });

  it('Проверка addIngredient для начинки', () => {
    const state = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(mockMain)
    );
    expect(state).toEqual({
      ...initialState,
      ingredients: [mockConstructorMain]
    });
  });

  it('Проверка removeIngredient', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [mockConstructorMain]
    };
    const state = burgerConstructorSlice.reducer(
      stateWithIngredients,
      removeIngredient('mocked-uuid')
    );
    expect(state).toEqual(initialState);
  });

  it('Проверка moveUpIngredient', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        { ...mockMain, id: 'id1' },
        { ...mockMain, id: 'id2', _id: 'main2' }
      ]
    };
    const state = burgerConstructorSlice.reducer(
      stateWithIngredients,
      moveUpIngredient(1)
    );
    expect(state).toEqual({
      ...initialState,
      ingredients: [
        { ...mockMain, id: 'id2', _id: 'main2' },
        { ...mockMain, id: 'id1' }
      ]
    });
  });

  it('Проверка moveUpIngredient для index = 0 (не меняет порядок)', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        { ...mockMain, id: 'id1' },
        { ...mockMain, id: 'id2', _id: 'main2' }
      ]
    };
    const state = burgerConstructorSlice.reducer(
      stateWithIngredients,
      moveUpIngredient(0)
    );
    expect(state).toEqual(stateWithIngredients);
  });

  it('Проверка moveDownIngredient', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        { ...mockMain, id: 'id1' },
        { ...mockMain, id: 'id2', _id: 'main2' }
      ]
    };
    const state = burgerConstructorSlice.reducer(
      stateWithIngredients,
      moveDownIngredient(0)
    );
    expect(state).toEqual({
      ...initialState,
      ingredients: [
        { ...mockMain, id: 'id2', _id: 'main2' },
        { ...mockMain, id: 'id1' }
      ]
    });
  });

  it('Проверка moveDownIngredient для последнего index (не меняет порядок)', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [
        { ...mockMain, id: 'id1' },
        { ...mockMain, id: 'id2', _id: 'main2' }
      ]
    };
    const state = burgerConstructorSlice.reducer(
      stateWithIngredients,
      moveDownIngredient(1)
    );
    expect(state).toEqual(stateWithIngredients);
  });

  it('Проверка resetConstructor', () => {
    const stateWithData = {
      bun: mockBun,
      ingredients: [mockConstructorMain]
    };
    const state = burgerConstructorSlice.reducer(
      stateWithData,
      resetConstructor()
    );
    expect(state).toEqual(initialState);
  });
});
