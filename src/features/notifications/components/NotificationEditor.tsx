/**
 * 通知编辑组件
 * 
 * 支持创建和编辑通知，包括高级目标受众选择
 */

import React, { useState, useEffect } from 'react';
import { BulkNotificationRequest, NotificationType, NotificationPriority } from '../types/Notification';
import TargetAudienceSelector from './TargetAudienceSelector';

interface NotificationEditorProps {
  userRole: 'teacher' | 'admin';
  userId: string;
  editingNotification?: Partial<BulkNotificationRequest>;
  onClose: () => void;
  onSave: (notification: BulkNotificationRequest) => void;
}

const NotificationEditor: React.FC<NotificationEditorProps> = ({
  userRole,
  userId,
  editingNotification,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<BulkNotificationRequest>>({
    type: 'announcement',
    priority: 'normal',
    title: '',
    content: '',
    targetAudience: 'classes',
    scheduledAt: '',
    expiresAt: '',
    ...editingNotification
  });

  const [targetAudienceData, setTargetAudienceData] = useState({
    targetType: 'classes' as 'all_students' | 'departments' | 'classes' | 'specific_students',
    departmentIds: undefined as string[] | undefined,
    classIds: undefined as string[] | undefined,
    studentIds: undefined as string[] | undefined
  });

  const [templates, setTemplates] = useState<Array<{id: string, name: string, content: string}>>([]);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // 加载模板数据
  useEffect(() => {
    const loadTemplates = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const commonTemplates = [
        {
          id: 'template_assignment',
          name: '作业提醒模板',
          content: '亲爱的同学们，作业《{assignment_name}》将于{due_date}截止提交，请及时完成并提交。如有疑问，请及时联系老师。'
        },
        {
          id: 'template_exam',
          name: '考试通知模板',
          content: '请注意：{course_name}考试将于{exam_date}在{location}举行，请同学们做好准备，按时参加考试。'
        }
      ];

      if (userRole === 'admin') {
        setTemplates([
          {
            id: 'template_maintenance',
            name: '系统维护通知',
            content: '系统将于{date}进行维护升级，预计维护时间为{duration}，期间可能无法正常访问，请提前做好准备。'
          },
          {
            id: 'template_feature',
            name: '新功能发布',
            content: '我们很高兴地宣布新功能{feature}已经上线！{description}欢迎大家体验使用。'
          },
          ...commonTemplates
        ]);
      } else {
        setTemplates(commonTemplates);
      }
    };

    loadTemplates();
  }, [userRole]);

  // 获取通知类型选项
  const getNotificationTypes = (): Array<{value: NotificationType, label: string}> => {
    const commonTypes = [
      { value: 'announcement' as NotificationType, label: '📢 课程公告' },
      { value: 'assignment' as NotificationType, label: '📝 作业通知' },
      { value: 'reminder' as NotificationType, label: '⏰ 学习提醒' },
      { value: 'grade' as NotificationType, label: '📊 成绩通知' },
      { value: 'course' as NotificationType, label: '📚 课程通知' },
      { value: 'experiment' as NotificationType, label: '🧪 实验通知' },
      { value: 'deadline' as NotificationType, label: '⚠️ 截止提醒' }
    ];

    if (userRole === 'admin') {
      return [
        { value: 'system' as NotificationType, label: '🔧 系统通知' },
        { value: 'maintenance' as NotificationType, label: '🛠️ 维护通知' },
        { value: 'security' as NotificationType, label: '🔒 安全提醒' },
        ...commonTypes,
        { value: 'discussion' as NotificationType, label: '💬 讨论通知' }
      ];
    }

    return commonTypes;
  };

  // 获取优先级选项
  const getPriorityOptions = (): Array<{value: NotificationPriority, label: string, color: string}> => [
    { value: 'low', label: '低优先级', color: 'text-gray-600' },
    { value: 'normal', label: '普通', color: 'text-blue-600' },
    { value: 'high', label: '重要', color: 'text-orange-600' },
    { value: 'urgent', label: '紧急', color: 'text-red-600' }
  ];

  // 处理模板选择
  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        title: template.name.replace('模板', ''),
        content: template.content
      }));
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      alert('请填写标题和内容');
      return;
    }

    // 验证目标受众
    if (targetAudienceData.targetType === 'departments' && (!targetAudienceData.departmentIds || targetAudienceData.departmentIds.length === 0)) {
      alert('请选择目标院系');
      return;
    }

    if (targetAudienceData.targetType === 'classes' && (!targetAudienceData.classIds || targetAudienceData.classIds.length === 0)) {
      alert('请选择目标班级');
      return;
    }

    if (targetAudienceData.targetType === 'specific_students' && (!targetAudienceData.studentIds || targetAudienceData.studentIds.length === 0)) {
      alert('请选择目标学生');
      return;
    }

    setSaving(true);
    try {
      // 构建完整的通知请求
      const notificationRequest: BulkNotificationRequest = {
        type: formData.type!,
        category: 'academic',
        title: formData.title!,
        content: formData.content!,
        priority: formData.priority!,
        targetAudience: targetAudienceData.targetType === 'all_students' ? 'all_students' :
                       targetAudienceData.targetType === 'departments' ? 'role_based' :
                       targetAudienceData.targetType === 'classes' ? 'class_students' :
                       'specific_users',
        classIds: targetAudienceData.classIds,
        recipientIds: targetAudienceData.studentIds,
        scheduledAt: formData.scheduledAt,
        expiresAt: formData.expiresAt,
        metadata: {
          departmentIds: targetAudienceData.departmentIds
        }
      };

      await onSave(notificationRequest);
      onClose();
    } catch (error) {
      console.error('保存通知失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 步骤导航
  const steps = [
    { id: 1, name: '基本信息', description: '设置通知类型和内容' },
    { id: 2, name: '目标受众', description: '选择通知接收者' },
    { id: 3, name: '发送设置', description: '设置发送时间和选项' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${
          userRole === 'admin' ? 'bg-gradient-to-r from-red-50 to-orange-50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'
        }`}>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingNotification ? '编辑通知' : '创建通知'}
            </h2>
            <p className={`text-sm mt-1 ${
              userRole === 'admin' ? 'text-red-600' : 'text-blue-600'
            }`}>
              {userRole === 'admin' ? '⚠️ 管理员权限 - 请谨慎操作' : '👨‍🏫 教师权限'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 步骤指示器 */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.id 
                    ? userRole === 'admin' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{step.name}</div>
                  <div className="text-xs text-gray-600">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id 
                      ? userRole === 'admin' ? 'bg-red-600' : 'bg-blue-600'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 表单内容 */}
        <div className="p-6">
          {/* 步骤1: 基本信息 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* 通知模板 */}
              {templates.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    使用模板（可选）
                  </label>
                  <select
                    onChange={(e) => e.target.value && handleTemplateSelect(e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                      userRole === 'admin' ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                  >
                    <option value="">选择通知模板...</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 通知类型和优先级 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    通知类型
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as NotificationType }))}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                      userRole === 'admin' ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                    required
                  >
                    {getNotificationTypes().map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    优先级
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as NotificationPriority }))}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                      userRole === 'admin' ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                    required
                  >
                    {getPriorityOptions().map(priority => (
                      <option key={priority.value} value={priority.value} className={priority.color}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 标题和内容 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  通知标题
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                    userRole === 'admin' ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                  placeholder="请输入通知标题"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  通知内容
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                    userRole === 'admin' ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                  placeholder="请输入通知内容（支持模板变量，如 {date}、{course_name} 等）"
                  required
                />
              </div>
            </div>
          )}

          {/* 步骤2: 目标受众 */}
          {currentStep === 2 && (
            <div>
              <TargetAudienceSelector
                userRole={userRole}
                value={targetAudienceData}
                onChange={setTargetAudienceData}
              />
            </div>
          )}

          {/* 步骤3: 发送设置 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* 定时发送和过期时间 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    定时发送（可选）
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                      userRole === 'admin' ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                  />
                  <p className="text-xs text-gray-600 mt-1">留空表示立即发送</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    过期时间（可选）
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                      userRole === 'admin' ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                  />
                  <p className="text-xs text-gray-600 mt-1">通知过期后将自动隐藏</p>
                </div>
              </div>

              {/* 发送预览 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">发送预览</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">通知类型:</span> {getNotificationTypes().find(t => t.value === formData.type)?.label}</div>
                  <div><span className="font-medium">优先级:</span> {getPriorityOptions().find(p => p.value === formData.priority)?.label}</div>
                  <div><span className="font-medium">标题:</span> {formData.title || '未设置'}</div>
                  <div><span className="font-medium">发送时间:</span> {formData.scheduledAt ? new Date(formData.scheduledAt).toLocaleString() : '立即发送'}</div>
                  <div><span className="font-medium">过期时间:</span> {formData.expiresAt ? new Date(formData.expiresAt).toLocaleString() : '永不过期'}</div>
                </div>
              </div>

              {/* 重要提醒 */}
              <div className={`border rounded-lg p-4 ${
                userRole === 'admin'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  userRole === 'admin' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  ⚠️ 发送前请确认
                </h4>
                <ul className={`text-sm space-y-1 ${
                  userRole === 'admin' ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  <li>• 请仔细检查通知内容，确保信息准确无误</li>
                  <li>• 确认目标受众选择正确</li>
                  <li>• 通知发送后无法撤回，请谨慎操作</li>
                  {userRole === 'admin' && <li>• 系统通知将影响大量用户，请特别注意</li>}
                </ul>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  上一步
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    userRole === 'admin'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  下一步
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    saving
                      ? 'bg-gray-400 cursor-not-allowed'
                      : userRole === 'admin'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      发送中...
                    </>
                  ) : (
                    editingNotification ? '保存修改' : '发送通知'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationEditor;
