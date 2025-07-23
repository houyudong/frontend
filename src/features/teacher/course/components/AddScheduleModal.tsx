/**
 * 添加课程安排模态框组件
 */

import React, { useState, useEffect } from 'react';
import { TimeSlot, Classroom, ClassInfo } from '../types/Course';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: any) => Promise<void>;
  timeSlots: TimeSlot[];
  classrooms: Classroom[];
  classes: ClassInfo[];
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  timeSlots,
  classrooms,
  classes
}) => {
  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    classId: '',
    className: '',
    dayOfWeek: 1,
    startTime: '',
    endTime: '',
    classroom: '',
    weeks: [] as number[],
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 模拟课程数据
  const mockCourses = [
    { id: 'course_001', name: 'STM32嵌入式开发基础' },
    { id: 'course_002', name: 'ARM架构与编程' },
    { id: 'course_003', name: 'C语言程序设计' }
  ];

  // 重置表单
  useEffect(() => {
    if (isOpen) {
      setFormData({
        courseId: '',
        courseName: '',
        classId: '',
        className: '',
        dayOfWeek: 1,
        startTime: '',
        endTime: '',
        classroom: '',
        weeks: [],
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.courseId) {
      newErrors.courseId = '请选择课程';
    }

    if (!formData.classId) {
      newErrors.classId = '请选择班级';
    }

    if (!formData.startTime) {
      newErrors.startTime = '请选择开始时间';
    }

    if (!formData.endTime) {
      newErrors.endTime = '请选择结束时间';
    }

    if (!formData.classroom) {
      newErrors.classroom = '请选择教室';
    }

    if (formData.weeks.length === 0) {
      newErrors.weeks = '请选择上课周次';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('添加课程安排失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理课程选择
  const handleCourseChange = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    setFormData(prev => ({
      ...prev,
      courseId,
      courseName: course?.name || ''
    }));
  };

  // 处理班级选择
  const handleClassChange = (classId: string) => {
    const classInfo = classes.find(c => c.id === classId);
    setFormData(prev => ({
      ...prev,
      classId,
      className: classInfo?.name || ''
    }));
  };

  // 处理时间段选择
  const handleTimeSlotChange = (timeSlotId: string) => {
    const timeSlot = timeSlots.find(t => t.id === timeSlotId);
    if (timeSlot) {
      setFormData(prev => ({
        ...prev,
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime
      }));
    }
  };

  // 处理周次选择
  const handleWeekToggle = (week: number) => {
    setFormData(prev => ({
      ...prev,
      weeks: prev.weeks.includes(week)
        ? prev.weeks.filter(w => w !== week)
        : [...prev.weeks, week].sort((a, b) => a - b)
    }));
  };

  // 批量选择周次
  const handleBatchWeekSelect = (type: 'all' | 'odd' | 'even' | 'first-half' | 'second-half') => {
    let weeks: number[] = [];
    
    switch (type) {
      case 'all':
        weeks = Array.from({ length: 20 }, (_, i) => i + 1);
        break;
      case 'odd':
        weeks = Array.from({ length: 10 }, (_, i) => i * 2 + 1);
        break;
      case 'even':
        weeks = Array.from({ length: 10 }, (_, i) => (i + 1) * 2);
        break;
      case 'first-half':
        weeks = Array.from({ length: 10 }, (_, i) => i + 1);
        break;
      case 'second-half':
        weeks = Array.from({ length: 10 }, (_, i) => i + 11);
        break;
    }
    
    setFormData(prev => ({ ...prev, weeks }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* 模态框头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">添加课程安排</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 表单内容 */}
          <div className="p-6 space-y-6">
            {/* 课程和班级选择 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择课程 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.courseId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">请选择课程</option>
                  {mockCourses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
                {errors.courseId && <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择班级 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.classId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">请选择班级</option>
                  {classes.map(classInfo => (
                    <option key={classInfo.id} value={classInfo.id}>
                      {classInfo.name} ({classInfo.studentCount}人)
                    </option>
                  ))}
                </select>
                {errors.classId && <p className="text-red-500 text-sm mt-1">{errors.classId}</p>}
              </div>
            </div>

            {/* 时间安排 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">星期</label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData(prev => ({ ...prev, dayOfWeek: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>周一</option>
                  <option value={2}>周二</option>
                  <option value={3}>周三</option>
                  <option value={4}>周四</option>
                  <option value={5}>周五</option>
                  <option value={6}>周六</option>
                  <option value={7}>周日</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  时间段 <span className="text-red-500">*</span>
                </label>
                <select
                  onChange={(e) => handleTimeSlotChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startTime ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">请选择时间段</option>
                  {timeSlots.map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {slot.name} ({slot.startTime}-{slot.endTime})
                    </option>
                  ))}
                </select>
                {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  教室 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.classroom}
                  onChange={(e) => setFormData(prev => ({ ...prev, classroom: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.classroom ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">请选择教室</option>
                  {classrooms.map(room => (
                    <option key={room.id} value={room.name}>
                      {room.name} ({room.building}, 容量{room.capacity}人)
                    </option>
                  ))}
                </select>
                {errors.classroom && <p className="text-red-500 text-sm mt-1">{errors.classroom}</p>}
              </div>
            </div>

            {/* 上课周次 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上课周次 <span className="text-red-500">*</span>
              </label>
              
              {/* 批量选择按钮 */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => handleBatchWeekSelect('all')}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  全选
                </button>
                <button
                  type="button"
                  onClick={() => handleBatchWeekSelect('odd')}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  单周
                </button>
                <button
                  type="button"
                  onClick={() => handleBatchWeekSelect('even')}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                >
                  双周
                </button>
                <button
                  type="button"
                  onClick={() => handleBatchWeekSelect('first-half')}
                  className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                >
                  前10周
                </button>
                <button
                  type="button"
                  onClick={() => handleBatchWeekSelect('second-half')}
                  className="px-3 py-1 text-sm bg-pink-100 text-pink-700 rounded hover:bg-pink-200"
                >
                  后10周
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, weeks: [] }))}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  清空
                </button>
              </div>
              
              {/* 周次选择网格 */}
              <div className="grid grid-cols-10 gap-2">
                {Array.from({ length: 20 }, (_, i) => i + 1).map(week => (
                  <button
                    key={week}
                    type="button"
                    onClick={() => handleWeekToggle(week)}
                    className={`p-2 text-sm rounded border transition-colors ${
                      formData.weeks.includes(week)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {week}
                  </button>
                ))}
              </div>
              {errors.weeks && <p className="text-red-500 text-sm mt-1">{errors.weeks}</p>}
            </div>

            {/* 备注 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="如：理论课、实验课、上机课等"
              />
            </div>
          </div>

          {/* 模态框底部 */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{loading ? '添加中...' : '添加安排'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScheduleModal;
