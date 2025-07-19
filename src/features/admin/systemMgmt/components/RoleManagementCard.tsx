/**
 * 角色管理卡片组件
 * 
 * 显示和管理用户角色及其权限
 */

import React, { useState } from 'react';
import { UserRole } from '../types/Permission';

interface RoleManagementCardProps {
  roles: UserRole[];
}

const RoleManagementCard: React.FC<RoleManagementCardProps> = ({ roles }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPermissions, setShowPermissions] = useState<string | null>(null);

  // 获取角色图标
  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'admin': return '👑';
      case 'teacher': return '👨‍🏫';
      case 'student': return '👨‍🎓';
      default: return '👤';
    }
  };

  // 获取角色颜色
  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'teacher': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'student': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 获取权限分组
  const getPermissionsByResource = (permissions: any[]) => {
    const grouped = permissions.reduce((acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    }, {} as Record<string, any[]>);
    return grouped;
  };

  // 获取资源名称
  const getResourceName = (resource: string) => {
    const names: Record<string, string> = {
      student: '学生管理',
      course: '课程管理',
      class: '班级管理',
      experiment: '实验管理',
      grade: '成绩管理',
      report: '报告管理',
      system: '系统管理'
    };
    return names[resource] || resource;
  };

  // 获取操作名称
  const getActionName = (action: string) => {
    const names: Record<string, string> = {
      create: '创建',
      read: '查看',
      update: '编辑',
      delete: '删除',
      manage: '管理',
      export: '导出',
      import: '导入'
    };
    return names[action] || action;
  };

  return (
    <div className="space-y-6">
      {/* 角色概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
          >
            {/* 角色头部 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{getRoleIcon(role.name)}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {role.displayName}
                  </h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
              
              {role.isSystem && (
                <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  系统角色
                </div>
              )}
            </div>

            {/* 角色统计 */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">用户数量</span>
                <span className="text-sm font-medium text-gray-900">{role.userCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">权限数量</span>
                <span className="text-sm font-medium text-gray-900">{role.permissions.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">状态</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  role.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {role.isActive ? '活跃' : '禁用'}
                </span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPermissions(showPermissions === role.id ? null : role.id)}
                className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                {showPermissions === role.id ? '隐藏权限' : '查看权限'}
              </button>
              
              {!role.isSystem && (
                <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                  编辑
                </button>
              )}
            </div>

            {/* 权限详情 */}
            {showPermissions === role.id && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">权限详情</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {Object.entries(getPermissionsByResource(role.permissions)).map(([resource, permissions]) => (
                    <div key={resource} className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                        {getResourceName(resource)}
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {permissions.map((permission) => (
                          <span
                            key={permission.id}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {getActionName(permission.action)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 角色管理操作 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">角色管理操作</h3>
            <p className="text-sm text-gray-600 mt-1">创建自定义角色或修改现有角色权限</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>创建角色</span>
          </button>
        </div>

        {/* 快速操作 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900">创建自定义角色</h4>
                <p className="text-xs text-blue-700">根据需要创建特定权限的角色</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-green-900">批量分配权限</h4>
                <p className="text-xs text-green-700">为多个角色批量分配权限</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-purple-900">权限模板</h4>
                <p className="text-xs text-purple-700">使用预设模板快速配置角色</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagementCard;
