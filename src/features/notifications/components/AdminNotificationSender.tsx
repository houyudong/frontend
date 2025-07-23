/**
 * 管理员通知发送组件
 * 
 * 允许管理员向所有用户发送系统通知，具有最高权限
 */

import React, { useState, useEffect } from 'react';
import { BulkNotificationRequest, NotificationType, NotificationPriority } from '../types/Notification';

interface AdminNotificationSenderProps {
  adminId: string;
  onClose: () => void;
  onSent: () => void;
}

const AdminNotificationSender: React.FC<AdminNotificationSenderProps> = ({
  adminId,
  onClose,
  onSent
}) => {
  const [formData, setFormData] = useState<Partial<BulkNotificationRequest>>({
    type: 'system',
    priority: 'normal',
    title: '',
    content: '',
    targetAudience: 'all_users',
    scheduledAt: '',
    expiresAt: ''
  });
  
  const [sending, setSending] = useState(false);
  const [templates, setTemplates] = useState<Array<{id: string, name: string, content: string}>>([]);

  // 模拟加载通知模板
  useEffect(() => {
    const loadTemplates = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTemplates([
        {
          id: 'template_001',
          name: '系统维护通知',
          content: '系统将于{date}进行维护升级，预计维护时间为{duration}，期间可能无法正常访问，请提前做好准备。'
        },
        {
          id: 'template_002', 
          name: '新功能发布',
          content: '我们很高兴地宣布新功能{feature}已经上线！{description}欢迎大家体验使用。'
        },
        {
          id: 'template_003',
          name: '安全提醒',
          content: '为了保护您的账户安全，请注意：{security_tips}如发现异常情况，请及时联系管理员。'
        }
      ]);
    };

    loadTemplates();
  }, [adminId]);

  // 获取通知类型选项（管理员可用的所有类型）
  const getNotificationTypes = (): Array<{value: NotificationType, label: string}> => [
    { value: 'system', label: '🔧 系统通知' },
    { value: 'announcement', label: '📢 平台公告' },
    { value: 'maintenance', label: '🛠️ 维护通知' },
    { value: 'security', label: '🔒 安全提醒' },
    { value: 'reminder', label: '⏰ 重要提醒' },
    { value: 'grade', label: '📊 成绩通知' },
    { value: 'course', label: '📚 课程通知' },
    { value: 'assignment', label: '📝 作业通知' },
    { value: 'experiment', label: '🧪 实验通知' },
    { value: 'discussion', label: '💬 讨论通知' },
    { value: 'deadline', label: '⚠️ 截止提醒' }
  ];

  // 获取优先级选项
  const getPriorityOptions = (): Array<{value: NotificationPriority, label: string, color: string}> => [
    { value: 'low', label: '低优先级', color: 'text-gray-600' },
    { value: 'normal', label: '普通', color: 'text-blue-600' },
    { value: 'high', label: '重要', color: 'text-orange-600' },
    { value: 'urgent', label: '紧急', color: 'text-red-600' }
  ];

  // 获取目标受众选项（管理员具有最高权限）
  const getTargetAudienceOptions = () => [
    { value: 'all_users', label: '所有用户', description: '发送给平台所有用户（学生、教师、管理员）' },
    { value: 'all_students', label: '所有学生', description: '发送给平台所有学生用户' },
    { value: 'all_teachers', label: '所有教师', description: '发送给平台所有教师用户' },
    { value: 'role_based', label: '按角色发送', description: '根据用户角色精确发送' }
  ];

  // 处理模板选择
  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        title: template.name,
        content: template.content
      }));
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert('请填写标题和内容');
      return;
    }

    // 确认发送（管理员通知影响范围大）
    const confirmMessage = `确定要向"${getTargetAudienceOptions().find(opt => opt.value === formData.targetAudience)?.label}"发送通知吗？`;
    if (!confirm(confirmMessage)) {
      return;
    }

    setSending(true);
    try {
      // 模拟发送通知
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('管理员发送通知:', formData);
      alert('系统通知发送成功！');
      onSent();
      onClose();
    } catch (error) {
      console.error('发送通知失败:', error);
      alert('发送失败，请重试');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">发送系统通知</h2>
            <p className="text-sm text-red-600 mt-1">⚠️ 管理员权限 - 请谨慎操作</p>
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

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 通知模板 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              使用模板（可选）
            </label>
            <select
              onChange={(e) => e.target.value && handleTemplateSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">选择通知模板...</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* 通知类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              通知类型
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as NotificationType }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="请输入通知内容（支持模板变量，如 {date}、{feature} 等）"
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
                    className="mt-1 text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 定时发送和过期时间 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                定时发送（可选）
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* 高级选项 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">⚠️ 重要提醒</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 系统通知将发送给大量用户，请确保内容准确无误</li>
              <li>• 紧急通知会立即推送，请谨慎使用</li>
              <li>• 维护通知建议提前24小时发送</li>
              <li>• 发送后无法撤回，请仔细检查</li>
            </ul>
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
              className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                sending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  发送中...
                </>
              ) : (
                '确认发送系统通知'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNotificationSender;
