import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';

type TFeedsState = {
  data: TOrdersData;
  loading: boolean;
  error: string | null;
};

export const initialState: TFeedsState = {
  data: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<TOrdersData, void>(
  'feeds/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch feeds';
      return rejectWithValue(message);
    }
  }
);

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    getFeeds: (state) => state.data,
    getFeedsOrders: (state) => state.data?.orders || [],
    getFeedsLoading: (state) => state.loading
  }
});

export const { getFeeds, getFeedsOrders, getFeedsLoading } =
  feedsSlice.selectors;
