import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

type TOrdersListState = {
  data: TOrder[];
  loading: boolean;
  error: string | null;
};

export const initialState: TOrdersListState = {
  data: [],
  loading: false,
  error: null
};

export const fetchOrders = createAsyncThunk<TOrder[], void>(
  'ordersList/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch orders';
      return rejectWithValue(message);
    }
  }
);

export const ordersListSlice = createSlice({
  name: 'ordersList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    getOrderListData: (state) => state.data
  }
});

export const { getOrderListData } = ordersListSlice.selectors;
