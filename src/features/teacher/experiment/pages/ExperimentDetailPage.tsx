/**
 * 实验详情页面
 * 
 * 提供实验的详细信息查看和管理功能
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import ExperimentEditModal from '../components/ExperimentEditModal';
import { Experiment, ExperimentSubmission, ClassExperiment } from '../types/Experiment';

const ExperimentDetailPage: React.FC = () => {
  const { experimentId } = useParams<{ experimentId: string }>();
  const navigate = useNavigate();
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [submissions, setSubmissions] = useState<ExperimentSubmission[]>([]);
  const [classExperiments, setClassExperiments] = useState<ClassExperiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'submissions' | 'schedule'>('overview');

  // 模拟实验数据
  const mockExperiment: Experiment = {
    id: experimentId || 'exp_001',
    name: 'GPIO控制LED实验',
    code: 'EXP001',
    description: '通过STM32的GPIO端口控制LED灯的亮灭，学习基本的数字输出控制原理和编程方法。本实验将帮助学生理解微控制器的基本工作原理，掌握GPIO的配置和使用方法。',
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
      '培养基本的硬件调试能力',
      '了解LED控制电路的设计原理'
    ],
    prerequisites: ['C语言基础', 'STM32开发环境', '数字电路基础'],
    steps: [
      {
        id: 'step_001',
        order: 1,
        title: '硬件连接',
        description: '将LED连接到STM32的PA5引脚，注意正确连接限流电阻',
        duration: 15,
        tips: ['注意LED的正负极', '选择合适的限流电阻']
      },
      {
        id: 'step_002',
        order: 2,
        title: '代码编写',
        description: '编写GPIO初始化和控制代码',
        code: `// GPIO初始化
GPIO_InitTypeDef GPIO_InitStruct = {0};
__HAL_RCC_GPIOA_CLK_ENABLE();

GPIO_InitStruct.Pin = GPIO_PIN_5;
GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
GPIO_InitStruct.Pull = GPIO_NOPULL;
GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

// LED控制
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);   // 点亮LED
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET); // 熄灭LED`,
        expectedOutput: 'LED能够正常点亮和熄灭',
        duration: 45,
        tips: ['确保时钟使能', '选择合适的GPIO模式']
      },
      {
        id: 'step_003',
        order: 3,
        title: '程序调试',
        description: '下载程序并观察LED状态，验证控制效果',
        duration: 30,
        tips: ['使用调试器观察程序执行', '检查硬件连接']
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
      },
      {
        id: 'mat_002',
        name: '参考代码.zip',
        type: 'code',
        url: '/materials/gpio_led_code.zip',
        size: 512000,
        description: '完整的参考代码和工程文件',
        uploadedAt: '2024-01-16T14:30:00Z'
      },
      {
        id: 'mat_003',
        name: '实验演示视频.mp4',
        type: 'video',
        url: '/materials/gpio_led_demo.mp4',
        size: 25600000,
        description: '实验操作演示视频',
        uploadedAt: '2024-01-10T09:00:00Z'
      }
    ],
    equipment: [
      {
        id: 'eq_001',
        name: 'STM32F103开发板',
        type: 'hardware',
        required: true,
        description: '主控制器，用于运行实验程序'
      },
      {
        id: 'eq_002',
        name: 'LED灯',
        type: 'hardware',
        required: true,
        description: '发光二极管，用于显示控制效果'
      },
      {
        id: 'eq_003',
        name: '限流电阻',
        type: 'hardware',
        required: true,
        description: '220Ω电阻，用于限制LED电流'
      },
      {
        id: 'eq_004',
        name: 'STM32CubeIDE',
        type: 'software',
        required: true,
        description: '集成开发环境'
      }
    ],
    criteria: [
      {
        id: 'cri_001',
        name: '程序正确性',
        description: '程序能够正确控制LED的亮灭',
        maxScore: 40,
        weight: 40
      },
      {
        id: 'cri_002',
        name: '实验报告',
        description: '实验报告完整准确，包含原理分析',
        maxScore: 30,
        weight: 30
      },
      {
        id: 'cri_003',
        name: '操作规范',
        description: '实验操作规范安全，硬件连接正确',
        maxScore: 20,
        weight: 20
      },
      {
        id: 'cri_004',
        name: '创新思考',
        description: '对实验有深入思考和创新改进',
        maxScore: 10,
        weight: 10
      }
    ],
    teacherId: 'teacher_001',
    teacherName: '刘教授',
    assistants: ['assistant_001'],
    status: 'published',
    semester: '2024春',
    academicYear: '2023-2024',
    totalSubmissions: 45,
    completedSubmissions: 42,
    averageScore: 85.6,
    averageTime: 75,
    tags: ['GPIO', 'LED', '基础', '数字输出', 'STM32'],
    coverImage: '/images/experiments/gpio_led.jpg',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T16:30:00Z',
    publishedAt: '2024-01-16T09:00:00Z'
  };

  // 模拟提交数据
  const mockSubmissions: ExperimentSubmission[] = [
    {
      id: 'sub_001',
      experimentId: experimentId || 'exp_001',
      experimentName: 'GPIO控制LED实验',
      studentId: 'student_001',
      studentName: '张三',
      classId: 'class_001',
      className: '计算机2023-1班',
      files: [
        {
          id: 'file_001',
          name: '实验报告.pdf',
          type: 'document',
          url: '/submissions/report_001.pdf',
          size: 2048000,
          description: '实验报告',
          uploadedAt: '2024-01-20T14:30:00Z'
        }
      ],
      report: '本次实验成功实现了GPIO控制LED的功能...',
      score: 88,
      maxScore: 100,
      criteriaScores: {
        'cri_001': 35,
        'cri_002': 28,
        'cri_003': 18,
        'cri_004': 7
      },
      feedback: '实验完成质量较好，代码规范，报告详细。建议在创新方面多思考。',
      submittedAt: '2024-01-20T14:30:00Z',
      gradedAt: '2024-01-22T10:15:00Z',
      status: 'graded',
      isLate: false,
      timeSpent: 85,
      attempts: 1
    },
    {
      id: 'sub_002',
      experimentId: experimentId || 'exp_001',
      experimentName: 'GPIO控制LED实验',
      studentId: 'student_002',
      studentName: '李四',
      classId: 'class_001',
      className: '计算机2023-1班',
      files: [],
      score: 92,
      maxScore: 100,
      criteriaScores: {
        'cri_001': 38,
        'cri_002': 29,
        'cri_003': 20,
        'cri_004': 5
      },
      submittedAt: '2024-01-19T16:45:00Z',
      gradedAt: '2024-01-21T15:20:00Z',
      status: 'graded',
      isLate: false,
      timeSpent: 70,
      attempts: 1
    }
  ];

  // 模拟班级实验关联数据
  const mockClassExperiments: ClassExperiment[] = [
    {
      id: 'ce_001',
      classId: 'class_001',
      className: '计算机2023-1班',
      experimentId: experimentId || 'exp_001',
      experimentName: 'GPIO控制LED实验',
      teacherId: 'teacher_001',
      teacherName: '刘教授',
      semester: '2024春',
      academicYear: '2023-2024',
      startDate: '2024-01-15',
      endDate: '2024-01-25',
      dueDate: '2024-01-25',
      laboratory: 'B201',
      schedules: [],
      enrolledStudents: 45,
      submittedCount: 42,
      gradedCount: 38,
      averageScore: 85.6,
      status: 'ongoing',
      createdAt: '2024-01-10T10:00:00Z'
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExperiment(mockExperiment);
        setSubmissions(mockSubmissions);
        setClassExperiments(mockClassExperiments);
      } catch (error) {
        console.error('加载实验详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [experimentId]);

  // 编辑实验
  const handleEditExperiment = async (experimentData: any) => {
    try {
      if (experiment) {
        const updatedExperiment = { ...experiment, ...experimentData, updatedAt: new Date().toISOString() };
        setExperiment(updatedExperiment);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('编辑实验失败:', error);
    }
  };

  // 删除实验
  const handleDeleteExperiment = async () => {
    if (!confirm('确定要删除这个实验吗？此操作不可恢复，将同时删除所有相关的提交数据。')) {
      return;
    }

    try {
      navigate('/teacher/experiments');
    } catch (error) {
      console.error('删除实验失败:', error);
    }
  };

  // 发布/取消发布实验
  const handleTogglePublish = async () => {
    if (!experiment) return;

    try {
      const newStatus = experiment.status === 'published' ? 'draft' : 'published';
      const updatedExperiment = { 
        ...experiment, 
        status: newStatus, 
        publishedAt: newStatus === 'published' ? new Date().toISOString() : experiment.publishedAt,
        updatedAt: new Date().toISOString() 
      };
      setExperiment(updatedExperiment);
    } catch (error) {
      console.error('更新实验状态失败:', error);
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
      case 'code':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
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

  // 获取难度颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取难度文本
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '初级';
      case 'intermediate':
        return '中级';
      case 'advanced':
        return '高级';
      default:
        return '未知';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载实验详情中...</span>
        </div>
      </MainLayout>
    );
  }

  if (!experiment) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">实验不存在</h3>
          <p className="text-gray-600 mb-4">您访问的实验不存在或已被删除</p>
          <Link
            to="/teacher/experiments"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            返回实验管理
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
              <Link to="/teacher/experiments" className="text-gray-600 hover:text-blue-600 transition-colors">
                实验管理
              </Link>
            </li>
            <li className="flex items-center" aria-current="page">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="font-medium text-gray-900">{experiment.name}</span>
            </li>
          </ol>
        </nav>

        {/* 实验头部信息 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="relative">
            {/* 实验封面 */}
            <div className="h-48 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-t-lg flex items-center justify-center">
              {experiment.coverImage ? (
                <img
                  src={experiment.coverImage}
                  alt={experiment.name}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              ) : (
                <div className="text-white text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                  </svg>
                  <div className="text-2xl font-bold">{experiment.name}</div>
                </div>
              )}
            </div>

            {/* 状态标签 */}
            <div className="absolute top-4 right-4">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                experiment.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : experiment.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {experiment.status === 'published' ? '已发布' :
                 experiment.status === 'draft' ? '草稿' : '已归档'}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{experiment.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {experiment.code}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {experiment.courseName}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {Math.floor(experiment.duration / 60)}小时{experiment.duration % 60}分钟
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(experiment.difficulty)}`}>
                    {getDifficultyText(experiment.difficulty)}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {experiment.type === 'group' ? '小组实验' : '个人实验'}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{experiment.description}</p>

                <div className="flex flex-wrap gap-2">
                  {experiment.tags.map(tag => (
                    <span key={tag} className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
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
                  编辑实验
                </button>

                <button
                  onClick={handleTogglePublish}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    experiment.status === 'published'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {experiment.status === 'published' ? '取消发布' : '发布实验'}
                </button>

                <button
                  onClick={handleDeleteExperiment}
                  className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  删除实验
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
                { key: 'overview', label: '实验概览', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { key: 'content', label: '实验内容', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z' },
                { key: 'submissions', label: '提交管理', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { key: 'schedule', label: '实验安排', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
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
            {/* 实验概览 */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* 基本信息 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">实验类别</div>
                      <div className="text-lg font-semibold text-gray-900">{experiment.category}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">预计时长</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {Math.floor(experiment.duration / 60)}小时{experiment.duration % 60}分钟
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">最高分数</div>
                      <div className="text-lg font-semibold text-gray-900">{experiment.maxScore}分</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">实验类型</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {experiment.type === 'group' ? '小组实验' : '个人实验'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 实验目标 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">实验目标</h3>
                  <div className="space-y-3">
                    {experiment.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{objective}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 先修要求 */}
                {experiment.prerequisites.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">先修要求</h3>
                    <div className="flex flex-wrap gap-2">
                      {experiment.prerequisites.map(prereq => (
                        <span key={prereq} className="inline-flex px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 评分标准 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">评分标准</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {experiment.criteria.map(criteria => (
                      <div key={criteria.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{criteria.name}</h4>
                          <div className="text-right">
                            <div className="text-lg font-bold text-purple-600">{criteria.weight}%</div>
                            <div className="text-sm text-gray-500">{criteria.maxScore}分</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{criteria.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 统计信息 */}
                {experiment.status === 'published' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">统计信息</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">{experiment.totalSubmissions}</div>
                        <div className="text-sm text-gray-600">总提交数</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">{experiment.completedSubmissions}</div>
                        <div className="text-sm text-gray-600">已完成</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600">{experiment.averageScore.toFixed(1)}</div>
                        <div className="text-sm text-gray-600">平均分</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-orange-600">{experiment.averageTime}</div>
                        <div className="text-sm text-gray-600">平均用时(分钟)</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 实验内容 */}
            {activeTab === 'content' && (
              <div className="space-y-8">
                {/* 实验步骤 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">实验步骤</h3>
                  <div className="space-y-6">
                    {experiment.steps.map((step, index) => (
                      <div key={step.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            步骤 {step.order}: {step.title}
                          </h4>
                          <span className="text-sm text-gray-500">
                            预计 {step.duration} 分钟
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4">{step.description}</p>

                        {step.code && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">示例代码:</h5>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{step.code}</code>
                            </pre>
                          </div>
                        )}

                        {step.expectedOutput && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">预期输出:</h5>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-green-800 text-sm">{step.expectedOutput}</p>
                            </div>
                          </div>
                        )}

                        {step.tips && step.tips.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">操作提示:</h5>
                            <ul className="list-disc list-inside space-y-1">
                              {step.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="text-sm text-gray-600">{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 设备要求 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">设备要求</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {experiment.equipment.map(eq => (
                      <div key={eq.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{eq.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              eq.type === 'hardware' ? 'bg-blue-100 text-blue-800' :
                              eq.type === 'software' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {eq.type === 'hardware' ? '硬件' :
                               eq.type === 'software' ? '软件' : '工具'}
                            </span>
                            {eq.required && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                必需
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{eq.description}</p>
                        {eq.specifications && (
                          <p className="text-xs text-gray-500 mt-1">规格: {eq.specifications}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 实验资料 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">实验资料</h3>
                    <button className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      添加资料
                    </button>
                  </div>

                  <div className="space-y-3">
                    {experiment.materials.map(material => (
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

            {/* 提交管理 */}
            {activeTab === 'submissions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">提交管理</h3>
                    <p className="text-gray-600">管理学生的实验提交和评分</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      共 {experiment.totalSubmissions} 份提交 / 已评分 {submissions.filter(s => s.status === 'graded').length} 份
                    </span>
                    <button className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      导出成绩
                    </button>
                  </div>
                </div>

                {/* 提交列表 */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          学生信息
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          提交时间
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          用时
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          分数
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
                      {submissions.map(submission => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                              <div className="text-sm text-gray-500">{submission.className}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(submission.submittedAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{submission.timeSpent}分钟</div>
                            <div className={`text-sm ${submission.isLate ? 'text-red-500' : 'text-green-500'}`}>
                              {submission.isLate ? '迟交' : '按时'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {submission.score !== undefined ? (
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {submission.score}/{submission.maxScore}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {((submission.score / submission.maxScore) * 100).toFixed(1)}%
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">未评分</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              submission.status === 'graded' ? 'bg-green-100 text-green-800' :
                              submission.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                              submission.status === 'returned' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {submission.status === 'graded' ? '已评分' :
                               submission.status === 'submitted' ? '已提交' :
                               submission.status === 'returned' ? '已退回' : '迟交'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">查看</button>
                              <button className="text-green-600 hover:text-green-800">评分</button>
                              {submission.status === 'graded' && (
                                <button className="text-purple-600 hover:text-purple-800">反馈</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 评分统计 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">提交统计</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>已提交:</span>
                        <span className="font-medium">{submissions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>已评分:</span>
                        <span className="font-medium">{submissions.filter(s => s.status === 'graded').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>按时提交:</span>
                        <span className="font-medium">{submissions.filter(s => !s.isLate).length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">分数分布</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>平均分:</span>
                        <span className="font-medium">{experiment.averageScore.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>最高分:</span>
                        <span className="font-medium">{Math.max(...submissions.filter(s => s.score).map(s => s.score!))}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>最低分:</span>
                        <span className="font-medium">{Math.min(...submissions.filter(s => s.score).map(s => s.score!))}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">时间统计</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>平均用时:</span>
                        <span className="font-medium">{experiment.averageTime}分钟</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>最长用时:</span>
                        <span className="font-medium">{Math.max(...submissions.map(s => s.timeSpent))}分钟</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>最短用时:</span>
                        <span className="font-medium">{Math.min(...submissions.map(s => s.timeSpent))}分钟</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 实验安排 */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">实验安排</h3>
                    <p className="text-gray-600">管理实验的时间安排和班级分配</p>
                  </div>
                  <Link
                    to="/teacher/experiments/schedule"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    实验排表
                  </Link>
                </div>

                {/* 班级实验安排 */}
                <div className="space-y-4">
                  {classExperiments.map(classExp => (
                    <div key={classExp.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{classExp.className}</h4>
                          <p className="text-gray-600">
                            {classExp.enrolledStudents} 名学生 •
                            {classExp.startDate} 至 {classExp.endDate} •
                            截止时间: {classExp.dueDate}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            classExp.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                            classExp.status === 'completed' ? 'bg-green-100 text-green-800' :
                            classExp.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {classExp.status === 'ongoing' ? '进行中' :
                             classExp.status === 'completed' ? '已完成' :
                             classExp.status === 'scheduled' ? '已安排' : '已取消'}
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            管理安排
                          </button>
                        </div>
                      </div>

                      {/* 实验室信息 */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">实验室安排</h5>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          实验室: {classExp.laboratory}
                        </div>
                      </div>

                      {/* 进度统计 */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{classExp.enrolledStudents}</div>
                          <div className="text-sm text-gray-600">参与学生</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{classExp.submittedCount}</div>
                          <div className="text-sm text-gray-600">已提交</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{classExp.gradedCount}</div>
                          <div className="text-sm text-gray-600">已评分</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{classExp.averageScore.toFixed(1)}</div>
                          <div className="text-sm text-gray-600">平均分</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {classExperiments.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">暂无实验安排</h3>
                    <p className="text-gray-600 mb-4">还没有为任何班级安排这个实验</p>
                    <Link
                      to="/teacher/experiments/schedule"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      添加实验安排
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 编辑实验模态框 */}
        {showEditModal && (
          <ExperimentEditModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSave={handleEditExperiment}
            experiment={experiment}
            mode="edit"
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ExperimentDetailPage;
