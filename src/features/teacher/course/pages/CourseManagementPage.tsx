/**
 * 教师端课程管理页面
 * 
 * 提供课程的增删改查功能
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import CourseCard from '../components/CourseCard';
import CourseEditModal from '../components/CourseEditModal';
import { Course, CourseFilter, CourseStats } from '../types/Course';

const CourseManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CourseFilter>({});
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 模拟课程数据
  const mockCourses: Course[] = [
    {
      id: 'course_001',
      name: 'STM32嵌入式开发基础',
      code: 'CS301',
      description: '学习STM32微控制器的基础开发技术，包括GPIO、定时器、串口通信等核心功能的编程实现。',
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
      prerequisites: ['C语言程序设计'],
      objectives: [
        '掌握STM32微控制器的基本架构和工作原理',
        '熟练使用STM32CubeMX进行项目配置',
        '能够编写基本的嵌入式应用程序'
      ],
      outline: '本课程主要介绍STM32微控制器的开发技术...',
      materials: [
        {
          id: 'mat_001',
          name: 'STM32开发指南.pdf',
          type: 'document',
          url: '/materials/stm32_guide.pdf',
          size: 2048000,
          description: '课程主要教材',
          uploadedAt: '2024-01-15T10:00:00Z'
        }
      ],
      assessments: [
        {
          id: 'assess_001',
          name: '期末考试',
          type: 'exam',
          weight: 50,
          description: '理论知识考核'
        },
        {
          id: 'assess_002',
          name: '实验报告',
          type: 'assignment',
          weight: 30,
          description: '实验操作和报告'
        },
        {
          id: 'assess_003',
          name: '课程项目',
          type: 'project',
          weight: 20,
          description: '综合项目设计'
        }
      ],
      tags: ['嵌入式', 'STM32', '微控制器'],
      coverImage: '/images/courses/stm32.jpg',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-15T16:30:00Z'
    },
    {
      id: 'course_002',
      name: 'ARM架构与编程',
      code: 'CS302',
      description: 'ARM处理器架构深入学习，包括汇编语言编程和系统级开发技术。',
      department: '计算机学院',
      category: '专业选修课',
      credits: 2,
      hours: 32,
      teacherId: 'teacher_001',
      teacherName: '刘教授',
      assistants: [],
      status: 'draft',
      semester: '2024春',
      academicYear: '2023-2024',
      maxStudents: 40,
      currentStudents: 0,
      prerequisites: ['计算机组成原理'],
      objectives: [
        '理解ARM处理器架构特点',
        '掌握ARM汇编语言编程',
        '了解ARM系统开发流程'
      ],
      outline: '本课程深入介绍ARM处理器架构...',
      materials: [],
      assessments: [
        {
          id: 'assess_004',
          name: '期末考试',
          type: 'exam',
          weight: 60,
          description: '理论和实践考核'
        },
        {
          id: 'assess_005',
          name: '编程作业',
          type: 'assignment',
          weight: 40,
          description: 'ARM汇编编程练习'
        }
      ],
      tags: ['ARM', '汇编', '处理器架构'],
      createdAt: '2024-01-12T09:00:00Z',
      updatedAt: '2024-01-12T09:00:00Z'
    },
    {
      id: 'course_003',
      name: 'C语言程序设计',
      code: 'CS101',
      description: 'C语言基础语法和程序设计方法，为后续专业课程打下坚实基础。',
      department: '计算机学院',
      category: '专业基础课',
      credits: 4,
      hours: 64,
      teacherId: 'teacher_001',
      teacherName: '刘教授',
      assistants: ['assistant_002', 'assistant_003'],
      status: 'published',
      semester: '2024春',
      academicYear: '2023-2024',
      maxStudents: 80,
      currentStudents: 72,
      prerequisites: [],
      objectives: [
        '掌握C语言基本语法',
        '培养程序设计思维',
        '能够编写中等复杂度的程序'
      ],
      outline: '本课程系统介绍C语言程序设计...',
      materials: [
        {
          id: 'mat_002',
          name: 'C程序设计教程.pdf',
          type: 'document',
          url: '/materials/c_tutorial.pdf',
          size: 1536000,
          description: '课程教材',
          uploadedAt: '2024-01-08T14:00:00Z'
        }
      ],
      assessments: [
        {
          id: 'assess_006',
          name: '期末考试',
          type: 'exam',
          weight: 40,
          description: '理论知识考核'
        },
        {
          id: 'assess_007',
          name: '编程作业',
          type: 'assignment',
          weight: 40,
          description: '编程练习'
        },
        {
          id: 'assess_008',
          name: '课堂参与',
          type: 'participation',
          weight: 20,
          description: '课堂表现和互动'
        }
      ],
      tags: ['C语言', '程序设计', '基础课程'],
      createdAt: '2024-01-05T10:00:00Z',
      updatedAt: '2024-01-14T11:20:00Z'
    }
  ];

  // 模拟统计数据
  const mockStats: CourseStats = {
    totalCourses: 3,
    publishedCourses: 2,
    draftCourses: 1,
    totalStudents: 117,
    averageRating: 4.6,
    completionRate: 0.78
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCourses(mockCourses);
        setStats(mockStats);
      } catch (error) {
        console.error('加载课程数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 过滤课程
  const filteredCourses = courses.filter(course => {
    const matchesKeyword = !filter.keyword || 
      course.name.toLowerCase().includes(filter.keyword.toLowerCase()) ||
      course.code.toLowerCase().includes(filter.keyword.toLowerCase());
    const matchesDepartment = !filter.department || course.department === filter.department;
    const matchesCategory = !filter.category || course.category === filter.category;
    const matchesStatus = !filter.status || course.status === filter.status;
    const matchesSemester = !filter.semester || course.semester === filter.semester;
    
    return matchesKeyword && matchesDepartment && matchesCategory && matchesStatus && matchesSemester;
  });

  // 创建课程
  const handleCreateCourse = async (courseData: any) => {
    try {
      const newCourse: Course = {
        id: `course_${Date.now()}`,
        ...courseData,
        teacherId: 'teacher_001',
        teacherName: '刘教授',
        assistants: [],
        currentStudents: 0,
        materials: [],
        assessments: [],
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setCourses(prev => [...prev, newCourse]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('创建课程失败:', error);
    }
  };

  // 编辑课程
  const handleEditCourse = async (courseData: any) => {
    try {
      setCourses(prev => prev.map(course => 
        course.id === editingCourse?.id 
          ? { ...course, ...courseData, updatedAt: new Date().toISOString() }
          : course
      ));
      setEditingCourse(null);
    } catch (error) {
      console.error('编辑课程失败:', error);
    }
  };

  // 删除课程
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('确定要删除这门课程吗？此操作不可恢复。')) {
      return;
    }

    try {
      setCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('删除课程失败:', error);
    }
  };

  // 发布/取消发布课程
  const handleTogglePublish = async (courseId: string) => {
    try {
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? { 
              ...course, 
              status: course.status === 'published' ? 'draft' : 'published',
              updatedAt: new Date().toISOString()
            }
          : course
      ));
    } catch (error) {
      console.error('更新课程状态失败:', error);
    }
  };

  // 批量操作
  const handleBatchOperation = async (operation: string) => {
    if (selectedCourses.length === 0) {
      alert('请先选择要操作的课程');
      return;
    }

    try {
      switch (operation) {
        case 'publish':
          setCourses(prev => prev.map(course => 
            selectedCourses.includes(course.id) 
              ? { ...course, status: 'published' as const, updatedAt: new Date().toISOString() }
              : course
          ));
          break;
        case 'unpublish':
          setCourses(prev => prev.map(course => 
            selectedCourses.includes(course.id) 
              ? { ...course, status: 'draft' as const, updatedAt: new Date().toISOString() }
              : course
          ));
          break;
        case 'delete':
          if (confirm(`确定要删除选中的 ${selectedCourses.length} 门课程吗？`)) {
            setCourses(prev => prev.filter(course => !selectedCourses.includes(course.id)));
          }
          break;
      }
      setSelectedCourses([]);
    } catch (error) {
      console.error('批量操作失败:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载课程数据中...</span>
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
            <li className="flex items-center" aria-current="page">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="font-medium text-gray-900">课程管理</span>
            </li>
          </ol>
        </nav>

        {/* 页面标题和操作 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">课程管理</h1>
            <p className="text-gray-600 mt-2">管理您的课程内容、学生和教学安排</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              新建课程
            </button>
            
            <Link
              to="/teacher/courses/schedule"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              课程排表
            </Link>
          </div>
        </div>

        {/* 统计信息 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">总课程数</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalCourses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">已发布</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.publishedCourses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">草稿</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.draftCourses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">总学生数</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">平均评分</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">完成率</p>
                  <p className="text-2xl font-semibold text-gray-900">{(stats.completionRate * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-1">
              {/* 搜索框 */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="搜索课程名称或代码..."
                  value={filter.keyword || ''}
                  onChange={(e) => setFilter(prev => ({ ...prev, keyword: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 筛选器 */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={filter.status || ''}
                  onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value || undefined }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">所有状态</option>
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                  <option value="archived">已归档</option>
                </select>

                <select
                  value={filter.category || ''}
                  onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value || undefined }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">所有类别</option>
                  <option value="专业核心课">专业核心课</option>
                  <option value="专业选修课">专业选修课</option>
                  <option value="专业基础课">专业基础课</option>
                  <option value="通识教育课">通识教育课</option>
                </select>

                <select
                  value={filter.semester || ''}
                  onChange={(e) => setFilter(prev => ({ ...prev, semester: e.target.value || undefined }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">所有学期</option>
                  <option value="2024春">2024春</option>
                  <option value="2024秋">2024秋</option>
                  <option value="2023秋">2023秋</option>
                </select>
              </div>
            </div>

            {/* 视图切换和批量操作 */}
            <div className="flex items-center space-x-3">
              {selectedCourses.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">已选择 {selectedCourses.length} 项</span>
                  <button
                    onClick={() => handleBatchOperation('publish')}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    批量发布
                  </button>
                  <button
                    onClick={() => handleBatchOperation('unpublish')}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                  >
                    取消发布
                  </button>
                  <button
                    onClick={() => handleBatchOperation('delete')}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    批量删除
                  </button>
                </div>
              )}

              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 课程列表 */}
        <div className="mb-8">
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无课程</h3>
              <p className="text-gray-600 mb-4">
                {Object.keys(filter).some(key => filter[key as keyof CourseFilter])
                  ? '当前筛选条件下没有找到相关课程'
                  : '您还没有创建任何课程，点击"新建课程"开始创建'}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                新建课程
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  viewMode={viewMode}
                  isSelected={selectedCourses.includes(course.id)}
                  onSelect={(selected) => {
                    if (selected) {
                      setSelectedCourses(prev => [...prev, course.id]);
                    } else {
                      setSelectedCourses(prev => prev.filter(id => id !== course.id));
                    }
                  }}
                  onEdit={() => setEditingCourse(course)}
                  onDelete={() => handleDeleteCourse(course.id)}
                  onTogglePublish={() => handleTogglePublish(course.id)}
                  onViewDetails={() => navigate(`/teacher/courses/${course.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 模态框 */}
        {showCreateModal && (
          <CourseEditModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateCourse}
            mode="create"
          />
        )}

        {editingCourse && (
          <CourseEditModal
            isOpen={!!editingCourse}
            onClose={() => setEditingCourse(null)}
            onSave={handleEditCourse}
            course={editingCourse}
            mode="edit"
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CourseManagementPage;
