import {
  feedsSlice,
  initialState,
  fetchFeeds
} from '../src/services/slices/feeds';
import { TOrdersData } from '@utils-types';

const mockFeeds: TOrdersData = {
  orders: [
    {
      _id: 'order1',
      ingredients: ['bun1', 'main1', 'sauce1'],
      status: 'done',
      name: 'Test Burger',
      number: 12345,
      createdAt: '2025-09-27T00:00:00.000Z',
      updatedAt: '2025-09-27T00:00:00.000Z'
    }
  ],
  total: 100,
  totalToday: 10
};

describe('Тестирование feedsSlice', () => {
  test('Проверка initial state для unknown action', () => {
    const state = feedsSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  it('Перворека fetchFeeds.pending', () => {
    const state = feedsSlice.reducer(initialState, fetchFeeds.pending(''));
    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('handles fetchFeeds.fulfilled', () => {
    const state = feedsSlice.reducer(
      initialState,
      fetchFeeds.fulfilled(mockFeeds, '')
    );
    expect(state).toEqual({
      ...initialState,
      loading: false,
      data: mockFeeds
    });
  });

  it('handles fetchFeeds.rejected', () => {
    const errorMessage = 'Failed to fetch feeds';
    const action = {
      type: fetchFeeds.rejected.type,
      payload: errorMessage,
      error: { message: errorMessage }
    };
    const state = feedsSlice.reducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });
});
