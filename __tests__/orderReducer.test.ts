import {
  initialStateOrdersList,
  ordersListSlice,
  fetchOrders,
  initialStateOrdersDetails,
  orderDetailsSlice,
  fetchOrder,
  createOrder,
  clearOrderModal
} from '../src/services/slices/orders';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: 'order1',
    name: 'Test Burger',
    ingredients: ['bun1', 'main1'],
    status: 'done',
    number: 12345,
    createdAt: '2025-09-27T00:00:00.000Z',
    updatedAt: '2025-09-27T00:00:00.000Z'
  }
];

const mockOrder: TOrder = {
  _id: 'order1',
  name: 'Test Burger',
  ingredients: ['bun1', 'main1'],
  status: 'done',
  number: 12345,
  createdAt: '2025-09-27T00:00:00.000Z',
  updatedAt: '2025-09-27T00:00:00.000Z'
};

const mockOrderModal = {
  order: mockOrder,
  name: 'Test Burger'
};

describe('Тестирование ordersListSlice', () => {
  test('Проверка initial state для unknown action', () => {
    const state = ordersListSlice.reducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialStateOrdersList);
  });

  test('Проверка fetchOrders.pending', () => {
    const state = ordersListSlice.reducer(
      initialStateOrdersList,
      fetchOrders.pending('')
    );
    expect(state).toEqual({
      ...initialStateOrdersList,
      loading: true,
      error: null
    });
  });

  test('Проверка fetchOrders.fulfilled', () => {
    const state = ordersListSlice.reducer(
      initialStateOrdersList,
      fetchOrders.fulfilled(mockOrders, '')
    );
    expect(state).toEqual({
      ...initialStateOrdersList,
      loading: false,
      data: mockOrders
    });
  });

  test('Проверка fetchOrders.rejected', () => {
    const errorMessage = 'Failed to fetch orders';
    const action = {
      type: fetchOrders.rejected.type,
      payload: errorMessage,
      error: { message: errorMessage }
    };
    const state = ordersListSlice.reducer(initialStateOrdersList, action);
    expect(state).toEqual({
      ...initialStateOrdersList,
      loading: false,
      error: errorMessage
    });
  });
});

describe('Тестирование orderDetailsSlice', () => {
  test('Проверка initial state для unknown action', () => {
    const state = orderDetailsSlice.reducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialStateOrdersDetails);
  });

  test('Проверка clearOrderModal', () => {
    const stateWithData = {
      ...initialStateOrdersDetails,
      data: mockOrderModal
    };
    const state = orderDetailsSlice.reducer(stateWithData, clearOrderModal());
    expect(state).toEqual(initialStateOrdersDetails);
  });

  test('Проверка fetchOrder.pending', () => {
    const state = orderDetailsSlice.reducer(
      initialStateOrdersDetails,
      fetchOrder.pending('', 12345)
    );
    expect(state).toEqual({
      ...initialStateOrdersDetails,
      loading: true,
      error: null
    });
  });

  test('Проверка fetchOrder.fulfilled', () => {
    const state = orderDetailsSlice.reducer(
      initialStateOrdersDetails,
      fetchOrder.fulfilled(mockOrder, '', 12345)
    );
    expect(state).toEqual({
      ...initialStateOrdersDetails,
      loading: false,
      data: { order: mockOrder, name: mockOrder.name }
    });
  });

  test('Проверка fetchOrder.rejected', () => {
    const errorMessage = 'Order not found';
    const action = {
      type: fetchOrder.rejected.type,
      payload: errorMessage,
      error: { message: errorMessage }
    };
    const state = orderDetailsSlice.reducer(initialStateOrdersDetails, action);
    expect(state).toEqual({
      ...initialStateOrdersDetails,
      loading: false,
      error: errorMessage
    });
  });

  test('Проверка createOrder.pending', () => {
    const state = orderDetailsSlice.reducer(
      initialStateOrdersDetails,
      createOrder.pending('', ['bun1', 'main1'])
    );
    expect(state).toEqual({
      ...initialStateOrdersDetails,
      orderRequest: true,
      error: null
    });
  });

  test('Проверка createOrder.fulfilled', () => {
    const state = orderDetailsSlice.reducer(
      initialStateOrdersDetails,
      createOrder.fulfilled(mockOrderModal, '', ['bun1', 'main1'])
    );
    expect(state).toEqual({
      ...initialStateOrdersDetails,
      orderRequest: false,
      data: mockOrderModal
    });
  });

  test('Проверка createOrder.rejected', () => {
    const errorMessage = 'Failed to create order';
    const action = {
      type: createOrder.rejected.type,
      payload: errorMessage,
      error: { message: errorMessage }
    };
    const state = orderDetailsSlice.reducer(initialStateOrdersDetails, action);
    expect(state).toEqual({
      ...initialStateOrdersDetails,
      orderRequest: false,
      error: errorMessage
    });
  });

  describe('fetchOrder thunk', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('dispatches fulfilled when fetch succeeds', async () => {
      const mockDispatch = jest.fn();
      const mockGetState = jest
        .fn()
        .mockReturnValue({ orderDetails: initialStateOrdersDetails });
      jest
        .spyOn(require('@api'), 'getOrderByNumberApi')
        .mockResolvedValue({ success: true, orders: [mockOrder] });

      await fetchOrder(12345)(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchOrder.pending.type
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchOrder.fulfilled.type,
          payload: mockOrder
        })
      );
    });

    test('dispatches rejected when fetch fails', async () => {
      const mockDispatch = jest.fn();
      const mockGetState = jest
        .fn()
        .mockReturnValue({ orderDetails: initialStateOrdersDetails });
      const errorMessage = 'Order not found';
      jest
        .spyOn(require('@api'), 'getOrderByNumberApi')
        .mockResolvedValue({ success: false, orders: [] });

      await fetchOrder(12345)(mockDispatch, mockGetState, undefined);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchOrder.pending.type
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fetchOrder.rejected.type,
          payload: errorMessage
        })
      );
    });
  });
});
