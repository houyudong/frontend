import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import EnhancedSearchBox, { SearchFilter, SearchSuggestion } from '../../../../components/search/EnhancedSearchBox';

// 课程接口定义
interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  progress: number;
  instructor: string;
  students: number;
  imageUrl: string;
  updatedAt: string;
}

// 模拟课程数据
const mockCourses: Course[] = [
  {
    id: 'stm32-intro',
    title: 'STM32基础入门',
    description: '了解STM32系列微控制器的架构、特性和应用场景。本课程将介绍STM32系列的核心特点、性能优势以及与其他MCU的比较。',
    level: 'beginner',
    duration: '2小时',
    progress: 75,
    instructor: '张教授',
    students: 156,
    imageUrl: '/images/courses/stm32-intro.jpg',
    updatedAt: '2024-12-15'
  },
  {
    id: 'stm32-basics',
    title: 'STM32开发基础',
    description: '掌握STM32的基础开发知识，包括环境搭建、时钟配置和基本外设使用。',
    level: 'beginner',
    duration: '4小时',
    progress: 45,
    instructor: '李老师',
    students: 203,
    imageUrl: '/images/courses/stm32-basics.jpg',
    updatedAt: '2024-12-20'
  },
  {
    id: 'gpio-programming',
    title: 'GPIO编程与LED控制',
    description: '深入学习STM32的GPIO配置和操作，通过控制LED实现各种GPIO编程技巧。',
    level: 'beginner',
    duration: '3小时',
    progress: 100,
    instructor: '王工程师',
    students: 178,
    imageUrl: '/images/courses/gpio-led.jpg',
    updatedAt: '2024-01-05'
  },
  {
    id: 'uart-communication',
    title: 'UART串口通信',
    description: '学习STM32的UART通信原理和编程实现，掌握串口数据收发技术。',
    level: 'intermediate',
    duration: '3.5小时',
    progress: 0,
    instructor: '陈老师',
    students: 134,
    imageUrl: '/images/courses/uart.jpg',
    updatedAt: '2024-01-10'
  },
  {
    id: 'timer-pwm',
    title: '定时器与PWM控制',
    description: '深入理解STM32定时器工作原理，学习PWM信号生成和应用。',
    level: 'intermediate',
    duration: '4小时',
    progress: 30,
    instructor: '刘教授',
    students: 98,
    imageUrl: '/images/courses/timer-pwm.jpg',
    updatedAt: '2024-01-15'
  },
  {
    id: 'adc-dac',
    title: 'ADC与DAC应用',
    description: '学习STM32的模数转换和数模转换技术，掌握模拟信号处理。',
    level: 'advanced',
    duration: '5小时',
    progress: 85,
    instructor: '赵博士',
    students: 67,
    imageUrl: '/images/courses/adc-dac.jpg',
    updatedAt: '2024-01-20'
  },
  {
    id: 'rtos-basics',
    title: 'FreeRTOS实时系统',
    description: '掌握FreeRTOS实时操作系统的基本概念和在STM32上的应用。',
    level: 'advanced',
    duration: '6小时',
    progress: 0,
    instructor: '孙工程师',
    students: 45,
    imageUrl: '/images/courses/freertos.jpg',
    updatedAt: '2024-01-25'
  }
];

// 课程卡片组件
const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return '入门级';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return '未知';
    }
  };

  return (
    <Link
      to={`/student/courses/${course.id}`}
      className="student-card block"
    >
      {/* 课程图片 */}
      <div className="card-header">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        {/* 头部进度条 - 始终显示 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-200/50 h-1">
          <div
            className="bg-blue-500 h-1 transition-all duration-300"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>

      {/* 课程信息 */}
      <div className="card-body">
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
            {getLevelText(course.level)}
          </span>
          {course.progress === 100 && (
            <span className="text-green-600 text-sm font-medium">✅ 已完成</span>
          )}
        </div>

        <h3 className="card-title">{course.title}</h3>
        <p className="card-description line-clamp-2">{course.description}</p>

        <div className="card-footer">
          {/* 课程信息 */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{course.students}</span>
            </div>
          </div>

          {/* 讲师信息 */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="truncate">{course.instructor}</span>
            <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded">
              {getLevelText(course.level)}
            </span>
          </div>

          {/* 学习进度 - 始终显示 */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>学习进度</span>
              <span className={`font-medium ${course.progress === 100 ? 'text-green-600' : course.progress > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
                {course.progress === 100 ? '已完成' : `${course.progress}%`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  course.progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                }`}
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

/**
 * CoursesPage - 学生课程页面
 *
 * 显示学生可学习的课程列表，支持搜索和筛选
 * 参考ref目录实现，简化复杂功能
 */
const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // 统计数据
  const stats = {
    total: courses.length,
    completed: courses.filter(c => c.progress === 100).length,
    inProgress: courses.filter(c => c.progress > 0 && c.progress < 100).length,
    notStarted: courses.filter(c => c.progress === 0).length
  };

  // 搜索建议数据
  const searchSuggestions: SearchSuggestion[] = [
    { id: '1', text: 'STM32基础编程', type: 'popular', count: 156 },
    { id: '2', text: 'ARM架构原理', type: 'popular', count: 89 },
    { id: '3', text: 'C语言程序设计', type: 'popular', count: 234 },
    { id: '4', text: '嵌入式系统开发', type: 'popular', count: 67 },
    { id: '5', text: 'GPIO控制', type: 'suggestion', count: 45 }
  ];

  // 筛选器配置
  const searchFilters: SearchFilter[] = [
    {
      key: 'level',
      label: '难度等级',
      type: 'select',
      options: [
        { value: 'all', label: '全部等级', count: courses.length },
        { value: 'beginner', label: '入门级', count: courses.filter(c => c.level === 'beginner').length },
        { value: 'intermediate', label: '中级', count: courses.filter(c => c.level === 'intermediate').length },
        { value: 'advanced', label: '高级', count: courses.filter(c => c.level === 'advanced').length }
      ]
    }
  ];

  // 快捷筛选标签
  const quickFilters = [
    { label: '热门课程', value: 'popular', count: 12 },
    { label: '新课程', value: 'new', count: 5 },
    { label: '已完成', value: 'completed', count: stats.completed },
    { label: '进行中', value: 'inProgress', count: stats.inProgress },
    { label: '未开始', value: 'notStarted', count: stats.notStarted }
  ];

  // 模拟数据加载
  useEffect(() => {
    const loadCourses = () => {
      // 直接设置数据，避免任何延迟导致的闪烁
      setCourses(mockCourses);
      setLoading(false);
    };

    // 使用 requestAnimationFrame 确保在下一帧渲染
    requestAnimationFrame(loadCourses);
  }, []);

  // 处理快捷筛选
  const handleQuickFilter = (value: string) => {
    switch (value) {
      case 'completed':
        setSearchTerm('');
        setSelectedLevel('all');
        // 这里可以添加额外的筛选逻辑
        break;
      case 'inProgress':
        setSearchTerm('');
        setSelectedLevel('all');
        break;
      case 'notStarted':
        setSearchTerm('');
        setSelectedLevel('all');
        break;
      case 'popular':
        setSearchTerm('热门');
        break;
      case 'new':
        setSearchTerm('新');
        break;
      default:
        setSearchTerm(value);
    }
  };

  // 处理筛选器变化
  const handleFilterChange = (key: string, value: any) => {
    if (key === 'level') {
      setSelectedLevel(value);
    }
  };

  // 清除所有筛选
  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedLevel('all');
  };

  // 过滤课程
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <MainLayout>
      <div className="page-container">
        {/* 页面标题 - 重新设计 */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-800 rounded-2xl mb-8 shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">课程学习</h1>
                <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                  学习STM32嵌入式开发的核心知识和实践技能
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-white/90">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">学习进度：{Math.round((stats.completed / stats.total) * 100)}%</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/90">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-sm">已完成 {stats.completed} 门课程</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-6xl">📚</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 学习统计 - 重新设计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">📚</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-500">门课程</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">总课程数</h3>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>系统化学习</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">✅</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                  <div className="text-sm text-gray-500">已完成</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">完成课程</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-yellow-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">📖</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.inProgress}</div>
                  <div className="text-sm text-gray-500">学习中</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">进行中</h3>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>持续学习中</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stats.notStarted}</div>
                  <div className="text-sm text-gray-500">待开始</div>
                </div>
              </div>
              <h3 className="text-gray-700 font-medium mb-2">未开始</h3>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>开始学习</span>
              </div>
            </div>
          </div>
        </div>

        {/* 增强的搜索框 */}
        <EnhancedSearchBox
          placeholder="搜索课程名称、描述或关键词..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={searchFilters}
          filterValues={{ level: selectedLevel }}
          onFilterChange={handleFilterChange}
          suggestions={searchSuggestions}
          showSuggestions={true}
          resultCount={filteredCourses.length}
          onClear={handleClearAll}
          theme="blue"
          size="md"
          showAdvancedFilters={true}
          quickFilters={quickFilters}
          onQuickFilter={handleQuickFilter}
          className="mb-8"
        />

        {/* 课程列表 */}
        {loading ? (
          <div className="student-grid">
            {/* 骨架屏 - 显示6个占位卡片 */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="student-card animate-pulse">
                <div className="card-header bg-gray-300"></div>
                <div className="card-body">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                    <div className="h-4 bg-gray-300 rounded w-12"></div>
                  </div>
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                  <div className="card-footer">
                    <div className="flex justify-between mb-3">
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-12 ml-auto"></div>
                    </div>
                    <div className="mb-1">
                      <div className="h-3 bg-gray-300 rounded w-16 mb-1"></div>
                      <div className="h-2 bg-gray-300 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="student-grid">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的课程</h3>
            <p className="text-gray-600 mb-4">请尝试调整搜索条件或筛选选项</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedLevel('all');
              }}
              className="btn-primary"
            >
              重置筛选
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CoursesPage;
