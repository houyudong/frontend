/**
 * 统一学习进度仪表板组件
 * 
 * 整合课程进度和实验进度，提供统一的进度管理界面
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LearningProgress, ExperimentProgress } from '../types/Progress';

interface UnifiedProgressDashboardProps {
  showHeader?: boolean;
  compact?: boolean;
}

const UnifiedProgressDashboard: React.FC<UnifiedProgressDashboardProps> = ({ 
  showHeader = true, 
  compact = false 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'experiments'>('overview');
  const [courseProgress, setCourseProgress] = useState<LearningProgress[]>([]);
  const [experimentProgress, setExperimentProgress] = useState<ExperimentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // 模拟数据加载
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟课程进度数据
        setCourseProgress([
          {
            id: 'course_001',
            type: 'course',
            itemId: 'course_001',
            title: 'STM32嵌入式开发基础',
            description: '学习STM32微控制器的基础开发技术',
            thumbnail: '/images/courses/stm32.jpg',
            category: '嵌入式开发',
            instructor: '刘教授',
            startedAt: '2024-01-10T08:00:00Z',
            lastAccessedAt: '2024-01-22T14:30:00Z',
            estimatedCompletion: '2024-02-15T23:59:59Z',
            overallProgress: 65,
            completedItems: 13,
            totalItems: 20,
            timeSpent: 450,
            estimatedTimeRemaining: 240
          },
          {
            id: 'course_002',
            type: 'course',
            itemId: 'course_002',
            title: 'ARM架构与编程',
            description: '深入学习ARM处理器架构和汇编语言编程技术',
            thumbnail: '/images/courses/arm.jpg',
            category: '计算机架构',
            instructor: '张教授',
            startedAt: '2024-01-20T10:15:00Z',
            lastAccessedAt: '2024-01-21T16:45:00Z',
            estimatedCompletion: '2024-03-10T23:59:59Z',
            overallProgress: 15,
            completedItems: 3,
            totalItems: 18,
            timeSpent: 120,
            estimatedTimeRemaining: 600
          }
        ]);

        // 模拟实验进度数据
        setExperimentProgress([
          {
            id: 'exp_001',
            type: 'experiment',
            itemId: 'exp_001',
            title: 'GPIO控制LED实验',
            description: '学习GPIO基础控制，实现LED闪烁效果',
            thumbnail: '/images/experiments/gpio_led.jpg',
            category: '基础实验',
            difficulty: 'beginner',
            estimatedDuration: 90,
            startedAt: '2024-01-15T14:00:00Z',
            lastAccessedAt: '2024-01-22T16:15:00Z',
            overallProgress: 100,
            currentStep: 5,
            totalSteps: 5,
            timeSpent: 85,
            status: 'completed',
            score: 88,
            maxScore: 100
          },
          {
            id: 'exp_002',
            type: 'experiment',
            itemId: 'exp_002',
            title: '串口通信实验',
            description: '实现STM32与PC之间的串口通信',
            thumbnail: '/images/experiments/uart.jpg',
            category: '通信实验',
            difficulty: 'intermediate',
            estimatedDuration: 120,
            startedAt: '2024-01-18T10:30:00Z',
            lastAccessedAt: '2024-01-21T15:20:00Z',
            overallProgress: 60,
            currentStep: 3,
            totalSteps: 5,
            timeSpent: 75,
            status: 'in_progress'
          }
        ]);
      } catch (error) {
        console.error('加载进度数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 计算总体统计
  const overallStats = {
    totalCourses: courseProgress.length,
    completedCourses: courseProgress.filter(c => c.overallProgress === 100).length,
    totalExperiments: experimentProgress.length,
    completedExperiments: experimentProgress.filter(e => e.status === 'completed').length,
    totalTimeSpent: [...courseProgress, ...experimentProgress].reduce((sum, item) => sum + item.timeSpent, 0),
    averageProgress: [...courseProgress, ...experimentProgress].reduce((sum, item) => sum + item.overallProgress, 0) / (courseProgress.length + experimentProgress.length)
  };

  // 格式化时长
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`;
    }
    return `${mins}分钟`;
  };

  // 获取进度状态颜色
  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 20) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">加载进度数据中...</span>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'space-y-4' : 'space-y-6'}`}>
      {showHeader && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">学习进度</h2>
            <p className="text-gray-600 mt-1">跟踪您的课程和实验学习进度</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Link
              to="/student/courses"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              浏览课程
            </Link>
            <Link
              to="/student/experiments"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              开始实验
            </Link>
          </div>
        </div>
      )}

      {/* 总体统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">课程进度</p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.completedCourses}/{overallStats.totalCourses}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(overallStats.completedCourses / overallStats.totalCourses) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">实验完成</p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.completedExperiments}/{overallStats.totalExperiments}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🧪</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(overallStats.completedExperiments / overallStats.totalExperiments) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">学习时长</p>
              <p className="text-2xl font-bold text-gray-900">{Math.floor(overallStats.totalTimeSpent / 60)}h</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            总计 {formatDuration(overallStats.totalTimeSpent)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">平均进度</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(overallStats.averageProgress)}%</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallStats.averageProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            总览
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'courses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            课程进度 ({courseProgress.length})
          </button>
          <button
            onClick={() => setActiveTab('experiments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'experiments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            实验进度 ({experimentProgress.length})
          </button>
        </nav>
      </div>

      {/* 标签页内容 */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 最近课程 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">最近课程</h3>
                <Link to="/student/courses" className="text-sm text-blue-600 hover:text-blue-700">
                  查看全部
                </Link>
              </div>
              <div className="space-y-4">
                {courseProgress.slice(0, 3).map(course => (
                  <div key={course.id} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📚</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{course.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(course.overallProgress)}`}
                            style={{ width: `${course.overallProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{course.overallProgress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 最近实验 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">最近实验</h3>
                <Link to="/student/experiments" className="text-sm text-green-600 hover:text-green-700">
                  查看全部
                </Link>
              </div>
              <div className="space-y-4">
                {experimentProgress.slice(0, 3).map(experiment => (
                  <div key={experiment.id} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🧪</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{experiment.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(experiment.overallProgress)}`}
                            style={{ width: `${experiment.overallProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{experiment.overallProgress}%</span>
                      </div>
                      {experiment.status === 'completed' && experiment.score && (
                        <div className="text-xs text-green-600 mt-1">
                          得分: {experiment.score}/{experiment.maxScore}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courseProgress.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>👨‍🏫 {course.instructor}</span>
                        <span>📂 {course.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">完成进度</span>
                      <span className="font-medium text-gray-900">{course.completedItems}/{course.totalItems} 章节</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(course.overallProgress)}`}
                        style={{ width: `${course.overallProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>已学习 {formatDuration(course.timeSpent)}</span>
                      <span>预计剩余 {formatDuration(course.estimatedTimeRemaining)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      to={`/student/courses/${course.itemId}`}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      继续学习
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'experiments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experimentProgress.map(experiment => (
              <div key={experiment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">{experiment.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                          experiment.status === 'completed' ? 'bg-green-100 text-green-600' :
                          experiment.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {experiment.status === 'completed' ? '已完成' :
                           experiment.status === 'in_progress' ? '进行中' : '未开始'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{experiment.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📂 {experiment.category}</span>
                        <span>⏱️ {experiment.estimatedDuration}分钟</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          experiment.difficulty === 'beginner' ? 'bg-green-100 text-green-600' :
                          experiment.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {experiment.difficulty === 'beginner' ? '初级' :
                           experiment.difficulty === 'intermediate' ? '中级' : '高级'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">实验进度</span>
                      <span className="font-medium text-gray-900">{experiment.currentStep}/{experiment.totalSteps} 步骤</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(experiment.overallProgress)}`}
                        style={{ width: `${experiment.overallProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>用时 {formatDuration(experiment.timeSpent)}</span>
                      {experiment.score && (
                        <span className="text-green-600 font-medium">得分: {experiment.score}/{experiment.maxScore}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      to={`/student/experiments/${experiment.itemId}`}
                      className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
                    >
                      {experiment.status === 'completed' ? '查看实验' : '继续实验'}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedProgressDashboard;
