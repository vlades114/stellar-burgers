import {
  initialState,
  ingredientsSlice,
  fetchIngredients
} from '../src/services/slices/ingredients';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Bun',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('Тестирование ingredientsReducer', () => {
  it('Проверка initial state для unknown action', () => {
    const state = ingredientsSlice.reducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialState);
  });

  test('Проверка fetchIngredients.pending', () => {
    const state = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.pending('')
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
    expect(state.data).toEqual([]);
  });

  test('Проверка fetchIngredients.fulfilled', () => {
    const state = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.fulfilled(mockIngredients, '')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.data).toEqual(mockIngredients);
  });

  test('Проверка fetchIngredients.rejected', () => {
    const errorMessage = 'Failed to fetch ingredients';
    const action = {
      type: fetchIngredients.rejected.type,
      payload: errorMessage,
      error: { message: errorMessage }
    };

    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.data).toEqual([]);
  });
});
