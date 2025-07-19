/**
 * 课程选择组件
 * 
 * 从已有课程中选择课程添加到班级
 */

import React, { useState, useEffect } from 'react';
import Button from '../../../../../components/ui/Button';
import { SearchIcon, CheckIcon, CloseIcon } from '../../../../../components/ui/icons';

// 模拟的全局课程数据
interface GlobalCourse {
  id: string;
  name: string;
  description?: string;
  category: string;
  duration: number; // 课程时长（小时）
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: string;
}

interface CourseSelectorProps {
  classId: string;
  existingCourseIds: string[]; // 已添加的课程ID列表
  onSelect: (courses: GlobalCourse[]) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({
  classId,
  existingCourseIds,
  onSelect,
  onCancel,
  loading = false
}) => {
  const [courses, setCourses] = useState<GlobalCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<GlobalCourse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<GlobalCourse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  // 模拟的全局课程数据
  const mockGlobalCourses: GlobalCourse[] = [
    {
      id: 'global_course_001',
      name: 'STM32基础编程',
      description: '学习STM32微控制器的基础编程知识和开发环境搭建',
      category: '嵌入式开发',
      duration: 32,
      difficulty: 'beginner',
      tags: ['STM32', '嵌入式', 'C语言', '微控制器'],
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'global_course_002',
      name: 'STM32高级应用',
      description: '深入学习STM32的高级功能和实际项目开发',
      category: '嵌入式开发',
      duration: 48,
      difficulty: 'advanced',
      tags: ['STM32', '高级编程', '项目开发', 'RTOS'],
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'global_course_003',
      name: 'Arduino创客编程',
      description: 'Arduino开发板的创意项目制作和编程实践',
      category: '创客教育',
      duration: 24,
      difficulty: 'beginner',
      tags: ['Arduino', '创客', '传感器', 'IoT'],
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'global_course_004',
      name: 'PCB设计基础',
      description: '学习PCB电路板设计的基础知识和设计工具使用',
      category: '硬件设计',
      duration: 40,
      difficulty: 'intermediate',
      tags: ['PCB', '电路设计', 'Altium', '硬件'],
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'global_course_005',
      name: '物联网系统开发',
      description: '构建完整的物联网系统，包括硬件和软件开发',
      category: '物联网',
      duration: 56,
      difficulty: 'advanced',
      tags: ['IoT', '云平台', '通信协议', '系统集成'],
      createdAt: '2024-01-01T00:00:00Z'
    }
  ];

  // 获取课程列表
  useEffect(() => {
    const fetchCourses = async () => {
      setDataLoading(true);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 过滤掉已添加的课程
      const availableCourses = mockGlobalCourses.filter(
        course => !existingCourseIds.includes(course.id)
      );
      
      setCourses(availableCourses);
      setFilteredCourses(availableCourses);
      setDataLoading(false);
    };

    fetchCourses();
  }, [existingCourseIds]);

  // 搜索和筛选
  useEffect(() => {
    let filtered = courses;

    // 按搜索词筛选
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 按分类筛选
    if (categoryFilter) {
      filtered = filtered.filter(course => course.category === categoryFilter);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, categoryFilter]);

  // 获取所有分类
  const categories = Array.from(new Set(courses.map(course => course.category)));

  // 处理课程选择
  const handleCourseToggle = (course: GlobalCourse) => {
    setSelectedCourses(prev => {
      const isSelected = prev.some(c => c.id === course.id);
      if (isSelected) {
        return prev.filter(c => c.id !== course.id);
      } else {
        return [...prev, course];
      }
    });
  };

  // 处理确认选择
  const handleConfirm = async () => {
    if (selectedCourses.length === 0) {
      return;
    }
    
    try {
      await onSelect(selectedCourses);
    } catch (error) {
      console.error('添加课程失败:', error);
    }
  };

  // 难度标签颜色
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

  // 难度标签文本
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

  return (
    <div className="space-y-6">
      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索课程名称、描述或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-primary pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input-primary pr-8 appearance-none bg-white"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em'
          }}
        >
          <option value="">所有分类</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* 课程列表 */}
      <div className="max-h-96 overflow-y-auto">
        {dataLoading ? (
          <div className="text-center py-8">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-600">加载课程列表...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.207-2.175C5.25 12.09 5.25 11.438 5.25 10.5V7.5c0-.938 0-1.59.543-2.325C6.336 4.441 7.164 4 8.25 4h7.5c1.086 0 1.914.441 2.457 1.175.543.735.543 1.387.543 2.325v3c0 .938 0 1.59-.543 2.325-.543.734-1.371 1.175-2.457 1.175H12" />
            </svg>
            <p className="text-gray-600">
              {searchTerm || categoryFilter ? '没有找到匹配的课程' : '暂无可添加的课程'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCourses.map(course => {
              const isSelected = selectedCourses.some(c => c.id === course.id);
              return (
                <div
                  key={course.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleCourseToggle(course)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{course.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(course.difficulty)}`}>
                          {getDifficultyText(course.difficulty)}
                        </span>
                        <span className="text-sm text-gray-500">{course.duration}小时</span>
                      </div>
                      {course.description && (
                        <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">分类:</span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {course.category}
                        </span>
                        {course.tags.map(tag => (
                          <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 选择统计 */}
      {selectedCourses.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            已选择 {selectedCourses.length} 门课程: {selectedCourses.map(c => c.name).join(', ')}
          </p>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            从课程库中选择课程添加到班级
          </div>
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onCancel}
              disabled={loading}
              icon={<CloseIcon />}
            >
              取消
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleConfirm}
              disabled={loading || selectedCourses.length === 0}
              loading={loading}
              icon={<CheckIcon />}
            >
              添加选中课程 ({selectedCourses.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSelector;
