/**
 * 教师通知发送组件
 * 
 * 允许教师向学生发送各种类型的通知
 */

import React, { useState, useEffect } from 'react';
import { BulkNotificationRequest, NotificationType, NotificationPriority } from '../types/Notification';

interface TeacherNotificationSenderProps {
  teacherId: string;
  onClose: () => void;
  onSent: () => void;
}

const TeacherNotificationSender: React.FC<TeacherNotificationSenderProps> = ({
  teacherId,
  onClose,
  onSent
}) => {
  const [formData, setFormData] = useState<Partial<BulkNotificationRequest>>({
    type: 'announcement',
    priority: 'normal',
    title: '',
    content: '',
    targetAudience: 'class_students',
    classIds: [],
    courseIds: [],
    scheduledAt: '',
    expiresAt: ''
  });
  
  const [classes, setClasses] = useState<Array<{id: string, name: string}>>([]);
  const [courses, setCourses] = useState<Array<{id: string, name: string}>>([]);
  const [sending, setSending] = useState(false);

  // 模拟加载教师的班级和课程数据
  useEffect(() => {
    const loadTeacherData = async () => {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClasses([
        { id: 'class_001', name: '嵌入式开发班' },
        { id: 'class_002', name: 'ARM架构班' },
        { id: 'class_003', name: '物联网开发班' }
      ]);
      
      setCourses([
        { id: 'course_001', name: 'STM32嵌入式开发基础' },
        { id: 'course_002', name: 'ARM架构与编程' },
        { id: 'course_003', name: '物联网系统设计' }
      ]);
    };

    loadTeacherData();
  }, [teacherId]);

  // 获取通知类型选项（教师可用的类型）
  const getNotificationTypes = (): Array<{value: NotificationType, label: string}> => [
    { value: 'announcement', label: '📢 课程公告' },
    { value: 'assignment', label: '📝 作业通知' },
    { value: 'reminder', label: '⏰ 学习提醒' },
    { value: 'grade', label: '📊 成绩通知' },
    { value: 'course', label: '📚 课程通知' },
    { value: 'experiment', label: '🧪 实验通知' },
    { value: 'deadline', label: '⚠️ 截止提醒' }
  ];

  // 获取优先级选项
  const getPriorityOptions = (): Array<{value: NotificationPriority, label: string, color: string}> => [
    { value: 'low', label: '低优先级', color: 'text-gray-600' },
    { value: 'normal', label: '普通', color: 'text-blue-600' },
    { value: 'high', label: '重要', color: 'text-orange-600' },
    { value: 'urgent', label: '紧急', color: 'text-red-600' }
  ];

  // 获取目标受众选项
  const getTargetAudienceOptions = () => [
    { value: 'class_students', label: '班级学生', description: '发送给指定班级的所有学生' },
    { value: 'course_students', label: '课程学生', description: '发送给指定课程的所有学生' },
    { value: 'all_students', label: '所有学生', description: '发送给所有学生（需要管理员权限）' }
  ];

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert('请填写标题和内容');
      return;
    }

    if (formData.targetAudience === 'class_students' && (!formData.classIds || formData.classIds.length === 0)) {
      alert('请选择目标班级');
      return;
    }

    if (formData.targetAudience === 'course_students' && (!formData.courseIds || formData.courseIds.length === 0)) {
      alert('请选择目标课程');
      return;
    }

    setSending(true);
    try {
      // 模拟发送通知
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('发送通知:', formData);
      alert('通知发送成功！');
      onSent();
      onClose();
    } catch (error) {
      console.error('发送通知失败:', error);
      alert('发送失败，请重试');
    } finally {
      setSending(false);
    }
  };

  // 处理班级选择
  const handleClassSelection = (classId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      classIds: checked 
        ? [...(prev.classIds || []), classId]
        : (prev.classIds || []).filter(id => id !== classId)
    }));
  };

  // 处理课程选择
  const handleCourseSelection = (courseId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      courseIds: checked 
        ? [...(prev.courseIds || []), courseId]
        : (prev.courseIds || []).filter(id => id !== courseId)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">发送通知</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 通知类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              通知类型
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as NotificationType }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {getNotificationTypes().map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* 优先级 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              优先级
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as NotificationPriority }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {getPriorityOptions().map(priority => (
                <option key={priority.value} value={priority.value} className={priority.color}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              通知标题
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入通知标题"
              required
            />
          </div>

          {/* 内容 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              通知内容
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入通知内容"
              required
            />
          </div>

          {/* 目标受众 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              发送对象
            </label>
            <div className="space-y-3">
              {getTargetAudienceOptions().map(option => (
                <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="targetAudience"
                    value={option.value}
                    checked={formData.targetAudience === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value as any }))}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 班级选择 */}
          {formData.targetAudience === 'class_students' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择班级
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {classes.map(cls => (
                  <label key={cls.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.classIds?.includes(cls.id) || false}
                      onChange={(e) => handleClassSelection(cls.id, e.target.checked)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{cls.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 课程选择 */}
          {formData.targetAudience === 'course_students' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择课程
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {courses.map(course => (
                  <label key={course.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.courseIds?.includes(course.id) || false}
                      onChange={(e) => handleCourseSelection(course.id, e.target.checked)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{course.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 定时发送 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                定时发送（可选）
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                过期时间（可选）
              </label>
              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={sending}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                sending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  发送中...
                </>
              ) : (
                '发送通知'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherNotificationSender;
