/**
 * 学生表单组件
 * 
 * 用于创建和编辑学生信息
 */

import React, { useState, useEffect } from 'react';
import type { StudentFormProps, StudentFormData, Class } from '../../types';
import Button from '../../../../../components/ui/Button';
import { CloseIcon, CheckIcon, PlusIcon } from '../../../../../components/ui/icons';
import { validateEmail, validatePhone, validateStudentId, validateUsername } from '../../utils';

const StudentForm: React.FC<StudentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  mode,
  availableClasses
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    username: '',
    email: '',
    fullName: '',
    studentId: '',
    classId: '',
    phone: '',
    grade: '',
    major: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 初始化表单数据
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 用户名验证
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = '用户名格式不正确（3-20位字母、数字、下划线）';
    }

    // 邮箱验证
    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    // 姓名验证
    if (!formData.fullName.trim()) {
      newErrors.fullName = '姓名不能为空';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = '姓名至少2个字符';
    } else if (formData.fullName.length > 50) {
      newErrors.fullName = '姓名不能超过50个字符';
    }

    // 学号验证
    if (!formData.studentId.trim()) {
      newErrors.studentId = '学号不能为空';
    } else if (!validateStudentId(formData.studentId)) {
      newErrors.studentId = '学号格式不正确（6-20位字母数字组合）';
    }

    // 班级验证
    if (!formData.classId) {
      newErrors.classId = '请选择班级';
    }

    // 手机号验证（可选）
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = '手机号格式不正确';
    }

    // 备注长度验证
    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = '备注不能超过500个字符';
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
  const handleInputChange = (field: keyof StudentFormData, value: any) => {
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

  // 年级选项
  const gradeOptions = [
    { value: '大一', label: '大一' },
    { value: '大二', label: '大二' },
    { value: '大三', label: '大三' },
    { value: '大四', label: '大四' },
    { value: '研一', label: '研一' },
    { value: '研二', label: '研二' },
    { value: '研三', label: '研三' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 用户名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            用户名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className={`input-primary ${errors.username ? 'border-red-500' : ''}`}
            placeholder="请输入用户名"
            disabled={loading}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        {/* 姓名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={`input-primary ${errors.fullName ? 'border-red-500' : ''}`}
            placeholder="请输入真实姓名"
            disabled={loading}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* 学号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            学号 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.studentId}
            onChange={(e) => handleInputChange('studentId', e.target.value)}
            className={`input-primary ${errors.studentId ? 'border-red-500' : ''}`}
            placeholder="请输入学号"
            disabled={loading}
          />
          {errors.studentId && (
            <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
          )}
        </div>

        {/* 邮箱 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            邮箱 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`input-primary ${errors.email ? 'border-red-500' : ''}`}
            placeholder="请输入邮箱地址"
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* 班级 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            班级 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.classId}
            onChange={(e) => handleInputChange('classId', e.target.value)}
            className={`input-primary ${errors.classId ? 'border-red-500' : ''}`}
            disabled={loading}
          >
            <option value="">请选择班级</option>
            {availableClasses.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.academicYear} {cls.semester})
              </option>
            ))}
          </select>
          {errors.classId && (
            <p className="mt-1 text-sm text-red-600">{errors.classId}</p>
          )}
        </div>

        {/* 手机号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            手机号
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`input-primary ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="请输入手机号（可选）"
            disabled={loading}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* 年级 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            年级
          </label>
          <select
            value={formData.grade || ''}
            onChange={(e) => handleInputChange('grade', e.target.value)}
            className="input-primary"
            disabled={loading}
          >
            <option value="">请选择年级</option>
            {gradeOptions.map(grade => (
              <option key={grade.value} value={grade.value}>
                {grade.label}
              </option>
            ))}
          </select>
        </div>

        {/* 专业 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            专业
          </label>
          <input
            type="text"
            value={formData.major || ''}
            onChange={(e) => handleInputChange('major', e.target.value)}
            className="input-primary"
            placeholder="请输入专业名称（可选）"
            disabled={loading}
          />
        </div>
      </div>

      {/* 备注 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          备注
        </label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={3}
          className={`input-primary resize-none ${errors.notes ? 'border-red-500' : ''}`}
          placeholder="请输入备注信息（可选）"
          disabled={loading}
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {(formData.notes || '').length}/500
        </p>
      </div>

      {/* 表单按钮 */}
      <div className="bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {mode === 'create' ? (
              <>
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                添加学生到班级
              </>
            ) : (
              '修改学生信息'
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
              {mode === 'create' ? '添加学生' : '保存修改'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default StudentForm;
