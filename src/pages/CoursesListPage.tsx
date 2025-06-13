import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../services/api';
import { PageHeader, ErrorAlert, LoadingSpinner } from '../components/common';
import { CourseCard } from '../components/cards';

interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  difficulty: string;
  duration: string;
  image_url: string;
}

// 模拟课程数据，当API失败时使用
const mockCourses: Course[] = [
  {
    id: 'stm32-intro',
    title: 'STM32系列简介',
    description: '了解STM32系列微控制器的架构、特性和应用场景。本课程将介绍STM32系列的核心特点、性能优势以及与其他MCU的比较。',
    level: 'beginner',
    difficulty: '入门级',
    duration: '2小时',
    image_url: '/images/courses/stm32-intro.jpg'
  },
  {
    id: 'stm32-basics',
    title: 'STM32系列基础',
    description: '掌握STM32系列的基础开发知识，包括环境搭建、时钟配置和基本外设使用。',
    level: 'beginner',
    difficulty: '入门级',
    duration: '4小时',
    image_url: '/images/courses/stm32-basics.jpg'
  },
  {
    id: 'gpio-programming',
    title: 'GPIO编程与LED控制',
    description: '深入学习STM32系列的GPIO配置和操作，通过控制LED实现各种GPIO编程技巧。',
    level: 'beginner',
    difficulty: '入门级',
    duration: '3小时',
    image_url: '/images/courses/gpio-led.jpg'
  }
];

/**
 * CoursesListPage - 课程列表页面
 *
 * 显示所有可用的STM32系列课程，支持按关键词搜索和按难度等级筛选。
 * 从API获取课程数据，如果API请求失败，则显示模拟数据。
 *
 * @component
 * @example
 * ```tsx
 * <CoursesListPage />
 * ```
 *
 * @returns {ReactElement} CoursesListPage组件
 */
const CoursesListPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses();

        // 确保coursesData是数组
        if (Array.isArray(coursesData)) {
          setCourses(coursesData);
        } else {
          console.warn('API返回的课程数据不是数组，使用模拟数据');
          setCourses(mockCourses);
          setError('无法加载课程数据，显示的是模拟数据');
        }
      } catch (err) {
        console.error('获取课程列表失败:', err);
        setCourses(mockCourses); // 使用模拟数据作为备份
        setError('获取课程列表失败，显示的是模拟数据');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 根据搜索词和筛选条件过滤课程
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        course.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  return (
    <div>
      <PageHeader
        title="STM32系列课程"
        description="学习STM32系列微控制器的核心概念和高级应用"
      />

      {/* 搜索和筛选区域 */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              搜索课程
            </label>
            <input
              type="text"
              id="search"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="输入关键词搜索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-64">
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
              难度等级
            </label>
            <select
              id="level"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="all">全部等级</option>
              <option value="beginner">入门级</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && <ErrorAlert message={error} />}

      {/* 加载状态 */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* 课程列表 */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                没有找到匹配的课程，请尝试其他搜索条件
              </p>
              <button
                className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLevel('all');
                }}
              >
                重置筛选
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoursesListPage; 