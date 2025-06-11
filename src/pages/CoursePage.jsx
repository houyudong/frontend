import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById } from '../services/api';
import { PageHeader } from '../components/common';
import { ModuleAccordion } from '../components/common';
import { ResourceCard } from '../components/cards';
import { ErrorAlert, LoadingSpinner } from '../components/common';

// 模拟课程数据
const coursesData = [
  {
    id: 'stm32h7-intro',
    title: 'STM32H7简介',
    description: '了解STM32H7系列微控制器的架构、特性和应用场景。本课程将介绍STM32H7系列的核心特点、性能优势以及与其他MCU的比较。',
    level: '入门级',
    duration: '2小时',
    imageUrl: '/images/courses/stm32h7-intro.jpg',
    updatedAt: '2023-12-15',
    modules: [
      {
        id: 'module-1',
        title: '模块1: STM32H7系列概述',
        description: '介绍STM32H7系列的基本信息和产品线。',
        lessons: [
          { id: 'lesson-1-1', title: '什么是STM32H7', duration: '15分钟' },
          { id: 'lesson-1-2', title: 'STM32H7系列的产品线', duration: '20分钟' },
          { id: 'lesson-1-3', title: 'STM32H7与其他MCU的比较', duration: '25分钟' }
        ]
      },
      {
        id: 'module-2',
        title: '模块2: Cortex-M7内核与架构',
        description: '深入了解STM32H7的Cortex-M7内核和系统架构。',
        lessons: [
          { id: 'lesson-2-1', title: 'Cortex-M7内核特性', duration: '20分钟' },
          { id: 'lesson-2-2', title: 'STM32H7的存储架构', duration: '15分钟' },
          { id: 'lesson-2-3', title: '时钟系统与电源管理', duration: '25分钟' }
        ]
      }
    ],
    resources: [
      { title: 'STM32H7参考手册', url: '#', type: 'documentation' },
      { title: 'STM32H7数据手册', url: '#', type: 'documentation' },
      { title: '开发板用户手册', url: '#', type: 'documentation' }
    ]
  },
  {
    id: 'stm32h7-basics',
    title: 'STM32H7基础',
    description: '掌握STM32H7的基础开发知识，包括环境搭建、时钟配置和基本外设使用。',
    level: '入门级',
    duration: '4小时',
    imageUrl: '/images/courses/stm32h7-basics.jpg',
    updatedAt: '2023-12-20',
    modules: [
      {
        id: 'module-1',
        title: '模块1: 开发环境搭建',
        description: '设置STM32CubeIDE和必要的开发工具。',
        lessons: [
          { id: 'lesson-1-1', title: 'STM32CubeIDE安装与配置', duration: '20分钟' },
          { id: 'lesson-1-2', title: '创建第一个项目', duration: '25分钟' },
          { id: 'lesson-1-3', title: '调试工具使用', duration: '20分钟' }
        ]
      },
      {
        id: 'module-2',
        title: '模块2: 时钟配置',
        description: '学习STM32H7的时钟系统和配置方法。',
        lessons: [
          { id: 'lesson-2-1', title: '时钟系统概述', duration: '15分钟' },
          { id: 'lesson-2-2', title: 'PLL配置', duration: '25分钟' },
          { id: 'lesson-2-3', title: '时钟树理解与优化', duration: '30分钟' }
        ]
      }
    ],
    resources: [
      { title: 'STM32H7时钟配置指南', url: '#', type: 'documentation' },
      { title: '基础开发视频教程', url: '#', type: 'video' }
    ]
  },
  {
    id: 'gpio-led-control',
    title: 'GPIO编程与LED控制',
    description: '深入学习STM32H7的GPIO配置和操作，通过控制LED实现各种GPIO编程技巧。',
    level: '入门级',
    duration: '3小时',
    imageUrl: '/images/courses/gpio-led.jpg',
    updatedAt: '2024-01-05',
    modules: [
      {
        id: 'module-1',
        title: '模块1: GPIO基础',
        description: '了解GPIO的基本结构和工作原理。',
        lessons: [
          { id: 'lesson-1-1', title: 'GPIO寄存器介绍', duration: '20分钟' },
          { id: 'lesson-1-2', title: '输入与输出模式配置', duration: '25分钟' },
          { id: 'lesson-1-3', title: '上拉下拉电阻', duration: '15分钟' }
        ]
      },
      {
        id: 'module-2',
        title: '模块2: LED控制实战',
        description: '使用GPIO控制LED的各种方式。',
        lessons: [
          { id: 'lesson-2-1', title: '简单LED闪烁', duration: '20分钟' },
          { id: 'lesson-2-2', title: '多LED流水灯效果', duration: '30分钟' },
          { id: 'lesson-2-3', title: 'PWM控制LED亮度', duration: '35分钟' }
        ]
      }
    ],
    resources: [
      { title: 'GPIO编程指南', url: '#', type: 'documentation' },
      { title: 'LED控制示例代码', url: '#', type: 'example' }
    ]
  }
];

// 获取课程数据
const getCourseData = (id) => {
  return coursesData.find(course => course.id === id) || null;
};

/**
 * CoursePage - 课程详情页面
 *
 * 显示单个课程的详细信息，包括课程介绍、学习目标、课程模块和相关资源。
 * 从API获取课程数据，如果API请求失败，则显示错误信息。
 *
 * @component
 * @example
 * ```jsx
 * <CoursePage />
 * ```
 *
 * @returns {ReactElement} CoursePage组件
 */
const CoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await getCourseById(id);
        setCourse(courseData);
        setLoading(false);
      } catch (err) {
        console.error('获取课程详情失败:', err);
        setError('获取课程详情失败，请稍后再试');
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!course) return <ErrorAlert message="未找到课程信息" />;

  return (
    <div>
      {/* 返回按钮 */}
      <div className="mb-4">
        <Link
          to="/courses"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <svg
            className="h-5 w-5 mr-1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          返回课程列表
        </Link>
      </div>

      {/* 课程头部 */}
      <PageHeader
        title={course.title}
        description={course.description}
        bgImage={course.image_url}
      />

      {/* 课程详情 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-xl font-bold mb-4">课程介绍</h2>
            <p className="text-gray-700 mb-6">{course.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">难度等级</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{course.level}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">课程时长</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{course.duration}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">模块数量</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">{course.modules?.length || 0}</p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4">课程大纲</h2>
            <p className="text-gray-700 mb-6">
              本课程将帮助您掌握STM32系列微控制器的核心知识和应用技能，从基础架构到高级功能，全面提升您的嵌入式开发能力。
            </p>
          </div>

          <div className="col-span-1">
            <div className="bg-primary-50 p-6 rounded-lg border border-primary-100">
              <h3 className="text-lg font-bold text-primary-800 mb-4">学习目标</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-primary-600 mr-2 mt-0.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>理解STM32系列微控制器架构</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-primary-600 mr-2 mt-0.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>掌握GPIO、定时器等外设的配置与使用</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-primary-600 mr-2 mt-0.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>学习HAL库和CMSIS的高效应用</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-primary-600 mr-2 mt-0.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>能够独立设计与实现嵌入式应用</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 课程模块列表 */}
      <h2 className="text-2xl font-bold mb-4">课程模块</h2>
      <div className="space-y-4 mb-8">
        {course.modules && course.modules.length > 0 ? (
          course.modules.map((module, index) => (
            <ModuleAccordion
              key={module.id}
              module={module}
              index={index}
            />
          ))
        ) : (
          <p className="text-gray-500 italic">暂无模块信息</p>
        )}
      </div>

      {/* 课程资源 */}
      {course.resources && course.resources.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">课程资源</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {course.resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CoursePage;