import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  isAuthenticated as checkAuth,
  getUserRole as getRole,
  getCurrentUser as getUser,
  updatePassword as updatePasswordApi
} from '../services/index';

// 定义操作类型
const ACTIONS = {
  AUTH_INIT_START: 'AUTH_INIT_START',
  AUTH_INIT_SUCCESS: 'AUTH_INIT_SUCCESS',
  AUTH_INIT_ERROR: 'AUTH_INIT_ERROR',
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_ERROR: 'REGISTER_ERROR',
  UPDATE_PASSWORD_START: 'UPDATE_PASSWORD_START',
  UPDATE_PASSWORD_SUCCESS: 'UPDATE_PASSWORD_SUCCESS',
  UPDATE_PASSWORD_ERROR: 'UPDATE_PASSWORD_ERROR',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// 初始状态
const initialState = {
  isAuthenticated: false,
  user: null,
  role: null,
  loading: false,
  error: null,
  initialized: false
};

// 认证状态reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.AUTH_INIT_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ACTIONS.AUTH_INIT_SUCCESS:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        role: action.payload.role,
        loading: false,
        initialized: true
      };
    case ACTIONS.AUTH_INIT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        initialized: true
      };
    case ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        role: action.payload.role,
        loading: false,
        error: null
      };
    case ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case ACTIONS.LOGOUT:
      return {
        ...initialState,
        initialized: true
      };
    case ACTIONS.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case ACTIONS.REGISTER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case ACTIONS.UPDATE_PASSWORD_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ACTIONS.UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case ACTIONS.UPDATE_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// 创建认证上下文
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  role: null,
  login: () => {},
  logout: () => {},
  register: () => {},
  updatePassword: () => {},
  updateUser: () => {},
  clearError: () => {},
  loading: false,
  error: null,
  initialized: false
});

/**
 * AuthProvider - 认证上下文提供者
 *
 * 提供认证状态和操作的上下文提供者组件。
 *
 * @component
 * @example
 * ```jsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { isAuthenticated, user, role, loading, error, initialized } = state;

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      dispatch({ type: ACTIONS.AUTH_INIT_START });

      try {
        const isAuth = await checkAuth();

        if (isAuth) {
          const userRole = await getRole();
          const userData = await getUser();

          dispatch({
            type: ACTIONS.AUTH_INIT_SUCCESS,
            payload: {
              isAuthenticated: isAuth,
              user: userData,
              role: userRole
            }
          });
        } else {
          dispatch({
            type: ACTIONS.AUTH_INIT_SUCCESS,
            payload: {
              isAuthenticated: false,
              user: null,
              role: null
            }
          });
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        dispatch({
          type: ACTIONS.AUTH_INIT_ERROR,
          payload: '初始化认证状态失败'
        });
      }
    };

    initAuth();
  }, []);

  // 登录
  const login = useCallback(async (username, password) => {
    dispatch({ type: ACTIONS.LOGIN_START });

    try {
      const result = await loginApi(username, password);

      if (result && result.success && result.data) {
        const { token, user } = result.data;

        // 存储认证令牌和用户信息
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name || user.username,
          userType: user.user_type,
          schoolName: user.school_name,
          className: user.class_name,
          studentId: user.student_id,
          status: user.status
        }));

        dispatch({
          type: ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              fullName: user.full_name || user.username,
              userType: user.user_type,
              schoolName: user.school_name,
              className: user.class_name,
              studentId: user.student_id
            },
            role: user.user_type || 'student'
          }
        });
        return { success: true };
      } else {
        dispatch({
          type: ACTIONS.LOGIN_ERROR,
          payload: result.message || '登录失败'
        });
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.message || '登录过程中发生错误';
      dispatch({
        type: ACTIONS.LOGIN_ERROR,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  }, []);

  // 注册
  const register = useCallback(async (userData) => {
    dispatch({ type: ACTIONS.REGISTER_START });

    try {
      const result = await registerApi(userData);

      if (result.success) {
        dispatch({ type: ACTIONS.REGISTER_SUCCESS });
        return { success: true };
      } else {
        dispatch({
          type: ACTIONS.REGISTER_ERROR,
          payload: result.message || '注册失败'
        });
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error('Register error:', err);
      const errorMessage = err.message || '注册过程中发生错误';
      dispatch({
        type: ACTIONS.REGISTER_ERROR,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  }, []);

  // 更新密码
  const updatePassword = useCallback(async (oldPassword, newPassword) => {
    dispatch({ type: ACTIONS.UPDATE_PASSWORD_START });

    try {
      const result = await updatePasswordApi(oldPassword, newPassword);

      if (result.success) {
        dispatch({ type: ACTIONS.UPDATE_PASSWORD_SUCCESS });
        return { success: true };
      } else {
        dispatch({
          type: ACTIONS.UPDATE_PASSWORD_ERROR,
          payload: result.message || '更新密码失败'
        });
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error('Update password error:', err);
      const errorMessage = err.message || '更新密码过程中发生错误';
      dispatch({
        type: ACTIONS.UPDATE_PASSWORD_ERROR,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  }, []);

  // 更新用户信息
  const updateUser = useCallback((userData) => {
    dispatch({
      type: ACTIONS.UPDATE_USER,
      payload: userData
    });
  }, []);

  // 清除错误
  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  // 登出
  const logout = useCallback(async () => {
    try {
      await logoutApi();
      dispatch({ type: ACTIONS.LOGOUT });
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      return { success: false, message: err.message || '登出过程中发生错误' };
    }
  }, []);

  // 上下文值
  const value = {
    isAuthenticated,
    user,
    role,
    login,
    logout,
    register,
    updatePassword,
    updateUser,
    clearError,
    loading,
    error,
    initialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth - 认证钩子
 *
 * 用于访问认证上下文的自定义钩子。
 *
 * @returns {Object} 认证上下文值
 * @example
 * ```jsx
 * const { isAuthenticated, user, login, logout } = useAuth();
 * ```
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
