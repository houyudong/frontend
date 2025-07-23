/**
 * 通知模板管理组件
 * 
 * 允许教师和管理员管理通知模板
 */

import React, { useState, useEffect } from 'react';
import { NotificationType, NotificationPriority } from '../types/Notification';

interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

interface NotificationTemplateManagerProps {
  userRole: 'teacher' | 'admin';
  userId: string;
  onTemplateSelect?: (template: NotificationTemplate) => void;
}

const NotificationTemplateManager: React.FC<NotificationTemplateManagerProps> = ({
  userRole,
  userId,
  onTemplateSelect
}) => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 模拟加载模板数据
  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟模板数据
        const mockTemplates: NotificationTemplate[] = userRole === 'admin' ? [
          {
            id: 'template_001',
            name: '系统维护通知',
            type: 'maintenance',
            priority: 'high',
            title: '系统维护通知',
            content: '系统将于{date}进行维护升级，预计维护时间为{duration}，期间可能无法正常访问，请提前做好准备。维护内容包括：{maintenance_items}。如有紧急情况，请联系技术支持。',
            variables: ['date', 'duration', 'maintenance_items'],
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-20T14:30:00Z',
            usageCount: 12
          },
          {
            id: 'template_002',
            name: '新功能发布',
            type: 'system',
            priority: 'normal',
            title: '新功能发布：{feature_name}',
            content: '我们很高兴地宣布新功能{feature_name}已经上线！{description}主要特性包括：{features}。欢迎大家体验使用，如有问题请及时反馈。',
            variables: ['feature_name', 'description', 'features'],
            createdAt: '2024-01-10T09:00:00Z',
            updatedAt: '2024-01-18T16:45:00Z',
            usageCount: 8
          },
          {
            id: 'template_003',
            name: '安全提醒',
            type: 'security',
            priority: 'urgent',
            title: '安全提醒：{security_issue}',
            content: '为了保护您的账户安全，请注意：{security_tips}。如发现以下异常情况，请及时联系管理员：{warning_signs}。',
            variables: ['security_issue', 'security_tips', 'warning_signs'],
            createdAt: '2024-01-12T11:30:00Z',
            updatedAt: '2024-01-19T13:20:00Z',
            usageCount: 5
          }
        ] : [
          {
            id: 'template_004',
            name: '作业提醒',
            type: 'assignment',
            priority: 'normal',
            title: '作业提醒：{assignment_name}',
            content: '亲爱的同学们，作业《{assignment_name}》将于{due_date}截止提交，请及时完成并提交。作业要求：{requirements}。如有疑问，请及时联系老师。',
            variables: ['assignment_name', 'due_date', 'requirements'],
            createdAt: '2024-01-14T08:00:00Z',
            updatedAt: '2024-01-21T10:15:00Z',
            usageCount: 25
          },
          {
            id: 'template_005',
            name: '考试通知',
            type: 'announcement',
            priority: 'high',
            title: '{course_name}考试通知',
            content: '请注意：{course_name}考试将于{exam_date}在{location}举行。考试时间：{exam_time}，考试形式：{exam_type}。请同学们做好准备，按时参加考试。',
            variables: ['course_name', 'exam_date', 'location', 'exam_time', 'exam_type'],
            createdAt: '2024-01-16T15:30:00Z',
            updatedAt: '2024-01-22T09:45:00Z',
            usageCount: 18
          },
          {
            id: 'template_006',
            name: '课程公告',
            type: 'course',
            priority: 'normal',
            title: '{course_name}课程公告',
            content: '{course_name}课程通知：{content}。请同学们注意相关安排，如有疑问请及时联系任课教师。',
            variables: ['course_name', 'content'],
            createdAt: '2024-01-13T12:00:00Z',
            updatedAt: '2024-01-20T16:30:00Z',
            usageCount: 32
          }
        ];

        setTemplates(mockTemplates);
      } catch (error) {
        console.error('加载模板失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, [userId, userRole]);

  // 筛选模板
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 获取类型图标
  const getTypeIcon = (type: NotificationType): string => {
    switch (type) {
      case 'system': return '🔧';
      case 'maintenance': return '🛠️';
      case 'security': return '🔒';
      case 'announcement': return '📢';
      case 'assignment': return '📝';
      case 'course': return '📚';
      case 'experiment': return '🧪';
      default: return '📋';
    }
  };

  // 获取优先级样式
  const getPriorityStyle = (priority: NotificationPriority): string => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 格式化时间
  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString();
  };

  // 删除模板
  const deleteTemplate = (templateId: string) => {
    if (confirm('确定要删除这个模板吗？')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">📝 通知模板</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
            userRole === 'admin' 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          新建模板
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="搜索模板名称、标题或内容..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 模板列表 */}
      <div className="space-y-4">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <span className="text-6xl">📝</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无模板</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? '没有找到符合条件的模板' : '您还没有创建任何通知模板'}
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg ${
                userRole === 'admin' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              创建第一个模板
            </button>
          </div>
        ) : (
          filteredTemplates.map(template => (
            <div
              key={template.id}
              className="group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* 类型图标 */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    userRole === 'admin' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <span className="text-lg">{getTypeIcon(template.type)}</span>
                  </div>

                  {/* 模板信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getPriorityStyle(template.priority)}`}>
                        {template.priority === 'urgent' ? '🔥 紧急' :
                         template.priority === 'high' ? '⚠️ 重要' :
                         template.priority === 'normal' ? '📌 普通' : '📎 一般'}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-700 mb-2">{template.title}</p>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.content}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>使用次数: {template.usageCount}</span>
                      <span>更新时间: {formatTime(template.updatedAt)}</span>
                      <span>变量: {template.variables.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onTemplateSelect?.(template)}
                    className={`p-2 rounded-lg transition-colors ${
                      userRole === 'admin' 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                    title="使用模板"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="编辑模板"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="删除模板"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationTemplateManager;
