/**
 * 班级表单组件
 * 
 * 用于创建和编辑班级信息
 */

import React, { useState, useEffect } from 'react';
import type { ClassFormProps, ClassFormData, ClassSchedule } from '../../types';
import Button from '../../../../../components/ui/Button';
import { CloseIcon, CheckIcon, PlusIcon } from '../../../../../components/ui/icons';
import { validateEmail } from '../../utils';

const ClassForm: React.FC<ClassFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  mode
}) => {
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    description: '',
    maxStudents: undefined,
    semester: '',
    academicYear: new Date().getFullYear().toString()
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 初始化表单数据
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        maxStudents: initialData.maxStudents,
        semester: initialData.semester || '',
        academicYear: initialData.academicYear || new Date().getFullYear().toString()
      });
    }
  }, [initialData]);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 班级名称验证
    if (!formData.name.trim()) {
      newErrors.name = '班级名称不能为空';
    } else if (formData.name.length < 2) {
      newErrors.name = '班级名称至少2个字符';
    } else if (formData.name.length > 50) {
      newErrors.name = '班级名称不能超过50个字符';
    }

    // 学期验证
    if (!formData.semester.trim()) {
      newErrors.semester = '学期不能为空';
    }

    // 学年验证
    if (!formData.academicYear.trim()) {
      newErrors.academicYear = '学年不能为空';
    }

    // 最大学生数验证
    if (formData.maxStudents !== undefined) {
      if (formData.maxStudents < 1) {
        newErrors.maxStudents = '最大学生数必须大于0';
      } else if (formData.maxStudents > 200) {
        newErrors.maxStudents = '最大学生数不能超过200';
      }
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
  const handleInputChange = (field: keyof ClassFormData, value: any) => {
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



  // 学期选项
  const semesters = [
    { value: '春季学期', label: '春季学期' },
    { value: '夏季学期', label: '夏季学期' },
    { value: '秋季学期', label: '秋季学期' },
    { value: '冬季学期', label: '冬季学期' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 班级名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            班级名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`input-primary ${errors.name ? 'border-red-500' : ''}`}
            placeholder="请输入班级名称"
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* 最大学生数 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            最大学生数
          </label>
          <input
            type="number"
            value={formData.maxStudents || ''}
            onChange={(e) => handleInputChange('maxStudents', e.target.value ? Number(e.target.value) : undefined)}
            className={`input-primary ${errors.maxStudents ? 'border-red-500' : ''}`}
            placeholder="不限制请留空"
            min="1"
            max="200"
            disabled={loading}
          />
          {errors.maxStudents && (
            <p className="mt-1 text-sm text-red-600">{errors.maxStudents}</p>
          )}
        </div>

        {/* 学年 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            学年 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.academicYear}
            onChange={(e) => handleInputChange('academicYear', e.target.value)}
            className={`input-primary ${errors.academicYear ? 'border-red-500' : ''}`}
            placeholder="如：2024"
            disabled={loading}
          />
          {errors.academicYear && (
            <p className="mt-1 text-sm text-red-600">{errors.academicYear}</p>
          )}
        </div>

        {/* 学期 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            学期 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.semester}
            onChange={(e) => handleInputChange('semester', e.target.value)}
            className={`input-primary ${errors.semester ? 'border-red-500' : ''}`}
            disabled={loading}
          >
            <option value="">请选择学期</option>
            {semesters.map(semester => (
              <option key={semester.value} value={semester.value}>
                {semester.label}
              </option>
            ))}
          </select>
          {errors.semester && (
            <p className="mt-1 text-sm text-red-600">{errors.semester}</p>
          )}
        </div>




      </div>

      {/* 描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          班级描述
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className={`input-primary resize-none ${errors.description ? 'border-red-500' : ''}`}
          placeholder="请输入班级描述（可选）"
          disabled={loading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {(formData.description || '').length}/500
        </p>
      </div>



      {/* 表单按钮 */}
      <div className="bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {mode === 'create' ? (
              <>
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                创建成功后将自动跳转到班级详情页
              </>
            ) : (
              '修改班级基本信息'
            )}
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
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              loading={loading}
              icon={mode === 'create' ? <PlusIcon /> : <CheckIcon />}
            >
              {mode === 'create' ? '创建班级' : '保存修改'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ClassForm;
