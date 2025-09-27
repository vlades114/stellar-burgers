import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

import {
  TRegisterData,
  registerUserApi,
  TLoginData,
  loginUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';

import { deleteCookie, setCookie } from '@utils-cookie';
import { startTrackValue } from '@testing-library/user-event/dist/types/document/trackValue';

type TUserState = {
  data: TUser;
  loading: boolean;
  error: string | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
};

export const initialState: TUserState = {
  data: {
    email: '',
    name: ''
  },
  loading: false,
  error: null,
  isAuthenticated: false,
  isAuthChecked: false
};

const setToken = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', String(accessToken));
  localStorage.setItem('refreshToken', String(refreshToken));
};

const clearToken = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const register = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data, { rejectWithValue }) => {
    try {
      const { user, refreshToken, accessToken } = await registerUserApi(data);
      setToken(accessToken, refreshToken);
      return user;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to register';
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      const { user, refreshToken, accessToken } = response;
      setToken(accessToken, refreshToken);
      return user;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to login';
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (data, { rejectWithValue }) => {
    try {
      const { user } = await updateUserApi(data);
      return user;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to update user';
      return rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk<boolean, Pick<TUser, 'email'>>(
  'user/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      const { success } = await forgotPasswordApi(data);
      return success;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to send password reset';
      return rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk<
  boolean,
  { password: string; token: string }
>('user/resetPassword', async (data, { rejectWithValue }) => {
  try {
    const { success } = await resetPasswordApi(data);
    return success;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to reset password';
    return rejectWithValue(message);
  }
});

export const fetchUser = createAsyncThunk<TUser, void>(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { user } = await getUserApi();
      return user;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch user';
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk<void, void>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      clearToken();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to logout';
      return rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsisAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthChecked = true;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.data = { email: '', name: '' };
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    getUser: (state) => state.data,
    getIsAuthenticated: (state) => state.isAuthenticated,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getUserLoading: (state) => state.loading,
    getUserError: (state) => state.error
  }
});

export const { setIsisAuthChecked, clearError } = userSlice.actions;

export const {
  getUser,
  getIsAuthenticated,
  getIsAuthChecked,
  getUserLoading,
  getUserError
} = userSlice.selectors;
