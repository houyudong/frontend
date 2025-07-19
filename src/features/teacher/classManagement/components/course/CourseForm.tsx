/**
 * 课程表单组件
 * 
 * 用于创建和编辑课程信息
 */

import React, { useState, useEffect } from 'react';
import type { Course, CreateCourseRequest, CourseSchedule } from '../../types';

interface CourseFormProps {
  initialData?: Course | null;
  classId: string;
  onSubmit: (data: CreateCourseRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

const CourseForm: React.FC<CourseFormProps> = ({
  initialData,
  classId,
  onSubmit,
  onCancel,
  loading = false,
  mode
}) => {
  const [formData, setFormData] = useState<CreateCourseRequest>({
    name: '',
    description: '',
    classId,
    startDate: '',
    endDate: '',
    totalHours: 0,
    schedule: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [scheduleInput, setScheduleInput] = useState<Omit<CourseSchedule, 'id' | 'courseId'>>({
    dayOfWeek: 1,
    startTime: '',
    endTime: '',
    room: '',
    weeks: []
  });

  // 初始化表单数据
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        classId: initialData.classId,
        startDate: initialData.startDate.split('T')[0], // 转换为日期格式
        endDate: initialData.endDate.split('T')[0],
        totalHours: initialData.totalHours,
        schedule: initialData.schedule.map(s => ({
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          room: s.room,
          weeks: s.weeks
        }))
      });
    }
  }, [initialData]);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 课程名称验证
    if (!formData.name.trim()) {
      newErrors.name = '课程名称不能为空';
    } else if (formData.name.length < 2) {
      newErrors.name = '课程名称至少2个字符';
    } else if (formData.name.length > 100) {
      newErrors.name = '课程名称不能超过100个字符';
    }

    // 开始时间验证
    if (!formData.startDate) {
      newErrors.startDate = '开始时间不能为空';
    }

    // 结束时间验证
    if (!formData.endDate) {
      newErrors.endDate = '结束时间不能为空';
    } else if (formData.startDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = '结束时间必须晚于开始时间';
    }

    // 总课时验证
    if (formData.totalHours <= 0) {
      newErrors.totalHours = '总课时必须大于0';
    } else if (formData.totalHours > 1000) {
      newErrors.totalHours = '总课时不能超过1000';
    }

    // 描述长度验证
    if (formData.description && formData.description.length > 500) {
      newErrors.description = '描述不能超过500个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('提交表单失败:', error);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: keyof CreateCourseRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // 添加课程表
  const handleAddSchedule = () => {
    if (!scheduleInput.startTime || !scheduleInput.endTime) {
      return;
    }

    if (scheduleInput.startTime >= scheduleInput.endTime) {
      alert('结束时间必须晚于开始时间');
      return;
    }

    const newSchedule = { ...scheduleInput };
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, newSchedule]
    }));

    // 重置输入
    setScheduleInput({
      dayOfWeek: 1,
      startTime: '',
      endTime: '',
      room: '',
      weeks: []
    });
  };

  // 删除课程表项
  const handleRemoveSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  // 星期选项
  const weekDays = [
    { value: 1, label: '周一' },
    { value: 2, label: '周二' },
    { value: 3, label: '周三' },
    { value: 4, label: '周四' },
    { value: 5, label: '周五' },
    { value: 6, label: '周六' },
    { value: 0, label: '周日' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 课程名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            课程名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`input-primary ${errors.name ? 'border-red-500' : ''}`}
            placeholder="请输入课程名称"
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* 总课时 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            总课时 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.totalHours}
            onChange={(e) => handleInputChange('totalHours', Number(e.target.value))}
            className={`input-primary ${errors.totalHours ? 'border-red-500' : ''}`}
            placeholder="请输入总课时"
            min="1"
            max="1000"
            disabled={loading}
          />
          {errors.totalHours && (
            <p className="mt-1 text-sm text-red-600">{errors.totalHours}</p>
          )}
        </div>

        {/* 开始时间 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            开始时间 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className={`input-primary ${errors.startDate ? 'border-red-500' : ''}`}
            disabled={loading}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>

        {/* 结束时间 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            结束时间 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className={`input-primary ${errors.endDate ? 'border-red-500' : ''}`}
            disabled={loading}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* 课程描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          课程描述
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className={`input-primary resize-none ${errors.description ? 'border-red-500' : ''}`}
          placeholder="请输入课程描述（可选）"
          disabled={loading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {(formData.description || '').length}/500
        </p>
      </div>

      {/* 课程表 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          课程表
        </label>
        
        {/* 添加课程表项 */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs text-gray-600 mb-1">星期</label>
              <select
                value={scheduleInput.dayOfWeek}
                onChange={(e) => setScheduleInput(prev => ({
                  ...prev,
                  dayOfWeek: Number(e.target.value)
                }))}
                className="input-primary text-sm"
                disabled={loading}
              >
                {weekDays.map(day => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">开始时间</label>
              <input
                type="time"
                value={scheduleInput.startTime}
                onChange={(e) => setScheduleInput(prev => ({
                  ...prev,
                  startTime: e.target.value
                }))}
                className="input-primary text-sm"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">结束时间</label>
              <input
                type="time"
                value={scheduleInput.endTime}
                onChange={(e) => setScheduleInput(prev => ({
                  ...prev,
                  endTime: e.target.value
                }))}
                className="input-primary text-sm"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">教室</label>
              <input
                type="text"
                value={scheduleInput.room || ''}
                onChange={(e) => setScheduleInput(prev => ({
                  ...prev,
                  room: e.target.value
                }))}
                className="input-primary text-sm"
                placeholder="可选"
                disabled={loading}
              />
            </div>
            
            <button
              type="button"
              onClick={handleAddSchedule}
              className="btn-primary text-sm h-10"
              disabled={loading || !scheduleInput.startTime || !scheduleInput.endTime}
            >
              添加
            </button>
          </div>
        </div>

        {/* 课程表列表 */}
        {formData.schedule.length > 0 && (
          <div className="space-y-2">
            {formData.schedule.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center space-x-4 text-sm">
                  <span className="font-medium">
                    {weekDays.find(d => d.value === item.dayOfWeek)?.label}
                  </span>
                  <span>{item.startTime} - {item.endTime}</span>
                  {item.room && <span className="text-gray-500">@ {item.room}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSchedule(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                  disabled={loading}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          取消
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="loading-spinner w-4 h-4 mr-2"></div>
              {mode === 'create' ? '创建中...' : '更新中...'}
            </>
          ) : (
            mode === 'create' ? '创建课程' : '更新课程'
          )}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
