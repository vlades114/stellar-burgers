import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuid } from 'uuid';
export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<TIngredient | null>) {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare(ingredient: TIngredient) {
        return {
          payload: {
            ...ingredient,
            id: uuid()
          }
        };
      }
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveUpIngredient(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index > 0) {
        const ingredient = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = ingredient;
      }
    },
    moveDownIngredient(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        const ingredient = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = ingredient;
      }
    },
    resetConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    getBurgerConstructor: (state) => state
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  resetConstructor
} = burgerConstructorSlice.actions;

export const { getBurgerConstructor } = burgerConstructorSlice.selectors;
