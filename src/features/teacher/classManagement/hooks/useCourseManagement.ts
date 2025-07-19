/**
 * 课程管理Hook
 * 
 * 管理课程相关的状态和操作
 */

import { useState, useCallback } from 'react';
import type { Course, CreateCourseRequest, UpdateCourseRequest } from '../types';

interface UseCourseManagementState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

interface UseCourseManagementActions {
  fetchCourses: (params?: { classId?: string }) => Promise<void>;
  createCourse: (data: CreateCourseRequest) => Promise<void>;
  updateCourse: (courseId: string, data: UpdateCourseRequest) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  clearError: () => void;
}

type UseCourseManagementReturn = UseCourseManagementState & UseCourseManagementActions;

// 模拟课程数据
const mockCourses: Course[] = [
  {
    id: 'course_001',
    name: 'STM32基础编程',
    description: '学习STM32微控制器的基础编程知识',
    classId: 'class_001',
    teacherId: 'teacher_001',
    status: 'active',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-06-30T00:00:00Z',
    totalHours: 64,
    completedHours: 32,
    schedule: [
      {
        id: 'schedule_001',
        courseId: 'course_001',
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '10:00',
        room: 'A101',
        weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
      },
      {
        id: 'schedule_002',
        courseId: 'course_001',
        dayOfWeek: 3,
        startTime: '14:00',
        endTime: '16:00',
        room: 'A101',
        weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
      }
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'course_002',
    name: 'STM32高级应用',
    description: '深入学习STM32的高级功能和应用开发',
    classId: 'class_001',
    teacherId: 'teacher_001',
    status: 'inactive',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-12-31T00:00:00Z',
    totalHours: 48,
    completedHours: 0,
    schedule: [
      {
        id: 'schedule_003',
        courseId: 'course_002',
        dayOfWeek: 2,
        startTime: '10:00',
        endTime: '12:00',
        room: 'B201',
        weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      }
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

export const useCourseManagement = (): UseCourseManagementReturn => {
  const [state, setState] = useState<UseCourseManagementState>({
    courses: [],
    loading: false,
    error: null
  });

  // 获取课程列表
  const fetchCourses = useCallback(async (params?: { classId?: string }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 这里应该调用实际的API
      // const response = await apiClient.get('/api/courses', { params });
      
      let filteredCourses = mockCourses;
      if (params?.classId) {
        filteredCourses = mockCourses.filter(course => course.classId === params.classId);
      }
      
      setState(prev => ({
        ...prev,
        courses: filteredCourses,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '获取课程列表失败',
        loading: false
      }));
    }
  }, []);

  // 创建课程
  const createCourse = useCallback(async (data: CreateCourseRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 这里应该调用实际的API
      // const response = await apiClient.post('/api/courses', data);
      
      const newCourse: Course = {
        id: `course_${Date.now()}`,
        name: data.name,
        description: data.description,
        classId: data.classId,
        teacherId: 'teacher_001', // 从当前用户获取
        status: 'inactive',
        startDate: data.startDate,
        endDate: data.endDate,
        totalHours: data.totalHours,
        completedHours: 0,
        schedule: data.schedule.map((s, index) => ({
          id: `schedule_${Date.now()}_${index}`,
          courseId: `course_${Date.now()}`,
          ...s
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setState(prev => ({
        ...prev,
        courses: [...prev.courses, newCourse],
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '创建课程失败',
        loading: false
      }));
      throw error;
    }
  }, []);

  // 更新课程
  const updateCourse = useCallback(async (courseId: string, data: UpdateCourseRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 这里应该调用实际的API
      // const response = await apiClient.put(`/api/courses/${courseId}`, data);
      
      setState(prev => ({
        ...prev,
        courses: prev.courses.map(course => 
          course.id === courseId 
            ? { 
                ...course, 
                ...data,
                schedule: data.schedule ? data.schedule.map((s, index) => ({
                  id: s.id || `schedule_${Date.now()}_${index}`,
                  courseId,
                  ...s
                })) : course.schedule,
                updatedAt: new Date().toISOString()
              }
            : course
        ),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '更新课程失败',
        loading: false
      }));
      throw error;
    }
  }, []);

  // 删除课程
  const deleteCourse = useCallback(async (courseId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 这里应该调用实际的API
      // await apiClient.delete(`/api/courses/${courseId}`);
      
      setState(prev => ({
        ...prev,
        courses: prev.courses.filter(course => course.id !== courseId),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '删除课程失败',
        loading: false
      }));
      throw error;
    }
  }, []);

  // 清除错误
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    clearError
  };
};
