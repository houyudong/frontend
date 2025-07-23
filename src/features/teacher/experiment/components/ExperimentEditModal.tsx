/**
 * 实验编辑模态框组件
 * 
 * 支持创建和编辑实验
 */

import React, { useState, useEffect } from 'react';
import { Experiment, ExperimentFormData } from '../types/Experiment';

interface ExperimentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (experimentData: ExperimentFormData) => Promise<void>;
  experiment?: Experiment;
  mode: 'create' | 'edit';
}

const ExperimentEditModal: React.FC<ExperimentEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  experiment,
  mode
}) => {
  const [formData, setFormData] = useState<ExperimentFormData>({
    name: '',
    code: '',
    description: '',
    courseId: '',
    category: '基础实验',
    difficulty: 'beginner',
    type: 'individual',
    duration: 90,
    maxScore: 100,
    objectives: [''],
    prerequisites: [],
    steps: [],
    equipment: [],
    criteria: [],
    tags: [],
    coverImage: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentTab, setCurrentTab] = useState<'basic' | 'content' | 'settings'>('basic');

  // 模拟课程数据
  const mockCourses = [
    { id: 'course_001', name: 'STM32嵌入式开发基础' },
    { id: 'course_002', name: 'ARM架构与编程' },
    { id: 'course_003', name: 'C语言程序设计' }
  ];

  // 初始化表单数据
  useEffect(() => {
    if (experiment && mode === 'edit') {
      setFormData({
        name: experiment.name,
        code: experiment.code,
        description: experiment.description,
        courseId: experiment.courseId,
        category: experiment.category,
        difficulty: experiment.difficulty,
        type: experiment.type,
        duration: experiment.duration,
        maxScore: experiment.maxScore,
        objectives: experiment.objectives,
        prerequisites: experiment.prerequisites,
        steps: experiment.steps.map(step => ({
          order: step.order,
          title: step.title,
          description: step.description,
          code: step.code,
          expectedOutput: step.expectedOutput,
          tips: step.tips,
          duration: step.duration
        })),
        equipment: experiment.equipment.map(eq => ({
          name: eq.name,
          type: eq.type,
          required: eq.required,
          description: eq.description,
          specifications: eq.specifications
        })),
        criteria: experiment.criteria.map(cri => ({
          name: cri.name,
          description: cri.description,
          maxScore: cri.maxScore,
          weight: cri.weight
        })),
        tags: experiment.tags,
        coverImage: experiment.coverImage
      });
    } else {
      // 重置表单
      setFormData({
        name: '',
        code: '',
        description: '',
        courseId: '',
        category: '基础实验',
        difficulty: 'beginner',
        type: 'individual',
        duration: 90,
        maxScore: 100,
        objectives: [''],
        prerequisites: [],
        steps: [],
        equipment: [],
        criteria: [],
        tags: [],
        coverImage: ''
      });
    }
    setErrors({});
    setCurrentTab('basic');
  }, [experiment, mode, isOpen]);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '实验名称不能为空';
    }

    if (!formData.code.trim()) {
      newErrors.code = '实验代码不能为空';
    }

    if (!formData.description.trim()) {
      newErrors.description = '实验描述不能为空';
    }

    if (!formData.courseId) {
      newErrors.courseId = '请选择所属课程';
    }

    if (formData.duration <= 0) {
      newErrors.duration = '实验时长必须大于0';
    }

    if (formData.maxScore <= 0) {
      newErrors.maxScore = '最高分数必须大于0';
    }

    if (formData.objectives.filter(obj => obj.trim()).length === 0) {
      newErrors.objectives = '至少需要一个实验目标';
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
      console.error('保存实验失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 添加实验目标
  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  // 删除实验目标
  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  // 更新实验目标
  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  // 添加实验步骤
  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, {
        order: prev.steps.length + 1,
        title: '',
        description: '',
        duration: 30
      }]
    }));
  };

  // 删除实验步骤
  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index).map((step, i) => ({
        ...step,
        order: i + 1
      }))
    }));
  };

  // 更新实验步骤
  const updateStep = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  // 添加设备要求
  const addEquipment = () => {
    setFormData(prev => ({
      ...prev,
      equipment: [...prev.equipment, {
        name: '',
        type: 'hardware',
        required: true,
        description: ''
      }]
    }));
  };

  // 删除设备要求
  const removeEquipment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  // 更新设备要求
  const updateEquipment = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.map((eq, i) => 
        i === index ? { ...eq, [field]: value } : eq
      )
    }));
  };

  // 添加评分标准
  const addCriteria = () => {
    setFormData(prev => ({
      ...prev,
      criteria: [...prev.criteria, {
        name: '',
        description: '',
        maxScore: 20,
        weight: 20
      }]
    }));
  };

  // 删除评分标准
  const removeCriteria = (index: number) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index)
    }));
  };

  // 更新评分标准
  const updateCriteria = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria.map((cri, i) => 
        i === index ? { ...cri, [field]: value } : cri
      )
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
              {mode === 'create' ? '新建实验' : '编辑实验'}
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
                { key: 'content', label: '实验内容' },
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
                      实验名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="请输入实验名称"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      实验代码 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.code ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="如: EXP001"
                    />
                    {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    实验描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="请输入实验描述"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      所属课程 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.courseId}
                      onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">实验类别</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="基础实验">基础实验</option>
                      <option value="综合实验">综合实验</option>
                      <option value="设计实验">设计实验</option>
                      <option value="创新实验">创新实验</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">难度等级</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="beginner">初级</option>
                      <option value="intermediate">中级</option>
                      <option value="advanced">高级</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">实验类型</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="individual">个人实验</option>
                      <option value="group">小组实验</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      预计时长(分钟) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.duration ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      最高分数 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxScore}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxScore: parseInt(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.maxScore ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.maxScore && <p className="text-red-500 text-sm mt-1">{errors.maxScore}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* 实验内容标签页 */}
            {currentTab === 'content' && (
              <div className="space-y-6">
                {/* 实验目标 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    实验目标 <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {formData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={objective}
                          onChange={(e) => updateObjective(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`实验目标 ${index + 1}`}
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
                      添加实验目标
                    </button>
                  </div>
                  {errors.objectives && <p className="text-red-500 text-sm mt-1">{errors.objectives}</p>}
                </div>

                {/* 实验步骤 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">实验步骤</label>
                  <div className="space-y-4">
                    {formData.steps.map((step, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">步骤 {step.order}</h4>
                          <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">步骤标题</label>
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => updateStep(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="步骤标题"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">预计时长(分钟)</label>
                            <input
                              type="number"
                              min="1"
                              value={step.duration}
                              onChange={(e) => updateStep(index, 'duration', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="block text-sm text-gray-600 mb-1">步骤描述</label>
                          <textarea
                            value={step.description}
                            onChange={(e) => updateStep(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="详细描述这个步骤的操作内容"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="block text-sm text-gray-600 mb-1">示例代码(可选)</label>
                          <textarea
                            value={step.code || ''}
                            onChange={(e) => updateStep(index, 'code', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            placeholder="相关的代码示例"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-1">预期输出(可选)</label>
                          <input
                            type="text"
                            value={step.expectedOutput || ''}
                            onChange={(e) => updateStep(index, 'expectedOutput', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="这个步骤的预期结果"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addStep}
                      className="inline-flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      添加实验步骤
                    </button>
                  </div>
                </div>

                {/* 设备要求 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">设备要求</label>
                  <div className="space-y-3">
                    {formData.equipment.map((eq, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                          <input
                            type="text"
                            value={eq.name}
                            onChange={(e) => updateEquipment(index, 'name', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="设备名称"
                          />
                          <select
                            value={eq.type}
                            onChange={(e) => updateEquipment(index, 'type', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="hardware">硬件</option>
                            <option value="software">软件</option>
                            <option value="tool">工具</option>
                          </select>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={eq.required}
                              onChange={(e) => updateEquipment(index, 'required', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                            />
                            <span className="text-sm text-gray-600">必需</span>
                          </div>
                          <input
                            type="text"
                            value={eq.description}
                            onChange={(e) => updateEquipment(index, 'description', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="设备描述"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEquipment(index)}
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
                      onClick={addEquipment}
                      className="inline-flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      添加设备要求
                    </button>
                  </div>
                </div>

                {/* 评分标准 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">评分标准</label>
                  <div className="space-y-3">
                    {formData.criteria.map((cri, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                          <input
                            type="text"
                            value={cri.name}
                            onChange={(e) => updateCriteria(index, 'name', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="评分项目"
                          />
                          <input
                            type="text"
                            value={cri.description}
                            onChange={(e) => updateCriteria(index, 'description', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="评分描述"
                          />
                          <input
                            type="number"
                            min="1"
                            value={cri.maxScore}
                            onChange={(e) => updateCriteria(index, 'maxScore', parseInt(e.target.value) || 0)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="最高分"
                          />
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={cri.weight}
                            onChange={(e) => updateCriteria(index, 'weight', parseInt(e.target.value) || 0)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="权重%"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCriteria(index)}
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
                      onClick={addCriteria}
                      className="inline-flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      添加评分标准
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 高级设置标签页 */}
            {currentTab === 'settings' && (
              <div className="space-y-6">
                {/* 先修要求 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">先修要求</label>
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
                          placeholder="先修要求"
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
                      添加先修要求
                    </button>
                  </div>
                </div>

                {/* 实验标签 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">实验标签</label>
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

                {/* 封面图片 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">封面图片</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {formData.coverImage ? (
                      <div className="space-y-3">
                        <img
                          src={formData.coverImage}
                          alt="实验封面"
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
              <span>{loading ? '保存中...' : (mode === 'create' ? '创建实验' : '保存更改')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExperimentEditModal;
