/**
 * 课程分析Hook
 * 
 * 提供课程分析数据的状态管理和操作方法
 */

import { useState, useEffect, useCallback } from 'react';
import { CourseAnalyticsService, MockCourseAnalyticsService } from '../services/courseAnalyticsService';
import type {
  CourseAnalyticsData,
  CourseAnalyticsQuery,
  StudyTimeAnalytics,
  ScoreAnalytics,
  LearningBehaviorAnalytics,
  ExperimentAnalytics,
  StudentProgress
} from '../types/courseAnalytics';

interface UseCourseAnalyticsReturn {
  data: CourseAnalyticsData | null;
  loading: boolean;
  error: string | null;
  fetchAnalytics: (query: CourseAnalyticsQuery) => Promise<void>;
  refreshData: () => Promise<void>;
  exportReport: (format: 'pdf' | 'excel') => Promise<void>;
}

export const useCourseAnalytics = (courseId?: string): UseCourseAnalyticsReturn => {
  const [data, setData] = useState<CourseAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<CourseAnalyticsQuery | null>(null);

  // 获取分析数据
  const fetchAnalytics = useCallback(async (query: CourseAnalyticsQuery) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentQuery(query);

      // 在开发环境使用模拟数据
      const analyticsData = process.env.NODE_ENV === 'development' 
        ? MockCourseAnalyticsService.generateMockData(query.courseId)
        : await CourseAnalyticsService.getCourseAnalytics(query);

      setData(analyticsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取分析数据失败';
      setError(errorMessage);
      console.error('获取课程分析数据失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 刷新数据
  const refreshData = useCallback(async () => {
    if (currentQuery) {
      await fetchAnalytics(currentQuery);
    }
  }, [currentQuery, fetchAnalytics]);

  // 导出报告
  const exportReport = useCallback(async (format: 'pdf' | 'excel' = 'pdf') => {
    if (!currentQuery) return;

    try {
      setLoading(true);
      const blob = await CourseAnalyticsService.exportAnalyticsReport(
        currentQuery.courseId,
        format
      );

      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `课程分析报告_${currentQuery.courseId}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '导出报告失败';
      setError(errorMessage);
      console.error('导出分析报告失败:', err);
    } finally {
      setLoading(false);
    }
  }, [currentQuery]);

  // 初始加载
  useEffect(() => {
    if (courseId) {
      fetchAnalytics({ courseId });
    }
  }, [courseId, fetchAnalytics]);

  return {
    data,
    loading,
    error,
    fetchAnalytics,
    refreshData,
    exportReport
  };
};

// 学习时长分析Hook
export const useStudyTimeAnalytics = (courseId: string, startDate?: string, endDate?: string) => {
  const [data, setData] = useState<StudyTimeAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);
      const result = await CourseAnalyticsService.getStudyTimeAnalytics(courseId, startDate, endDate);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取学习时长数据失败';
      setError(errorMessage);
      console.error('获取学习时长分析失败:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// 成绩分析Hook
export const useScoreAnalytics = (courseId: string, chapterIds?: string[]) => {
  const [data, setData] = useState<ScoreAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);
      const result = await CourseAnalyticsService.getScoreAnalytics(courseId, chapterIds);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取成绩数据失败';
      setError(errorMessage);
      console.error('获取成绩分析失败:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId, chapterIds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// 学习行为分析Hook
export const useLearningBehaviorAnalytics = (courseId: string, startDate?: string, endDate?: string) => {
  const [data, setData] = useState<LearningBehaviorAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);
      const result = await CourseAnalyticsService.getLearningBehaviorAnalytics(courseId, startDate, endDate);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取学习行为数据失败';
      setError(errorMessage);
      console.error('获取学习行为分析失败:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// 实验分析Hook
export const useExperimentAnalytics = (courseId: string) => {
  const [data, setData] = useState<ExperimentAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);
      const result = await CourseAnalyticsService.getExperimentAnalytics(courseId);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取实验数据失败';
      setError(errorMessage);
      console.error('获取实验分析失败:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// 学生进度Hook
export const useStudentProgress = (courseId: string, studentIds?: string[]) => {
  const [data, setData] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);
      const result = await CourseAnalyticsService.getStudentProgress(courseId, studentIds);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取学生进度数据失败';
      setError(errorMessage);
      console.error('获取学生进度失败:', err);
    } finally {
      setLoading(false);
    }
  }, [courseId, studentIds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
