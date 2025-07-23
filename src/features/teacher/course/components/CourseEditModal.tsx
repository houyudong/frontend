/**
 * 课程编辑模态框组件
 * 
 * 支持创建和编辑课程
 */

import React, { useState, useEffect } from 'react';
import { Course, CourseFormData } from '../types/Course';

interface CourseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: CourseFormData) => Promise<void>;
  course?: Course;
  mode: 'create' | 'edit';
}

const CourseEditModal: React.FC<CourseEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  course,
  mode
}) => {
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    code: '',
    description: '',
    department: '计算机学院',
    category: '专业核心课',
    credits: 3,
    hours: 48,
    maxStudents: 60,
    prerequisites: [],
    objectives: [''],
    outline: '',
    semester: '2024春',
    academicYear: '2023-2024',
    tags: [],
    coverImage: ''
  });

  const [loading, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentTab, setCurrentTab] = useState<'basic' | 'content' | 'settings'>('basic');

  // 初始化表单数据
  useEffect(() => {
    if (course && mode === 'edit') {
      setFormData({
        name: course.name,
        code: course.code,
        description: course.description,
        department: course.department,
        category: course.category,
        credits: course.credits,
        hours: course.hours,
        maxStudents: course.maxStudents,
        prerequisites: course.prerequisites,
        objectives: course.objectives,
        outline: course.outline,
        semester: course.semester,
        academicYear: course.academicYear,
        tags: course.tags,
        coverImage: course.coverImage
      });
    } else {
      // 重置表单
      setFormData({
        name: '',
        code: '',
        description: '',
        department: '计算机学院',
        category: '专业核心课',
        credits: 3,
        hours: 48,
        maxStudents: 60,
        prerequisites: [],
        objectives: [''],
        outline: '',
        semester: '2024春',
        academicYear: '2023-2024',
        tags: [],
        coverImage: ''
      });
    }
    setErrors({});
    setCurrentTab('basic');
  }, [course, mode, isOpen]);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '课程名称不能为空';
    }

    if (!formData.code.trim()) {
      newErrors.code = '课程代码不能为空';
    }

    if (!formData.description.trim()) {
      newErrors.description = '课程描述不能为空';
    }

    if (formData.credits <= 0) {
      newErrors.credits = '学分必须大于0';
    }

    if (formData.hours <= 0) {
      newErrors.hours = '学时必须大于0';
    }

    if (formData.maxStudents <= 0) {
      newErrors.maxStudents = '最大学生数必须大于0';
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

    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('保存课程失败:', error);
    } finally {
      setSaving(false);
    }
  };

  // 添加课程目标
  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  // 删除课程目标
  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  // 更新课程目标
  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  // 添加标签
  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* 模态框头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? '新建课程' : '编辑课程'}
            </h2>
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

          {/* 标签页导航 */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'basic', label: '基本信息' },
                { key: 'content', label: '课程内容' },
                { key: 'settings', label: '高级设置' }
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setCurrentTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    currentTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 表单内容 */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* 基本信息标签页 */}
            {currentTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      课程名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="请输入课程名称"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      课程代码 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.code ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="如: CS301"
                    />
                    {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    课程描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="请输入课程描述"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">所属院系</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="计算机学院">计算机学院</option>
                      <option value="电子工程学院">电子工程学院</option>
                      <option value="机械工程学院">机械工程学院</option>
                      <option value="数学学院">数学学院</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">课程类别</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="专业核心课">专业核心课</option>
                      <option value="专业选修课">专业选修课</option>
                      <option value="专业基础课">专业基础课</option>
                      <option value="通识教育课">通识教育课</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      学分 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.credits}
                      onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.credits ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.credits && <p className="text-red-500 text-sm mt-1">{errors.credits}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      学时 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.hours}
                      onChange={(e) => setFormData(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.hours ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.hours && <p className="text-red-500 text-sm mt-1">{errors.hours}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      最大学生数 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxStudents}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.maxStudents ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.maxStudents && <p className="text-red-500 text-sm mt-1">{errors.maxStudents}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">学期</label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="2024春">2024春</option>
                      <option value="2024秋">2024秋</option>
                      <option value="2025春">2025春</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 课程内容标签页 */}
            {currentTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">课程大纲</label>
                  <textarea
                    value={formData.outline}
                    onChange={(e) => setFormData(prev => ({ ...prev, outline: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入课程大纲..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">课程目标</label>
                  <div className="space-y-3">
                    {formData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={objective}
                          onChange={(e) => updateObjective(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`课程目标 ${index + 1}`}
                        />
                        {formData.objectives.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeObjective(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addObjective}
                      className="inline-flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      添加课程目标
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">先修课程</label>
                  <div className="space-y-2">
                    {formData.prerequisites.map((prereq, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={prereq}
                          onChange={(e) => {
                            const newPrereqs = [...formData.prerequisites];
                            newPrereqs[index] = e.target.value;
                            setFormData(prev => ({ ...prev, prerequisites: newPrereqs }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="先修课程名称"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              prerequisites: prev.prerequisites.filter((_, i) => i !== index)
                            }));
                          }}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          prerequisites: [...prev.prerequisites, '']
                        }));
                      }}
                      className="inline-flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      添加先修课程
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 高级设置标签页 */}
            {currentTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">课程标签</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="输入标签后按回车添加"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          addTag(input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <div className="text-sm text-gray-500">按回车添加</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">封面图片</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {formData.coverImage ? (
                      <div className="space-y-3">
                        <img
                          src={formData.coverImage}
                          alt="课程封面"
                          className="mx-auto h-32 w-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          删除图片
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div className="text-gray-600">
                          <p className="text-sm">点击上传或拖拽图片到此处</p>
                          <p className="text-xs text-gray-500 mt-1">支持 JPG、PNG 格式，建议尺寸 800x600</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // 这里应该上传文件并获取URL，现在只是模拟
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setFormData(prev => ({ ...prev, coverImage: e.target?.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                            input?.click();
                          }}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                        >
                          选择图片
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">学年</label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>
              </div>
            )}
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
              <span>{loading ? '保存中...' : (mode === 'create' ? '创建课程' : '保存更改')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEditModal;
