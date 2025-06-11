import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getUserProgress,
  updateExperimentStatus,
  getCourseProgress
} from '../services/index';

// 定义操作类型
const ACTIONS = {
  FETCH_PROGRESS_START: 'FETCH_PROGRESS_START',
  FETCH_PROGRESS_SUCCESS: 'FETCH_PROGRESS_SUCCESS',
  FETCH_PROGRESS_ERROR: 'FETCH_PROGRESS_ERROR',
  UPDATE_EXPERIMENT_STATUS: 'UPDATE_EXPERIMENT_STATUS',
  RESET_PROGRESS: 'RESET_PROGRESS'
};

// 初始状态
const initialState = {
  userProgress: null,
  loading: false,
  error: null
};

// Reducer函数
const progressReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_PROGRESS_START:
      return { ...state, loading: true, error: null };

    case ACTIONS.FETCH_PROGRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        userProgress: action.payload,
        error: null
      };

    case ACTIONS.FETCH_PROGRESS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ACTIONS.UPDATE_EXPERIMENT_STATUS: {
      if (!state.userProgress) return state;

      const { courseId, moduleId, experimentId, status, score } = action.payload;

      // 深拷贝当前进度数据
      const updatedProgress = JSON.parse(JSON.stringify(state.userProgress));

      // 查找并更新实验状态
      const course = updatedProgress.courses.find(c => c.courseId === courseId);
      if (course) {
        const module = course.modules.find(m => m.moduleId === moduleId);
        if (module) {
          const experiment = module.experiments.find(e => e.experimentId === experimentId);
          if (experiment) {
            experiment.status = status;
            if (score !== undefined) {
              experiment.score = score;
            }
            if (status === 'completed') {
              experiment.completedDate = new Date().toISOString().split('T')[0];
            }

            // 更新模块进度
            const completedExperiments = module.experiments.filter(e => e.status === 'completed').length;
            const totalExperiments = module.experiments.length;
            module.progress = Math.round((completedExperiments / totalExperiments) * 100);
            module.completed = module.progress === 100;

            // 更新课程进度
            const moduleProgress = course.modules.reduce((sum, m) => sum + m.progress, 0);
            course.progress = Math.round(moduleProgress / course.modules.length);
          }
        }
      }

      return {
        ...state,
        userProgress: updatedProgress
      };
    }

    case ACTIONS.RESET_PROGRESS:
      return initialState;

    default:
      return state;
  }
};

// 创建进度上下文
const ProgressContext = createContext({
  userProgress: null,
  loading: false,
  error: null,
  fetchProgress: () => {},
  updateExperimentStatus: () => {},
  getCourseProgress: () => {},
  calculateCourseProgress: () => {},
});

/**
 * ProgressProvider - 进度上下文提供者
 *
 * 提供学习进度数据和操作的上下文提供者组件。
 *
 * @component
 * @example
 * ```jsx
 * <ProgressProvider>
 *   <App />
 * </ProgressProvider>
 * ```
 */
export const ProgressProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [state, dispatch] = useReducer(progressReducer, initialState);

  // 获取用户进度数据
  const fetchProgress = useCallback(async (detailed = false) => {
    if (!isAuthenticated || !user) return;

    dispatch({ type: ACTIONS.FETCH_PROGRESS_START });

    try {
      const progressData = await getUserProgress(user.id, detailed);
      dispatch({
        type: ACTIONS.FETCH_PROGRESS_SUCCESS,
        payload: progressData
      });
      return progressData;
    } catch (err) {
      console.error('Failed to fetch user progress:', err);
      dispatch({
        type: ACTIONS.FETCH_PROGRESS_ERROR,
        payload: err.message || '获取学习进度失败'
      });
      return null;
    }
  }, [isAuthenticated, user]);

  // 获取特定课程的进度
  const fetchCourseProgress = useCallback(async (courseId) => {
    if (!isAuthenticated || !user) return null;

    try {
      return await getCourseProgress(user.id, courseId);
    } catch (err) {
      console.error(`Failed to fetch course progress for ${courseId}:`, err);
      return null;
    }
  }, [isAuthenticated, user]);

  // 更新实验状态
  const updateExperimentStatusFn = useCallback(async (courseId, moduleId, experimentId, status, score) => {
    if (!isAuthenticated || !user) {
      return { success: false, message: '用户未登录' };
    }

    try {
      const result = await updateExperimentStatus(
        user.id,
        courseId,
        moduleId,
        experimentId,
        status,
        score
      );

      if (result.success) {
        // 更新本地状态
        dispatch({
          type: ACTIONS.UPDATE_EXPERIMENT_STATUS,
          payload: { courseId, moduleId, experimentId, status, score }
        });

        return { success: true };
      } else {
        return { success: false, message: result.message || '更新实验状态失败' };
      }
    } catch (err) {
      console.error('Update experiment status error:', err);
      return {
        success: false,
        message: err.message || '更新实验状态过程中发生错误'
      };
    }
  }, [isAuthenticated, user]);

  // 计算课程总体进度
  const calculateCourseProgress = useCallback((courseId) => {
    if (!state.userProgress) return 0;

    const course = state.userProgress.courses.find(c => c.courseId === courseId);
    if (!course) return 0;

    return course.progress;
  }, [state.userProgress]);

  // 当用户认证状态变化时获取进度数据
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProgress();
    } else {
      dispatch({ type: ACTIONS.RESET_PROGRESS });
    }
  }, [isAuthenticated, user, fetchProgress]);

  // 上下文值
  const value = {
    ...state,
    fetchProgress,
    updateExperimentStatus: updateExperimentStatusFn,
    getCourseProgress: fetchCourseProgress,
    calculateCourseProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

/**
 * useProgress - 进度数据钩子
 *
 * 用于访问进度上下文的自定义钩子。
 *
 * @returns {Object} 进度上下文值
 * @example
 * ```jsx
 * const { userProgress, updateExperimentStatus } = useProgress();
 * ```
 */
export const useProgress = () => {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }

  return context;
};

export default ProgressContext;
