import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../../shared/ui/layout/MainLayout';

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
    progress: 0,
    instructor: '刘教授',
    students: 98,
    imageUrl: '/images/courses/timer-pwm.jpg',
    updatedAt: '2024-01-15'
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
      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* 课程图片 */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-4xl">📚</span>
        </div>
        {course.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1">
            <div
              className="bg-blue-500 h-1 transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* 课程信息 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
            {getLevelText(course.level)}
          </span>
          {course.progress === 100 && (
            <span className="text-green-600 text-sm font-medium">✅ 已完成</span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>👨‍🏫 {course.instructor}</span>
            <span>⏱️ {course.duration}</span>
          </div>
          <span>👥 {course.students}</span>
        </div>

        {course.progress > 0 && course.progress < 100 && (
          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>学习进度</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}
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

  // 模拟数据加载
  useEffect(() => {
    const loadCourses = async () => {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCourses(mockCourses);
      setLoading(false);
    };

    loadCourses();
  }, []);

  // 过滤课程
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  // 统计数据
  const stats = {
    total: courses.length,
    completed: courses.filter(c => c.progress === 100).length,
    inProgress: courses.filter(c => c.progress > 0 && c.progress < 100).length,
    notStarted: courses.filter(c => c.progress === 0).length
  };

  return (
    <MainLayout>
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">课程学习</h1>
          <p className="text-gray-600">学习STM32嵌入式开发的核心知识和实践技能</p>
        </div>

        {/* 学习统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">总课程数</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">已完成</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">学习中</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.notStarted}</div>
            <div className="text-sm text-gray-600">未开始</div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                搜索课程
              </label>
              <input
                type="text"
                className="input-primary"
                placeholder="输入课程名称或关键词..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                难度等级
              </label>
              <select
                className="input-primary"
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

        {/* 课程列表 */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner h-8 w-8 mr-3"></div>
            <span className="text-gray-600">加载课程中...</span>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </MainLayout>
  );
};

export default CoursesPage;
