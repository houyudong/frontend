/**
 * 用户权限管理组件
 * 
 * 提供完整的用户权限管理功能，包括权限查看、编辑、批量操作等
 */

import React, { useState, useEffect } from 'react';

// 权限接口
interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'course' | 'student' | 'experiment' | 'report';
  resource: string;
  action: string;
  enabled: boolean;
  isDefault?: boolean;
  level: 'basic' | 'advanced' | 'admin';
}

// 权限组
interface PermissionGroup {
  category: string;
  name: string;
  description: string;
  permissions: Permission[];
}

interface UserPermissionManagerProps {
  userId: string;
  userRole: 'student' | 'teacher' | 'admin';
  onPermissionChange?: (permissions: Permission[]) => void;
}

// 完整的权限配置
const allPermissions: Record<string, Permission[]> = {
  student: [
    {
      id: 'student_course_view',
      name: '查看课程',
      description: '可以查看和学习分配的课程内容',
      category: 'course',
      resource: 'course',
      action: 'view',
      enabled: true,
      isDefault: true,
      level: 'basic'
    },
    {
      id: 'student_course_download',
      name: '下载课程资料',
      description: '可以下载课程相关的学习资料',
      category: 'course',
      resource: 'course',
      action: 'download',
      enabled: true,
      isDefault: true,
      level: 'basic'
    },
    {
      id: 'student_experiment_submit',
      name: '提交实验',
      description: '可以提交实验作业和报告',
      category: 'experiment',
      resource: 'experiment',
      action: 'submit',
      enabled: true,
      isDefault: true,
      level: 'basic'
    },
    {
      id: 'student_experiment_resubmit',
      name: '重新提交实验',
      description: '可以重新提交已评分的实验',
      category: 'experiment',
      resource: 'experiment',
      action: 'resubmit',
      enabled: false,
      isDefault: false,
      level: 'advanced'
    },
    {
      id: 'student_profile_edit',
      name: '编辑个人资料',
      description: '可以修改个人基本信息',
      category: 'system',
      resource: 'profile',
      action: 'edit',
      enabled: true,
      isDefault: true,
      level: 'basic'
    },
    {
      id: 'student_forum_post',
      name: '论坛发帖',
      description: '可以在学习论坛发布帖子和回复',
      category: 'system',
      resource: 'forum',
      action: 'post',
      enabled: false,
      isDefault: false,
      level: 'advanced'
    },
    {
      id: 'student_data_export',
      name: '导出学习数据',
      description: '可以导出个人学习记录和成绩',
      category: 'report',
      resource: 'data',
      action: 'export',
      enabled: false,
      isDefault: false,
      level: 'advanced'
    }
  ],
  teacher: [
    {
      id: 'teacher_student_view',
      name: '查看学生信息',
      description: '可以查看班级学生的基本信息',
      category: 'student',
      resource: 'student',
      action: 'view',
      enabled: true,
      isDefault: true,
      level: 'basic'
    },
    {
      id: 'teacher_student_manage',
      name: '管理学生',
      description: '可以编辑学生信息和管理班级',
      category: 'student',
      resource: 'student',
      action: 'manage',
      enabled: true,
      isDefault: true,
      level: 'basic'
    },
    {
      id: 'teacher_course_create',
      name: '创建课程',
      description: '可以创建和编辑课程内容',
      category: 'course',
      resource: 'course',
      action: 'create',
      enabled: true,
      isDefault: true,
      level: 'basic'
    },
    {
      id: 'teacher_course_delete',
      name: '删除课程',
      description: '可以删除自己创建的课程',
      category: 'course',
      resource: 'course',
      action: 'delete',
      enabled: false,
      isDefault: false,
      level: 'advanced'
    },
    {
      id: 'teacher_experiment_grade',
      name: '实验评分',
      description: '可以对学生实验进行评分',
      category: 'experiment',
      resource: 'experiment',
      action: 'grade',
      enabled: true,
      isDefault: true,
      level: 'basic'
    },
    {
      id: 'teacher_experiment_create',
      name: '创建实验',
      description: '可以创建新的实验项目',
      category: 'experiment',
      resource: 'experiment',
      action: 'create',
      enabled: true,
      isDefault: true,
      level: 'basic'
    },
    {
      id: 'teacher_report_generate',
      name: '生成报告',
      description: '可以生成教学分析报告',
      category: 'report',
      resource: 'report',
      action: 'generate',
      enabled: true,
      isDefault: true,
      level: 'basic'
    },
    {
      id: 'teacher_system_config',
      name: '系统配置',
      description: '可以修改部分系统配置',
      category: 'system',
      resource: 'system',
      action: 'config',
      enabled: false,
      isDefault: false,
      level: 'admin'
    }
  ],
  admin: [
    {
      id: 'admin_user_create',
      name: '创建用户',
      description: '可以创建新的用户账号',
      category: 'system',
      resource: 'user',
      action: 'create',
      enabled: true,
      isDefault: true,
      level: 'basic'
    },
    {
      id: 'admin_user_manage',
      name: '管理用户',
      description: '可以编辑、删除用户账号',
      category: 'system',
      resource: 'user',
      action: 'manage',
      enabled: true,
      isDefault: true,
      level: 'basic'
    },
    {
      id: 'admin_user_impersonate',
      name: '模拟用户',
      description: '可以以其他用户身份登录系统',
      category: 'system',
      resource: 'user',
      action: 'impersonate',
      enabled: false,
      isDefault: false,
      level: 'admin'
    },
    {
      id: 'admin_system_config',
      name: '系统配置',
      description: '可以修改所有系统配置',
      category: 'system',
      resource: 'system',
      action: 'config',
      enabled: true,
      isDefault: true,
      level: 'basic'
    },
    {
      id: 'admin_data_export',
      name: '数据导出',
      description: '可以导出系统数据和报告',
      category: 'report',
      resource: 'data',
      action: 'export',
      enabled: true,
      isDefault: true,
      level: 'basic'
    },
    {
      id: 'admin_backup_restore',
      name: '备份恢复',
      description: '可以进行系统备份和恢复操作',
      category: 'system',
      resource: 'backup',
      action: 'manage',
      enabled: true,
      isDefault: true,
      level: 'advanced'
    },
    {
      id: 'admin_audit_log',
      name: '审计日志',
      description: '可以查看系统审计日志',
      category: 'system',
      resource: 'audit',
      action: 'view',
      enabled: true,
      isDefault: true,
      level: 'advanced'
    },
    {
      id: 'admin_maintenance_mode',
      name: '维护模式',
      description: '可以启用/禁用系统维护模式',
      category: 'system',
      resource: 'maintenance',
      action: 'manage',
      enabled: false,
      isDefault: false,
      level: 'admin'
    }
  ]
};

const UserPermissionManager: React.FC<UserPermissionManagerProps> = ({
  userId,
  userRole,
  onPermissionChange
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 加载用户权限
  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true);
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500));
        const rolePermissions = allPermissions[userRole] || [];
        setPermissions(rolePermissions);
      } catch (error) {
        console.error('加载权限失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [userId, userRole]);

  // 权限切换
  const handlePermissionToggle = async (permissionId: string, enabled: boolean) => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedPermissions = permissions.map(permission =>
        permission.id === permissionId
          ? { ...permission, enabled }
          : permission
      );
      
      setPermissions(updatedPermissions);
      onPermissionChange?.(updatedPermissions);
    } catch (error) {
      console.error('更新权限失败:', error);
    } finally {
      setSaving(false);
    }
  };

  // 批量操作
  const handleBatchOperation = async (operation: 'enable_all' | 'disable_all' | 'reset_default' | 'enable_basic') => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let updatedPermissions: Permission[];
      
      switch (operation) {
        case 'enable_all':
          updatedPermissions = permissions.map(p => ({ ...p, enabled: true }));
          break;
        case 'disable_all':
          updatedPermissions = permissions.map(p => ({ ...p, enabled: false }));
          break;
        case 'reset_default':
          updatedPermissions = allPermissions[userRole].map(p => ({ ...p }));
          break;
        case 'enable_basic':
          updatedPermissions = permissions.map(p => ({ 
            ...p, 
            enabled: p.level === 'basic' ? true : p.enabled 
          }));
          break;
        default:
          updatedPermissions = permissions;
      }
      
      setPermissions(updatedPermissions);
      onPermissionChange?.(updatedPermissions);
    } catch (error) {
      console.error('批量操作失败:', error);
    } finally {
      setSaving(false);
    }
  };

  // 过滤权限
  const filteredPermissions = permissions.filter(permission => {
    const matchesCategory = filterCategory === 'all' || permission.category === filterCategory;
    const matchesLevel = filterLevel === 'all' || permission.level === filterLevel;
    const matchesSearch = searchTerm === '' || 
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesSearch;
  });

  // 按分类分组权限
  const groupedPermissions = filteredPermissions.reduce((groups, permission) => {
    const category = permission.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

  // 获取分类名称
  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      system: '系统管理',
      course: '课程管理',
      student: '学生管理',
      experiment: '实验管理',
      report: '报告管理'
    };
    return names[category] || category;
  };

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      system: '⚙️',
      course: '📚',
      student: '👨‍🎓',
      experiment: '🔬',
      report: '📊'
    };
    return icons[category] || '📄';
  };

  // 获取权限级别颜色
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      basic: 'bg-green-100 text-green-800',
      advanced: 'bg-blue-100 text-blue-800',
      admin: 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  // 获取权限级别名称
  const getLevelName = (level: string) => {
    const names: Record<string, string> = {
      basic: '基础',
      advanced: '高级',
      admin: '管理员'
    };
    return names[level] || level;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">加载权限信息中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 权限管理头部 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">权限管理</h3>
            <p className="text-sm text-gray-600 mt-1">
              管理用户的系统权限和功能访问控制
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleBatchOperation('enable_basic')}
              disabled={saving}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              启用基础权限
            </button>
            <button
              onClick={() => handleBatchOperation('enable_all')}
              disabled={saving}
              className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              全部启用
            </button>
            <button
              onClick={() => handleBatchOperation('disable_all')}
              disabled={saving}
              className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              全部禁用
            </button>
            <button
              onClick={() => handleBatchOperation('reset_default')}
              disabled={saving}
              className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              重置默认
            </button>
          </div>
        </div>

        {/* 权限统计 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {permissions.length}
            </div>
            <div className="text-sm text-blue-600">总权限数</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {permissions.filter(p => p.enabled).length}
            </div>
            <div className="text-sm text-green-600">已启用</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">
              {permissions.filter(p => !p.enabled).length}
            </div>
            <div className="text-sm text-red-600">已禁用</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {permissions.filter(p => p.isDefault).length}
            </div>
            <div className="text-sm text-yellow-600">默认权限</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {userRole === 'admin' ? '管理员' : userRole === 'teacher' ? '教师' : '学生'}
            </div>
            <div className="text-sm text-purple-600">用户角色</div>
          </div>
        </div>

        {/* 筛选和搜索 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有分类</option>
              <option value="system">系统管理</option>
              <option value="course">课程管理</option>
              <option value="student">学生管理</option>
              <option value="experiment">实验管理</option>
              <option value="report">报告管理</option>
            </select>
            
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有级别</option>
              <option value="basic">基础</option>
              <option value="advanced">高级</option>
              <option value="admin">管理员</option>
            </select>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="搜索权限..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 保存状态提示 */}
      {saving && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm text-blue-600">正在保存权限设置...</span>
          </div>
        </div>
      )}

      {/* 权限列表 - 按分类分组 */}
      <div className="space-y-6">
        {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
          <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {getCategoryName(category)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {categoryPermissions.length} 个权限，
                    {categoryPermissions.filter(p => p.enabled).length} 个已启用
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {categoryPermissions.map(permission => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          permission.enabled ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="font-medium text-gray-900">{permission.name}</h5>
                            {permission.isDefault && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                默认
                              </span>
                            )}
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(permission.level)}`}>
                              {getLevelName(permission.level)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500">
                              资源: {permission.resource}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              操作: {permission.action}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        onClick={() => handlePermissionToggle(permission.id, !permission.enabled)}
                        disabled={saving}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                          permission.enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                            permission.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {filteredPermissions.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到权限</h3>
          <p className="text-gray-600">
            请尝试调整筛选条件或搜索关键词
          </p>
        </div>
      )}
    </div>
  );
};

export default UserPermissionManager;
