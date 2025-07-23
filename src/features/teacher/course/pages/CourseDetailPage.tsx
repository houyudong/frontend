/**
 * 课程详情页面
 * 
 * 提供课程的详细信息查看和管理功能
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import CourseEditModal from '../components/CourseEditModal';
import { Course, CourseSchedule, ClassCourse } from '../types/Course';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [classCourses, setClassCourses] = useState<ClassCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'students' | 'schedule'>('overview');

  // 模拟课程数据
  const mockCourse: Course = {
    id: courseId || 'course_001',
    name: 'STM32嵌入式开发基础',
    code: 'CS301',
    description: '本课程主要介绍STM32微控制器的基础开发技术，包括GPIO控制、定时器应用、串口通信、中断处理等核心功能的编程实现。通过理论学习和实践操作相结合的方式，培养学生的嵌入式系统开发能力。',
    department: '计算机学院',
    category: '专业核心课',
    credits: 3,
    hours: 48,
    teacherId: 'teacher_001',
    teacherName: '刘教授',
    assistants: ['assistant_001'],
    status: 'published',
    semester: '2024春',
    academicYear: '2023-2024',
    maxStudents: 60,
    currentStudents: 45,
    prerequisites: ['C语言程序设计', '数字电路基础'],
    objectives: [
      '掌握STM32微控制器的基本架构和工作原理',
      '熟练使用STM32CubeMX进行项目配置和代码生成',
      '能够编写基本的GPIO控制、定时器和串口通信程序',
      '理解中断机制并能够正确处理中断事件',
      '具备独立完成简单嵌入式项目的能力'
    ],
    outline: `第一章 STM32微控制器概述
1.1 ARM Cortex-M架构介绍
1.2 STM32系列产品特点
1.3 开发环境搭建

第二章 GPIO编程
2.1 GPIO基本概念
2.2 GPIO配置方法
2.3 LED控制实验

第三章 定时器应用
3.1 定时器工作原理
3.2 基本定时功能
3.3 PWM输出控制

第四章 串口通信
4.1 UART通信原理
4.2 串口配置与编程
4.3 数据收发实验

第五章 中断处理
5.1 中断系统概述
5.2 外部中断配置
5.3 中断服务程序编写

第六章 综合项目实践
6.1 项目需求分析
6.2 系统设计与实现
6.3 调试与优化`,
    materials: [
      {
        id: 'mat_001',
        name: 'STM32开发指南.pdf',
        type: 'document',
        url: '/materials/stm32_guide.pdf',
        size: 2048000,
        description: '课程主要教材，包含完整的理论知识和实验指导',
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'mat_002',
        name: '实验代码示例.zip',
        type: 'document',
        url: '/materials/lab_examples.zip',
        size: 1024000,
        description: '所有实验的完整代码示例',
        uploadedAt: '2024-01-16T14:30:00Z'
      },
      {
        id: 'mat_003',
        name: '课程介绍视频.mp4',
        type: 'video',
        url: '/materials/course_intro.mp4',
        size: 52428800,
        description: '课程整体介绍和学习方法指导',
        uploadedAt: '2024-01-10T09:00:00Z'
      }
    ],
    assessments: [
      {
        id: 'assess_001',
        name: '期末考试',
        type: 'exam',
        weight: 50,
        description: '理论知识综合考核，包含选择题、填空题和简答题'
      },
      {
        id: 'assess_002',
        name: '实验报告',
        type: 'assignment',
        weight: 30,
        description: '6个实验的完整报告，包含实验过程、结果分析和心得体会'
      },
      {
        id: 'assess_003',
        name: '课程项目',
        type: 'project',
        weight: 20,
        description: '综合性项目设计，要求独立完成一个完整的嵌入式应用'
      }
    ],
    tags: ['嵌入式', 'STM32', '微控制器', '硬件编程'],
    coverImage: '/images/courses/stm32.jpg',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T16:30:00Z'
  };

  // 模拟课程安排数据
  const mockSchedules: CourseSchedule[] = [
    {
      id: 'schedule_001',
      courseId: courseId || 'course_001',
      courseName: 'STM32嵌入式开发基础',
      classId: 'class_001',
      className: '计算机2023-1班',
      teacherId: 'teacher_001',
      teacherName: '刘教授',
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '09:40',
      classroom: 'A101',
      weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      semester: '2024春',
      academicYear: '2023-2024',
      status: 'active',
      notes: '理论课'
    },
    {
      id: 'schedule_002',
      courseId: courseId || 'course_001',
      courseName: 'STM32嵌入式开发基础',
      classId: 'class_001',
      className: '计算机2023-1班',
      teacherId: 'teacher_001',
      teacherName: '刘教授',
      dayOfWeek: 3,
      startTime: '14:00',
      endTime: '15:40',
      classroom: 'B201',
      weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      semester: '2024春',
      academicYear: '2023-2024',
      status: 'active',
      notes: '实验课'
    }
  ];

  // 模拟班级课程关联数据
  const mockClassCourses: ClassCourse[] = [
    {
      id: 'cc_001',
      classId: 'class_001',
      className: '计算机2023-1班',
      courseId: courseId || 'course_001',
      courseName: 'STM32嵌入式开发基础',
      teacherId: 'teacher_001',
      teacherName: '刘教授',
      semester: '2024春',
      academicYear: '2023-2024',
      startDate: '2024-02-26',
      endDate: '2024-06-30',
      schedules: mockSchedules,
      enrolledStudents: 45,
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z'
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCourse(mockCourse);
        setSchedules(mockSchedules);
        setClassCourses(mockClassCourses);
      } catch (error) {
        console.error('加载课程详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId]);

  // 编辑课程
  const handleEditCourse = async (courseData: any) => {
    try {
      if (course) {
        const updatedCourse = { ...course, ...courseData, updatedAt: new Date().toISOString() };
        setCourse(updatedCourse);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('编辑课程失败:', error);
    }
  };

  // 删除课程
  const handleDeleteCourse = async () => {
    if (!confirm('确定要删除这门课程吗？此操作不可恢复，将同时删除所有相关的课程安排和学生数据。')) {
      return;
    }

    try {
      // 这里应该调用删除API
      navigate('/teacher/courses');
    } catch (error) {
      console.error('删除课程失败:', error);
    }
  };

  // 发布/取消发布课程
  const handleTogglePublish = async () => {
    if (!course) return;

    try {
      const newStatus = course.status === 'published' ? 'draft' : 'published';
      const updatedCourse = { ...course, status: newStatus, updatedAt: new Date().toISOString() };
      setCourse(updatedCourse);
    } catch (error) {
      console.error('更新课程状态失败:', error);
    }
  };

  // 获取文件大小格式化
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 获取文件类型图标
  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载课程详情中...</span>
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">课程不存在</h3>
          <p className="text-gray-600 mb-4">您访问的课程不存在或已被删除</p>
          <Link
            to="/teacher/courses"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            返回课程管理
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/teacher/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                教师工作台
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <Link to="/teacher/courses" className="text-gray-600 hover:text-blue-600 transition-colors">
                课程管理
              </Link>
            </li>
            <li className="flex items-center" aria-current="page">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="font-medium text-gray-900">{course.name}</span>
            </li>
          </ol>
        </nav>

        {/* 课程头部信息 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="relative">
            {/* 课程封面 */}
            <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg flex items-center justify-center">
              {course.coverImage ? (
                <img
                  src={course.coverImage}
                  alt={course.name}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              ) : (
                <div className="text-white text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div className="text-2xl font-bold">{course.name}</div>
                </div>
              )}
            </div>

            {/* 状态标签 */}
            <div className="absolute top-4 right-4">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                course.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : course.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {course.status === 'published' ? '已发布' :
                 course.status === 'draft' ? '草稿' : '已归档'}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {course.code}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {course.department}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.semester}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {course.currentStudents}/{course.maxStudents} 学生
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{course.description}</p>

                <div className="flex flex-wrap gap-2">
                  {course.tags.map(tag => (
                    <span key={tag} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-6 lg:mt-0 lg:ml-6">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  编辑课程
                </button>

                <button
                  onClick={handleTogglePublish}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    course.status === 'published'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {course.status === 'published' ? '取消发布' : '发布课程'}
                </button>

                <button
                  onClick={handleDeleteCourse}
                  className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  删除课程
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: '课程概览', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { key: 'content', label: '课程内容', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                { key: 'students', label: '学生管理', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
                { key: 'schedule', label: '课程安排', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 标签页内容 */}
          <div className="p-6">
            {/* 课程概览 */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* 基本信息 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">学分</div>
                      <div className="text-2xl font-bold text-gray-900">{course.credits}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">学时</div>
                      <div className="text-2xl font-bold text-gray-900">{course.hours}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">课程类别</div>
                      <div className="text-lg font-semibold text-gray-900">{course.category}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">学年学期</div>
                      <div className="text-lg font-semibold text-gray-900">{course.academicYear} {course.semester}</div>
                    </div>
                  </div>
                </div>

                {/* 课程目标 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">课程目标</h3>
                  <div className="space-y-3">
                    {course.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{objective}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 先修课程 */}
                {course.prerequisites.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">先修课程</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.prerequisites.map(prereq => (
                        <span key={prereq} className="inline-flex px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 考核方式 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">考核方式</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {course.assessments.map(assessment => (
                      <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{assessment.name}</h4>
                          <span className="text-lg font-bold text-blue-600">{assessment.weight}%</span>
                        </div>
                        <p className="text-sm text-gray-600">{assessment.description}</p>
                        <div className="mt-2">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            assessment.type === 'exam' ? 'bg-red-100 text-red-800' :
                            assessment.type === 'assignment' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {assessment.type === 'exam' ? '考试' :
                             assessment.type === 'assignment' ? '作业' : '项目'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 课程内容 */}
            {activeTab === 'content' && (
              <div className="space-y-8">
                {/* 课程大纲 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">课程大纲</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm leading-relaxed">
                      {course.outline}
                    </pre>
                  </div>
                </div>

                {/* 课程资料 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">课程资料</h3>
                    <button className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      添加资料
                    </button>
                  </div>

                  <div className="space-y-3">
                    {course.materials.map(material => (
                      <div key={material.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          {getFileTypeIcon(material.type)}
                          <div>
                            <h4 className="font-medium text-gray-900">{material.name}</h4>
                            <p className="text-sm text-gray-600">{material.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span>{formatFileSize(material.size)}</span>
                              <span>上传于 {new Date(material.uploadedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 学生管理 */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">学生管理</h3>
                    <p className="text-gray-600">当前课程的学生信息和学习进度</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      共 {course.currentStudents} 名学生 / 最大容量 {course.maxStudents} 人
                    </span>
                    <button className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      添加学生
                    </button>
                  </div>
                </div>

                {/* 班级列表 */}
                <div className="space-y-4">
                  {classCourses.map(classCourse => (
                    <div key={classCourse.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{classCourse.className}</h4>
                          <p className="text-gray-600">
                            {classCourse.enrolledStudents} 名学生 •
                            {classCourse.startDate} 至 {classCourse.endDate}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            classCourse.status === 'active' ? 'bg-green-100 text-green-800' :
                            classCourse.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {classCourse.status === 'active' ? '进行中' :
                             classCourse.status === 'completed' ? '已完成' : '已暂停'}
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            查看详情
                          </button>
                        </div>
                      </div>

                      {/* 课程安排预览 */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">课程安排</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {classCourse.schedules.map(schedule => (
                            <div key={schedule.id} className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              周{['', '一', '二', '三', '四', '五', '六', '日'][schedule.dayOfWeek]} {schedule.startTime}-{schedule.endTime} {schedule.classroom}
                              {schedule.notes && <span className="ml-2 text-blue-600">({schedule.notes})</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 课程安排 */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">课程安排</h3>
                    <p className="text-gray-600">管理课程的时间安排和教室分配</p>
                  </div>
                  <Link
                    to="/teacher/courses/schedule"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    课程排表
                  </Link>
                </div>

                {/* 课程安排列表 */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          班级
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          时间
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          教室
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          周次
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          类型
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          状态
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {schedules.map(schedule => (
                        <tr key={schedule.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{schedule.className}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              周{['', '一', '二', '三', '四', '五', '六', '日'][schedule.dayOfWeek]}
                            </div>
                            <div className="text-sm text-gray-500">
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{schedule.classroom}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              第{schedule.weeks[0]}-{schedule.weeks[schedule.weeks.length - 1]}周
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              schedule.notes?.includes('理论') ? 'bg-blue-100 text-blue-800' :
                              schedule.notes?.includes('实验') ? 'bg-green-100 text-green-800' :
                              schedule.notes?.includes('上机') ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {schedule.notes || '理论课'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              schedule.status === 'active' ? 'bg-green-100 text-green-800' :
                              schedule.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {schedule.status === 'active' ? '进行中' :
                               schedule.status === 'cancelled' ? '已取消' : '已完成'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">编辑</button>
                              <button className="text-red-600 hover:text-red-800">删除</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 编辑课程模态框 */}
        {showEditModal && (
          <CourseEditModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSave={handleEditCourse}
            course={course}
            mode="edit"
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CourseDetailPage;
