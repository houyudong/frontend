/**
 * 教师端实验管理页面
 * 
 * 提供实验的增删改查功能
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import ExperimentCard from '../components/ExperimentCard';
import ExperimentEditModal from '../components/ExperimentEditModal';
import { Experiment, ExperimentFilter, ExperimentStats } from '../types/Experiment';

const ExperimentManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExperiment, setEditingExperiment] = useState<Experiment | null>(null);
  const [selectedExperiments, setSelectedExperiments] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<ExperimentFilter>({
    search: '',
    status: '',
    category: '',
    difficulty: '',
    courseId: '',
    semester: ''
  });

  // 模拟实验数据
  const mockExperiments: Experiment[] = [
    {
      id: 'exp_001',
      name: 'GPIO控制LED实验',
      code: 'EXP001',
      description: '通过STM32的GPIO端口控制LED灯的亮灭，学习基本的数字输出控制原理和编程方法。',
      courseId: 'course_001',
      courseName: 'STM32嵌入式开发基础',
      category: '基础实验',
      difficulty: 'beginner',
      type: 'individual',
      duration: 90,
      maxScore: 100,
      objectives: [
        '掌握STM32 GPIO的基本配置方法',
        '理解数字输出的工作原理',
        '学会使用HAL库进行GPIO编程',
        '培养基本的硬件调试能力'
      ],
      prerequisites: ['C语言基础', 'STM32开发环境'],
      steps: [
        {
          id: 'step_001',
          order: 1,
          title: '硬件连接',
          description: '将LED连接到STM32的PA5引脚',
          duration: 15
        },
        {
          id: 'step_002',
          order: 2,
          title: '代码编写',
          description: '编写GPIO初始化和控制代码',
          code: 'HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);',
          duration: 45
        },
        {
          id: 'step_003',
          order: 3,
          title: '程序调试',
          description: '下载程序并观察LED状态',
          duration: 30
        }
      ],
      materials: [
        {
          id: 'mat_001',
          name: '实验指导书.pdf',
          type: 'document',
          url: '/materials/gpio_led_guide.pdf',
          size: 1024000,
          description: '详细的实验步骤和原理说明',
          uploadedAt: '2024-01-15T10:00:00Z'
        }
      ],
      equipment: [
        {
          id: 'eq_001',
          name: 'STM32F103开发板',
          type: 'hardware',
          required: true,
          description: '主控制器'
        },
        {
          id: 'eq_002',
          name: 'LED灯',
          type: 'hardware',
          required: true,
          description: '发光二极管'
        }
      ],
      criteria: [
        {
          id: 'cri_001',
          name: '程序正确性',
          description: '程序能够正确控制LED',
          maxScore: 40,
          weight: 40
        },
        {
          id: 'cri_002',
          name: '实验报告',
          description: '实验报告完整准确',
          maxScore: 30,
          weight: 30
        },
        {
          id: 'cri_003',
          name: '操作规范',
          description: '实验操作规范安全',
          maxScore: 30,
          weight: 30
        }
      ],
      teacherId: 'teacher_001',
      teacherName: '刘教授',
      assistants: [],
      status: 'published',
      semester: '2024春',
      academicYear: '2023-2024',
      totalSubmissions: 45,
      completedSubmissions: 42,
      averageScore: 85.6,
      averageTime: 75,
      tags: ['GPIO', 'LED', '基础', '数字输出'],
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-15T16:30:00Z',
      publishedAt: '2024-01-16T09:00:00Z'
    },
    {
      id: 'exp_002',
      name: '串口通信实验',
      code: 'EXP002',
      description: '学习STM32的UART串口通信功能，实现与PC端的数据收发。',
      courseId: 'course_001',
      courseName: 'STM32嵌入式开发基础',
      category: '基础实验',
      difficulty: 'intermediate',
      type: 'individual',
      duration: 120,
      maxScore: 100,
      objectives: [
        '掌握UART通信原理',
        '学会配置STM32的串口功能',
        '实现数据的收发处理',
        '理解中断处理机制'
      ],
      prerequisites: ['GPIO控制实验', 'C语言指针'],
      steps: [
        {
          id: 'step_004',
          order: 1,
          title: '串口配置',
          description: '配置UART参数',
          duration: 30
        },
        {
          id: 'step_005',
          order: 2,
          title: '数据发送',
          description: '实现数据发送功能',
          duration: 45
        },
        {
          id: 'step_006',
          order: 3,
          title: '数据接收',
          description: '实现数据接收和处理',
          duration: 45
        }
      ],
      materials: [],
      equipment: [
        {
          id: 'eq_003',
          name: 'STM32F103开发板',
          type: 'hardware',
          required: true,
          description: '主控制器'
        },
        {
          id: 'eq_004',
          name: 'USB转串口模块',
          type: 'hardware',
          required: true,
          description: '串口通信接口'
        }
      ],
      criteria: [
        {
          id: 'cri_004',
          name: '通信功能',
          description: '串口通信功能正常',
          maxScore: 50,
          weight: 50
        },
        {
          id: 'cri_005',
          name: '代码质量',
          description: '代码结构清晰规范',
          maxScore: 25,
          weight: 25
        },
        {
          id: 'cri_006',
          name: '实验报告',
          description: '实验报告详细完整',
          maxScore: 25,
          weight: 25
        }
      ],
      teacherId: 'teacher_001',
      teacherName: '刘教授',
      assistants: [],
      status: 'published',
      semester: '2024春',
      academicYear: '2023-2024',
      totalSubmissions: 45,
      completedSubmissions: 38,
      averageScore: 78.4,
      averageTime: 95,
      tags: ['UART', '串口', '通信', '中断'],
      createdAt: '2024-01-12T08:00:00Z',
      updatedAt: '2024-01-18T14:20:00Z',
      publishedAt: '2024-01-20T10:00:00Z'
    },
    {
      id: 'exp_003',
      name: '定时器PWM实验',
      code: 'EXP003',
      description: '使用STM32定时器产生PWM信号，控制LED亮度或舵机角度。',
      courseId: 'course_001',
      courseName: 'STM32嵌入式开发基础',
      category: '综合实验',
      difficulty: 'intermediate',
      type: 'individual',
      duration: 150,
      maxScore: 100,
      objectives: [
        '理解PWM信号的原理和应用',
        '掌握定时器的配置方法',
        '学会PWM占空比的控制',
        '实现模拟量输出控制'
      ],
      prerequisites: ['定时器基础', 'GPIO控制实验'],
      steps: [],
      materials: [],
      equipment: [],
      criteria: [],
      teacherId: 'teacher_001',
      teacherName: '刘教授',
      assistants: [],
      status: 'draft',
      semester: '2024春',
      academicYear: '2023-2024',
      totalSubmissions: 0,
      completedSubmissions: 0,
      averageScore: 0,
      averageTime: 0,
      tags: ['PWM', '定时器', '模拟输出'],
      createdAt: '2024-01-20T08:00:00Z',
      updatedAt: '2024-01-22T11:15:00Z'
    }
  ];

  // 统计数据
  const stats: ExperimentStats = {
    totalExperiments: mockExperiments.length,
    publishedExperiments: mockExperiments.filter(exp => exp.status === 'published').length,
    draftExperiments: mockExperiments.filter(exp => exp.status === 'draft').length,
    archivedExperiments: mockExperiments.filter(exp => exp.status === 'archived').length,
    totalSubmissions: mockExperiments.reduce((sum, exp) => sum + exp.totalSubmissions, 0),
    averageScore: mockExperiments.reduce((sum, exp) => sum + exp.averageScore, 0) / mockExperiments.length,
    completionRate: mockExperiments.reduce((sum, exp) => sum + (exp.completedSubmissions / Math.max(exp.totalSubmissions, 1)), 0) / mockExperiments.length * 100,
    onTimeRate: 92.5
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExperiments(mockExperiments);
      } catch (error) {
        console.error('加载实验数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 筛选实验
  const filteredExperiments = experiments.filter(experiment => {
    const matchesSearch = !filter.search || 
      experiment.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      experiment.code.toLowerCase().includes(filter.search.toLowerCase());
    
    const matchesStatus = !filter.status || experiment.status === filter.status;
    const matchesCategory = !filter.category || experiment.category === filter.category;
    const matchesDifficulty = !filter.difficulty || experiment.difficulty === filter.difficulty;
    const matchesCourse = !filter.courseId || experiment.courseId === filter.courseId;
    const matchesSemester = !filter.semester || experiment.semester === filter.semester;

    return matchesSearch && matchesStatus && matchesCategory && matchesDifficulty && matchesCourse && matchesSemester;
  });

  // 创建实验
  const handleCreateExperiment = async (experimentData: any) => {
    try {
      const newExperiment: Experiment = {
        id: `exp_${Date.now()}`,
        ...experimentData,
        teacherId: 'teacher_001',
        teacherName: '刘教授',
        assistants: [],
        totalSubmissions: 0,
        completedSubmissions: 0,
        averageScore: 0,
        averageTime: 0,
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setExperiments(prev => [...prev, newExperiment]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('创建实验失败:', error);
    }
  };

  // 编辑实验
  const handleEditExperiment = async (experimentData: any) => {
    try {
      if (editingExperiment) {
        const updatedExperiment = { 
          ...editingExperiment, 
          ...experimentData, 
          updatedAt: new Date().toISOString() 
        };
        setExperiments(prev => prev.map(exp => 
          exp.id === editingExperiment.id ? updatedExperiment : exp
        ));
        setEditingExperiment(null);
      }
    } catch (error) {
      console.error('编辑实验失败:', error);
    }
  };

  // 删除实验
  const handleDeleteExperiment = async (experimentId: string) => {
    if (!confirm('确定要删除这个实验吗？此操作不可恢复。')) {
      return;
    }

    try {
      setExperiments(prev => prev.filter(exp => exp.id !== experimentId));
    } catch (error) {
      console.error('删除实验失败:', error);
    }
  };

  // 发布/取消发布实验
  const handleTogglePublish = async (experimentId: string) => {
    try {
      setExperiments(prev => prev.map(exp => {
        if (exp.id === experimentId) {
          const newStatus = exp.status === 'published' ? 'draft' : 'published';
          return {
            ...exp,
            status: newStatus,
            publishedAt: newStatus === 'published' ? new Date().toISOString() : exp.publishedAt,
            updatedAt: new Date().toISOString()
          };
        }
        return exp;
      }));
    } catch (error) {
      console.error('更新实验状态失败:', error);
    }
  };

  // 批量操作
  const handleBatchAction = async (action: 'publish' | 'unpublish' | 'delete') => {
    if (selectedExperiments.length === 0) {
      alert('请先选择要操作的实验');
      return;
    }

    const actionText = {
      publish: '发布',
      unpublish: '取消发布',
      delete: '删除'
    };

    if (!confirm(`确定要${actionText[action]}选中的 ${selectedExperiments.length} 个实验吗？`)) {
      return;
    }

    try {
      if (action === 'delete') {
        setExperiments(prev => prev.filter(exp => !selectedExperiments.includes(exp.id)));
      } else {
        const newStatus = action === 'publish' ? 'published' : 'draft';
        setExperiments(prev => prev.map(exp => {
          if (selectedExperiments.includes(exp.id)) {
            return {
              ...exp,
              status: newStatus,
              publishedAt: newStatus === 'published' ? new Date().toISOString() : exp.publishedAt,
              updatedAt: new Date().toISOString()
            };
          }
          return exp;
        }));
      }
      setSelectedExperiments([]);
    } catch (error) {
      console.error('批量操作失败:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载实验数据中...</span>
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
              <span className="font-medium text-gray-900">实验管理</span>
            </li>
          </ol>
        </nav>

        {/* 页面标题和操作 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">实验管理</h1>
            <p className="text-gray-600 mt-2">创建、管理和发布实验项目</p>
          </div>

          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              新建实验
            </button>

            <Link
              to="/teacher/experiments/schedule"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              实验安排
            </Link>
          </div>
        </div>

        {/* 统计面板 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总实验数</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalExperiments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span className="text-green-600 font-medium">{stats.publishedExperiments}</span>
              <span className="mx-1">已发布</span>
              <span className="text-yellow-600 font-medium">{stats.draftExperiments}</span>
              <span className="ml-1">草稿</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总提交数</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSubmissions}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>完成率 {stats.completionRate.toFixed(1)}%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均分数</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageScore.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>质量优秀</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">按时率</p>
                <p className="text-3xl font-bold text-gray-900">{stats.onTimeRate}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-orange-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>时间管理良好</span>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* 搜索框 */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="搜索实验名称或代码..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 筛选器 */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={filter.status}
                  onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">所有状态</option>
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                  <option value="archived">已归档</option>
                </select>

                <select
                  value={filter.category}
                  onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">所有类别</option>
                  <option value="基础实验">基础实验</option>
                  <option value="综合实验">综合实验</option>
                  <option value="设计实验">设计实验</option>
                  <option value="创新实验">创新实验</option>
                </select>

                <select
                  value={filter.difficulty}
                  onChange={(e) => setFilter(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">所有难度</option>
                  <option value="beginner">初级</option>
                  <option value="intermediate">中级</option>
                  <option value="advanced">高级</option>
                </select>
              </div>
            </div>

            {/* 视图切换和批量操作 */}
            <div className="flex items-center space-x-3">
              {selectedExperiments.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">已选择 {selectedExperiments.length} 项</span>
                  <button
                    onClick={() => handleBatchAction('publish')}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    批量发布
                  </button>
                  <button
                    onClick={() => handleBatchAction('unpublish')}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                  >
                    取消发布
                  </button>
                  <button
                    onClick={() => handleBatchAction('delete')}
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

        {/* 实验列表 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredExperiments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无实验</h3>
              <p className="text-gray-600 mb-4">
                {Object.keys(filter).some(key => filter[key as keyof ExperimentFilter])
                  ? '当前筛选条件下没有找到相关实验'
                  : '您还没有创建任何实验，点击"新建实验"开始创建'}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                新建实验
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6' : 'divide-y divide-gray-200'}>
              {filteredExperiments.map(experiment => (
                <ExperimentCard
                  key={experiment.id}
                  experiment={experiment}
                  viewMode={viewMode}
                  isSelected={selectedExperiments.includes(experiment.id)}
                  onSelect={(selected) => {
                    if (selected) {
                      setSelectedExperiments(prev => [...prev, experiment.id]);
                    } else {
                      setSelectedExperiments(prev => prev.filter(id => id !== experiment.id));
                    }
                  }}
                  onEdit={() => setEditingExperiment(experiment)}
                  onDelete={() => handleDeleteExperiment(experiment.id)}
                  onTogglePublish={() => handleTogglePublish(experiment.id)}
                  onViewDetails={() => navigate(`/teacher/experiments/${experiment.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 模态框 */}
        {showCreateModal && (
          <ExperimentEditModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateExperiment}
            mode="create"
          />
        )}

        {editingExperiment && (
          <ExperimentEditModal
            isOpen={!!editingExperiment}
            onClose={() => setEditingExperiment(null)}
            onSave={handleEditExperiment}
            experiment={editingExperiment}
            mode="edit"
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ExperimentManagementPage;
