import React from 'react';
import { Link } from 'react-router-dom';
import { HomeCourseCard } from '../components/cards';

// 特色课程数据
const featuredCourses = [
  {
    id: 'intro',
    title: 'STM32H7简介与基础',
    description: '了解STM32H7系列微控制器的特性、架构和开发环境搭建。',
    image: '/images/courses/stm32h7-intro.jpg',
  },
  {
    id: 'gpio',
    title: 'GPIO编程与LED控制',
    description: '学习配置和控制STM32H7的GPIO引脚，实现LED闪烁等基础操作。',
    image: '/images/courses/gpio-led.jpg',
  },
  {
    id: 'freertos',
    title: 'FreeRTOS基础',
    description: '在STM32H7上使用FreeRTOS实时操作系统，学习任务创建和通信。',
    image: '/images/courses/freertos.jpg',
  },
]

// CourseCard组件已移至components/cards/HomeCourseCard.jsx

/**
 * HomePage - 首页组件
 *
 * 网站的首页，展示平台特点、特色课程和快速开始指南。
 *
 * @component
 * @example
 * ```jsx
 * <HomePage />
 * ```
 *
 * @returns {ReactElement} HomePage组件
 */
function HomePage() {
  return (
    <div className="container mx-auto px-4">
      {/* 欢迎横幅 */}
      <div className="bg-blue-600 text-white rounded-lg shadow-xl p-8 mb-12">
        <h1 className="text-4xl font-bold mb-4">欢迎使用STM32H7 AI学习平台</h1>
        <p className="text-xl mb-6">
          通过智能AI辅助，轻松学习STM32H7系列嵌入式开发
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/courses"
            className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-semibold transition-colors"
          >
            浏览课程
          </Link>
          <Link
            to="/code-generator"
            className="bg-blue-800 text-white hover:bg-blue-900 px-6 py-3 rounded-md font-semibold transition-colors"
          >
            使用AI代码生成器
          </Link>
        </div>
      </div>

      {/* 平台特点 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">平台特点</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">交互式学习</h3>
            <p className="text-gray-600">通过详细的教程和实操练习，掌握STM32H7开发的核心和高级功能。</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI代码生成</h3>
            <p className="text-gray-600">使用先进的AI模型，自动生成STM32H7的代码，加速开发进程。</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">在线调试工具</h3>
            <p className="text-gray-600">使用内置的串口调试工具，直接连接并测试STM32H7硬件通信。</p>
          </div>
        </div>
      </section>

      {/* 特色课程 */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">特色课程</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <HomeCourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* 快速开始指南 */}
      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center">快速开始指南</h2>
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">浏览课程内容</h3>
              <p className="text-gray-600">选择您感兴趣的STM32H7课程或GPIO实验，开始学习之旅。</p>
            </div>
          </div>

          <div className="flex">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">使用AI代码生成器</h3>
              <p className="text-gray-600">描述您要实现的功能，AI将自动生成相应的STM32H7代码。</p>
            </div>
          </div>

          <div className="flex">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">测试您的代码</h3>
              <p className="text-gray-600">使用内置的串口调试工具，与STM32H7硬件进行实时通信。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage;