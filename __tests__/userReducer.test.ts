import {
  userSlice,
  initialState,
  register,
  login,
  updateUser,
  forgotPassword,
  resetPassword,
  fetchUser,
  logout,
  setIsisAuthChecked,
  clearError
} from '../src/services/slices/user/userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockTokens = {
  accessToken: 'fakeAccessToken',
  refreshToken: 'fakeRefreshToken'
};

describe('Тестирование userSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Проверка initial state для unknown action', () => {
    const state = userSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('Проверка setIsisAuthChecked', () => {
    const state = userSlice.reducer(initialState, setIsisAuthChecked(true));
    expect(state).toEqual({ ...initialState, isAuthChecked: true });
  });

  test('Проверка clearError', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const state = userSlice.reducer(stateWithError, clearError());
    expect(state).toEqual(initialState);
  });

  describe('register', () => {
    test('Проверка register.pending', () => {
      const state = userSlice.reducer(
        initialState,
        register.pending('', { email: '', name: '', password: '' })
      );
      expect(state).toEqual({ ...initialState, loading: true, error: null });
    });

    test('Проверка register.fulfilled', () => {
      const state = userSlice.reducer(
        initialState,
        register.fulfilled(mockUser, '', { email: '', name: '', password: '' })
      );
      expect(state).toEqual({
        ...initialState,
        data: mockUser,
        loading: false,
        isAuthenticated: true,
        isAuthChecked: true
      });
    });

    test('Проверка register.rejected', () => {
      const errorMessage = 'Failed to register';
      const action = {
        type: register.rejected.type,
        payload: errorMessage,
        error: { message: errorMessage }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('login', () => {
    test('Проверка login.pending', () => {
      const state = userSlice.reducer(
        initialState,
        login.pending('', { email: '', password: '' })
      );
      expect(state).toEqual({ ...initialState, loading: true, error: null });
    });

    test('Проверка login.fulfilled', () => {
      const state = userSlice.reducer(
        initialState,
        login.fulfilled(mockUser, '', { email: '', password: '' })
      );
      expect(state).toEqual({
        ...initialState,
        data: mockUser,
        loading: false,
        isAuthenticated: true,
        isAuthChecked: true
      });
    });

    test('Проверка login.rejected', () => {
      const errorMessage = 'Failed to login';
      const action = {
        type: login.rejected.type,
        payload: errorMessage,
        error: { message: errorMessage }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('updateUser', () => {
    test('Проверка updateUser.pending', () => {
      const state = userSlice.reducer(
        initialState,
        updateUser.pending('', { email: '', name: '', password: '' })
      );
      expect(state).toEqual({ ...initialState, loading: true, error: null });
    });

    test('Проверка updateUser.fulfilled', () => {
      const state = userSlice.reducer(
        initialState,
        updateUser.fulfilled(mockUser, '', {
          email: '',
          name: '',
          password: ''
        })
      );
      expect(state).toEqual({
        ...initialState,
        loading: false,
        data: mockUser
      });
    });

    test('Проверка updateUser.rejected', () => {
      const errorMessage = 'Failed to update user';
      const action = {
        type: updateUser.rejected.type,
        payload: errorMessage,
        error: { message: errorMessage }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('forgotPassword', () => {
    test('Проверка forgotPassword.pending', () => {
      const state = userSlice.reducer(
        initialState,
        forgotPassword.pending('', { email: '' })
      );
      expect(state).toEqual({ ...initialState, loading: true, error: null });
    });

    test('Проверка forgotPassword.fulfilled', () => {
      const state = userSlice.reducer(
        initialState,
        forgotPassword.fulfilled(true, '', { email: '' })
      );
      expect(state).toEqual({ ...initialState, loading: false });
    });

    test('Проверка forgotPassword.rejected', () => {
      const errorMessage = 'Failed to send password reset';
      const action = {
        type: forgotPassword.rejected.type,
        payload: errorMessage,
        error: { message: errorMessage }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('resetPassword', () => {
    test('Проверка resetPassword.pending', () => {
      const state = userSlice.reducer(
        initialState,
        resetPassword.pending('', { password: '', token: '' })
      );
      expect(state).toEqual({ ...initialState, loading: true, error: null });
    });

    test('Проверка resetPassword.fulfilled', () => {
      const state = userSlice.reducer(
        initialState,
        resetPassword.fulfilled(true, '', { password: '', token: '' })
      );
      expect(state).toEqual({ ...initialState, loading: false });
    });

    test('Проверка resetPassword.rejected', () => {
      const errorMessage = 'Failed to reset password';
      const action = {
        type: resetPassword.rejected.type,
        payload: errorMessage,
        error: { message: errorMessage }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('fetchUser', () => {
    test('Проверка fetchUser.pending', () => {
      const state = userSlice.reducer(initialState, fetchUser.pending(''));
      expect(state).toEqual({ ...initialState, loading: true });
    });

    test('Проверка fetchUser.fulfilled', () => {
      const state = userSlice.reducer(
        initialState,
        fetchUser.fulfilled(mockUser, '')
      );
      expect(state).toEqual({
        ...initialState,
        data: mockUser,
        loading: false,
        isAuthenticated: true,
        isAuthChecked: true
      });
    });

    test('Проверка fetchUser.rejected', () => {
      const errorMessage = 'Failed to fetch user';
      const action = {
        type: fetchUser.rejected.type,
        payload: errorMessage,
        error: { message: errorMessage }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage,
        isAuthChecked: true
      });
    });
  });

  describe('logout', () => {
    test('Проверка logout.pending', () => {
      const state = userSlice.reducer(initialState, logout.pending(''));
      expect(state).toEqual({ ...initialState, loading: true, error: null });
    });

    test('Проверка logout.fulfilled', () => {
      const state = userSlice.reducer(
        { ...initialState, data: mockUser, isAuthenticated: true },
        logout.fulfilled(undefined, '')
      );
      expect(state).toEqual({
        ...initialState,
        data: { email: '', name: '' },
        loading: false,
        isAuthenticated: false
      });
    });

    test('Проверка logout.rejected', () => {
      const errorMessage = 'Failed to logout';
      const action = {
        type: logout.rejected.type,
        payload: errorMessage,
        error: { message: errorMessage }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });
});
