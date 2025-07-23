/**
 * 添加权限分配模态框组件
 * 
 * 提供权限分配功能，支持选择资源和配置权限
 */

import React, { useState, useEffect } from 'react';

// 资源接口
interface Resource {
  id: string;
  name: string;
  type: 'course' | 'class' | 'department' | 'experiment';
  department: string;
  description?: string;
  metadata?: any;
}

// 权限模板接口
interface PermissionTemplate {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

interface AddPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (assignment: any) => Promise<void>;
  userRole: string;
  userDepartment?: string;
}

const AddPermissionModal: React.FC<AddPermissionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  userRole,
  userDepartment
}) => {
  const [step, setStep] = useState(1); // 1: 选择资源类型, 2: 选择具体资源, 3: 配置权限
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>(userDepartment || '');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);

  // 模拟资源数据
  const mockResources: Resource[] = [
    {
      id: 'course_001',
      name: 'STM32嵌入式开发基础',
      type: 'course',
      department: '计算机学院',
      description: '嵌入式系统开发入门课程'
    },
    {
      id: 'course_002',
      name: 'ARM架构与编程',
      type: 'course',
      department: '计算机学院',
      description: 'ARM处理器架构和汇编编程'
    },
    {
      id: 'course_003',
      name: '数字电路设计',
      type: 'course',
      department: '电子工程学院',
      description: '数字电路基础与设计'
    },
    {
      id: 'class_001',
      name: '计算机2023-1班',
      type: 'class',
      department: '计算机学院',
      description: '计算机科学与技术专业2023级1班'
    },
    {
      id: 'class_002',
      name: '计算机2023-2班',
      type: 'class',
      department: '计算机学院',
      description: '计算机科学与技术专业2023级2班'
    },
    {
      id: 'class_003',
      name: '电子2023-1班',
      type: 'class',
      department: '电子工程学院',
      description: '电子工程专业2023级1班'
    },
    {
      id: 'exp_001',
      name: 'STM32 GPIO实验',
      type: 'experiment',
      department: '计算机学院',
      description: 'GPIO端口控制实验'
    },
    {
      id: 'exp_002',
      name: 'STM32串口通信实验',
      type: 'experiment',
      department: '计算机学院',
      description: '串口通信协议实验'
    }
  ];

  // 权限模板
  const permissionTemplates: Record<string, PermissionTemplate[]> = {
    course: [
      {
        id: 'course_basic',
        name: '基础教学权限',
        permissions: ['view', 'edit_content'],
        description: '查看和编辑课程内容'
      },
      {
        id: 'course_full',
        name: '完整教学权限',
        permissions: ['view', 'edit_content', 'manage_students', 'grade', 'create_assignments'],
        description: '完整的课程管理权限'
      },
      {
        id: 'course_assistant',
        name: '助教权限',
        permissions: ['view', 'grade', 'view_students'],
        description: '助教级别的权限'
      }
    ],
    class: [
      {
        id: 'class_basic',
        name: '基础班级管理',
        permissions: ['view_students', 'view_progress'],
        description: '查看学生信息和学习进度'
      },
      {
        id: 'class_full',
        name: '完整班级管理',
        permissions: ['view_students', 'manage_students', 'assign_courses', 'send_notifications'],
        description: '完整的班级管理权限'
      }
    ],
    experiment: [
      {
        id: 'exp_basic',
        name: '基础实验管理',
        permissions: ['view', 'view_submissions'],
        description: '查看实验和学生提交'
      },
      {
        id: 'exp_full',
        name: '完整实验管理',
        permissions: ['view', 'edit', 'create', 'grade', 'view_submissions', 'manage_resources'],
        description: '完整的实验管理权限'
      }
    ]
  };

  // 重置模态框状态
  const resetModal = () => {
    setStep(1);
    setSelectedCategory('');
    setSelectedResource(null);
    setSelectedPermissions([]);
    setExpiryDate('');
  };

  // 关闭模态框
  const handleClose = () => {
    resetModal();
    onClose();
  };

  // 加载资源
  useEffect(() => {
    if (selectedCategory && selectedDepartment) {
      const filteredResources = mockResources.filter(resource => 
        resource.type === selectedCategory && 
        (selectedDepartment === 'all' || resource.department === selectedDepartment)
      );
      setResources(filteredResources);
    }
  }, [selectedCategory, selectedDepartment]);

  // 处理权限模板选择
  const handleTemplateSelect = (template: PermissionTemplate) => {
    setSelectedPermissions(template.permissions);
  };

  // 处理权限切换
  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  // 提交权限分配
  const handleSubmit = async () => {
    if (!selectedResource || selectedPermissions.length === 0) {
      alert('请选择资源和权限');
      return;
    }

    setLoading(true);
    try {
      const assignment = {
        id: Date.now().toString(),
        name: `${selectedResource.name}管理权限`,
        description: `管理${selectedResource.name}的相关权限`,
        category: selectedCategory,
        resourceType: selectedResource.type,
        resourceId: selectedResource.id,
        resourceName: selectedResource.name,
        department: selectedResource.department,
        permissions: selectedPermissions,
        enabled: true,
        expiryDate: expiryDate || undefined
      };

      await onAdd(assignment);
      handleClose();
    } catch (error) {
      console.error('添加权限分配失败:', error);
      alert('添加权限分配失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取权限名称
  const getPermissionName = (permission: string) => {
    const names: Record<string, string> = {
      view: '查看',
      edit: '编辑',
      edit_content: '编辑内容',
      create: '创建',
      delete: '删除',
      grade: '评分',
      manage_students: '管理学生',
      view_students: '查看学生',
      assign_courses: '分配课程',
      view_submissions: '查看提交',
      create_assignments: '创建作业',
      send_notifications: '发送通知',
      manage_resources: '管理资源',
      view_progress: '查看进度'
    };
    return names[permission] || permission;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 标题和步骤指示器 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">添加权限分配</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 步骤指示器 */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* 步骤1: 选择资源类型和院系 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">选择资源类型和院系</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">资源类型</label>
                    <div className="space-y-2">
                      {[
                        { value: 'course', label: '📚 课程管理', desc: '管理课程内容和学生学习' },
                        { value: 'class', label: '👥 班级管理', desc: '管理班级学生和课程安排' },
                        { value: 'experiment', label: '🔬 实验管理', desc: '管理实验项目和评分' }
                      ].map(option => (
                        <label key={option.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value={option.value}
                            checked={selectedCategory === option.value}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="mt-1 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">院系范围</label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">请选择院系</option>
                      <option value="all">所有院系</option>
                      <option value="计算机学院">计算机学院</option>
                      <option value="电子工程学院">电子工程学院</option>
                      <option value="机械工程学院">机械工程学院</option>
                      <option value="数学学院">数学学院</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      选择用户可以管理的院系范围
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedCategory || !selectedDepartment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  下一步
                </button>
              </div>
            </div>
          )}

          {/* 步骤2: 选择具体资源 */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">选择具体资源</h3>
                <p className="text-sm text-gray-600 mb-4">
                  选择要分配权限的具体{selectedCategory === 'course' ? '课程' : selectedCategory === 'class' ? '班级' : '实验'}
                </p>

                {resources.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-gray-600">暂无可用资源</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.map(resource => (
                      <label key={resource.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="resource"
                          value={resource.id}
                          checked={selectedResource?.id === resource.id}
                          onChange={() => setSelectedResource(resource)}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{resource.name}</div>
                          <div className="text-sm text-gray-600">{resource.description}</div>
                          <div className="text-xs text-gray-500 mt-1">{resource.department}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  上一步
                </button>
                <div className="space-x-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selectedResource}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    下一步
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 步骤3: 配置权限 */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">配置权限</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {selectedCategory === 'course' ? '📚' : selectedCategory === 'class' ? '👥' : '🔬'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{selectedResource?.name}</div>
                      <div className="text-sm text-gray-600">{selectedResource?.department}</div>
                    </div>
                  </div>
                </div>

                {/* 权限模板 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">权限模板</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {permissionTemplates[selectedCategory]?.map(template => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="p-3 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{template.description}</div>
                        <div className="text-xs text-gray-500 mt-2">
                          {template.permissions.length} 个权限
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 具体权限选择 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">具体权限</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {permissionTemplates[selectedCategory]?.[0]?.permissions.concat(
                      permissionTemplates[selectedCategory]?.[1]?.permissions || []
                    ).filter((permission, index, array) => array.indexOf(permission) === index).map(permission => (
                      <label key={permission} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission)}
                          onChange={() => handlePermissionToggle(permission)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{getPermissionName(permission)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 有效期设置 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">有效期（可选）</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    留空表示永久有效
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  上一步
                </button>
                <div className="space-x-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={selectedPermissions.length === 0 || loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <span>{loading ? '添加中...' : '完成添加'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPermissionModal;
