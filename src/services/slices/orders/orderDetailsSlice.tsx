import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi, orderBurgerApi } from '@api';

type TOrderModal = { order: TOrder; name: string };

type TOrderDetailsState = {
  data: TOrderModal | null;
  orderRequest: boolean;
  loading: boolean;
  error: string | null;
};

export const initialState: TOrderDetailsState = {
  data: null,
  orderRequest: false,
  loading: false,
  error: null
};

export const fetchOrder = createAsyncThunk<TOrder, number>(
  'orderDetails/fetchOrder',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      if (!response?.success || !response.orders[0]) {
        return rejectWithValue('Order not found');
      }
      return response.orders[0];
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch order';
      return rejectWithValue(message);
    }
  }
);

export const createOrder = createAsyncThunk<TOrderModal, string[]>(
  'orderDetails/createOrder',
  async (data, { rejectWithValue }) => {
    try {
      return await orderBurgerApi(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to create order';
      return rejectWithValue(message);
    }
  }
);

export const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    clearOrderModal(state) {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = {
          order: action.payload,
          name: action.payload.name
        };
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.data = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    getOrderDetailsData: (state) => state.data,
    getOrderRequest: (state) => state.orderRequest
  }
});

export const { clearOrderModal } = orderDetailsSlice.actions;

export const { getOrderDetailsData, getOrderRequest } =
  orderDetailsSlice.selectors;
