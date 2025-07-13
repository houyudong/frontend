import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../../../shared/ui/layout/MainLayout';

// 课程模块和课时接口
interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Resource {
  title: string;
  url: string;
  type: 'documentation' | 'video' | 'example' | 'download';
}

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  instructor: string;
  students: number;
  progress: number;
  updatedAt: string;
  modules: Module[];
  resources: Resource[];
}

// 模拟课程详情数据
const mockCourseDetail: Course = {
  id: 'stm32-intro',
  title: 'STM32基础入门',
  description: '了解STM32系列微控制器的架构、特性和应用场景。本课程将介绍STM32系列的核心特点、性能优势以及与其他MCU的比较，为后续深入学习打下坚实基础。',
  level: '入门级',
  duration: '2小时',
  instructor: '张教授',
  students: 156,
  progress: 75,
  updatedAt: '2024-12-15',
  modules: [
    {
      id: 'module-1',
      title: '模块1: STM32系列概述',
      description: '介绍STM32系列的基本信息和产品线',
      lessons: [
        { id: 'lesson-1-1', title: '什么是STM32', duration: '15分钟', completed: true },
        { id: 'lesson-1-2', title: 'STM32系列的产品线', duration: '20分钟', completed: true },
        { id: 'lesson-1-3', title: 'STM32与其他MCU的比较', duration: '25分钟', completed: false }
      ]
    },
    {
      id: 'module-2',
      title: '模块2: 开发环境搭建',
      description: '学习如何搭建STM32开发环境',
      lessons: [
        { id: 'lesson-2-1', title: 'STM32CubeIDE安装', duration: '20分钟', completed: false },
        { id: 'lesson-2-2', title: '创建第一个项目', duration: '25分钟', completed: false },
        { id: 'lesson-2-3', title: '调试工具使用', duration: '20分钟', completed: false }
      ]
    }
  ],
  resources: [
    { title: 'STM32官方文档', url: '#', type: 'documentation' },
    { title: '开发环境安装视频', url: '#', type: 'video' },
    { title: '示例代码下载', url: '#', type: 'example' },
    { title: 'STM32CubeIDE下载', url: '#', type: 'download' }
  ]
};

// 模块手风琴组件
const ModuleAccordion: React.FC<{ module: Module; index: number }> = ({ module, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  const completedLessons = module.lessons.filter(lesson => lesson.completed).length;
  const totalLessons = module.lessons.length;

  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-t-lg flex items-center justify-between"
      >
        <div>
          <h3 className="font-medium text-gray-900">{module.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
          <div className="text-xs text-gray-500 mt-1">
            {completedLessons}/{totalLessons} 课时已完成
          </div>
        </div>
        <span className="text-gray-400">
          {isOpen ? '▼' : '▶'}
        </span>
      </button>
      
      {isOpen && (
        <div className="px-4 py-2">
          {module.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center">
                <span className={`mr-3 ${lesson.completed ? 'text-green-600' : 'text-gray-400'}`}>
                  {lesson.completed ? '✅' : '⭕'}
                </span>
                <div>
                  <span className={`text-sm ${lesson.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                    {lesson.title}
                  </span>
                  <div className="text-xs text-gray-500">{lesson.duration}</div>
                </div>
              </div>
              <button
                className={`text-sm px-3 py-1 rounded ${
                  lesson.completed 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {lesson.completed ? '复习' : '学习'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 资源卡片组件
const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'documentation': return '📄';
      case 'video': return '🎥';
      case 'example': return '💻';
      case 'download': return '⬇️';
      default: return '📎';
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'documentation': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'video': return 'bg-red-50 border-red-200 text-red-700';
      case 'example': return 'bg-green-50 border-green-200 text-green-700';
      case 'download': return 'bg-purple-50 border-purple-200 text-purple-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <a
      href={resource.url}
      className={`block p-3 rounded-lg border transition-colors hover:shadow-sm ${getResourceColor(resource.type)}`}
    >
      <div className="flex items-center">
        <span className="text-lg mr-3">{getResourceIcon(resource.type)}</span>
        <span className="text-sm font-medium">{resource.title}</span>
      </div>
    </a>
  );
};

/**
 * CourseDetailPage - 课程详情页面
 * 
 * 显示课程的详细信息、学习模块和相关资源
 * 参考ref目录实现，优化用户体验
 */
const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));
      setCourse(mockCourseDetail);
      setLoading(false);
    };

    loadCourse();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner h-8 w-8 mr-3"></div>
            <span className="text-gray-600">加载课程详情中...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">课程未找到</h3>
            <p className="text-gray-600 mb-4">请检查课程链接是否正确</p>
            <Link to="/student/courses" className="btn-primary">
              返回课程列表
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-container">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/student/courses"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <span className="mr-2">←</span>
            返回课程列表
          </Link>
        </div>

        {/* 课程头部信息 */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-700 mb-6">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span>👨‍🏫 {course.instructor}</span>
                <span>⏱️ {course.duration}</span>
                <span>📊 {course.level}</span>
                <span>👥 {course.students} 学员</span>
              </div>
            </div>

            <div className="mt-6 lg:mt-0 lg:w-80">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">学习进度</span>
                  <span className="text-sm font-bold text-blue-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <button className="w-full btn-primary">
                  {course.progress > 0 ? '继续学习' : '开始学习'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 课程模块 */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6">课程内容</h2>
            <div className="space-y-4">
              {course.modules.map((module, index) => (
                <ModuleAccordion key={module.id} module={module} index={index} />
              ))}
            </div>
          </div>

          {/* 相关资源 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">学习资源</h3>
            <div className="space-y-3">
              {course.resources.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
            </div>

            {/* 课程信息 */}
            <div className="mt-8 card">
              <h4 className="font-medium text-gray-900 mb-3">课程信息</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">难度等级</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">课程时长</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">更新时间</span>
                  <span className="font-medium">{course.updatedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">学员数量</span>
                  <span className="font-medium">{course.students} 人</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseDetailPage;
