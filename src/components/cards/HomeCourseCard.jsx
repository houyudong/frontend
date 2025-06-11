import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * HomeCourseCard - 首页课程卡片组件
 * 
 * 用于在首页展示课程信息的卡片组件。
 * 
 * @component
 * @example
 * ```jsx
 * const course = {
 *   id: 'intro',
 *   title: 'STM32H7简介与基础',
 *   description: '了解STM32H7系列微控制器的特性、架构和开发环境搭建。',
 *   image: '/images/courses/stm32h7-intro.jpg',
 * };
 * 
 * <HomeCourseCard course={course} />
 * ```
 * 
 * @param {Object} props - 组件属性
 * @param {Object} props.course - 课程信息
 * @param {string} props.course.id - 课程ID
 * @param {string} props.course.title - 课程标题
 * @param {string} props.course.description - 课程描述
 * @param {string} props.course.image - 课程图片URL
 * @returns {ReactElement} HomeCourseCard组件
 */
function HomeCourseCard({ course }) {
  const [imageError, setImageError] = useState(false);
  
  // 处理图片加载错误
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {!imageError ? (
          <img 
            src={course.image} 
            alt={course.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="text-center p-4">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <span className="text-gray-500 mt-2 block">课程图片</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <Link
          to={`/courses/${course.id}`}
          className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          查看课程
        </Link>
      </div>
    </div>
  );
}

export default HomeCourseCard;
