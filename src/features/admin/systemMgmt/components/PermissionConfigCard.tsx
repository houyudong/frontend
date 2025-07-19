/**
 * 权限配置卡片组件
 * 
 * 显示和管理系统权限配置
 */

import React from 'react';
import { PermissionConfig } from '../types/Permission';

interface PermissionConfigCardProps {
  configs: PermissionConfig[];
  onConfigUpdate: (configId: string, newValue: boolean) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categoryFilter: 'all' | 'teacher' | 'student' | 'system';
  onCategoryChange: (category: 'all' | 'teacher' | 'student' | 'system') => void;
}

const PermissionConfigCard: React.FC<PermissionConfigCardProps> = ({
  configs,
  onConfigUpdate,
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange
}) => {
  // 获取分类颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      case 'system': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取资源图标
  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'student': return '👨‍🎓';
      case 'course': return '📚';
      case 'class': return '🏫';
      case 'experiment': return '🔬';
      case 'grade': return '📊';
      case 'report': return '📋';
      case 'system': return '⚙️';
      default: return '📄';
    }
  };

  // 获取操作图标
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return '➕';
      case 'read': return '👁️';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'manage': return '🔧';
      case 'export': return '📤';
      case 'import': return '📥';
      default: return '🔄';
    }
  };

  return (
    <div className="space-y-6">
      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索权限配置..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value as any)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white appearance-none"
          >
            <option value="all">所有分类</option>
            <option value="teacher">教师权限</option>
            <option value="student">学生权限</option>
            <option value="system">系统权限</option>
          </select>
        </div>
      </div>

      {/* 权限配置列表 */}
      {configs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无权限配置</h3>
          <p className="text-gray-600">没有找到符合条件的权限配置项</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {configs.map((config) => (
            <div
              key={config.id}
              className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
            >
              {/* 配置头部 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getResourceIcon(config.resource)}</span>
                    <span className="text-lg">{getActionIcon(config.action)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {config.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {config.description}
                    </p>
                  </div>
                </div>
                
                {/* 权限开关 */}
                <div className="flex items-center">
                  <button
                    onClick={() => onConfigUpdate(config.id, !config.currentValue)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      config.currentValue ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        config.currentValue ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 配置详情 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">分类</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(config.category)}`}>
                    {config.category === 'teacher' ? '教师' : config.category === 'student' ? '学生' : '系统'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">资源类型</span>
                  <span className="text-sm font-medium text-gray-900">
                    {config.resource === 'student' ? '学生管理' :
                     config.resource === 'course' ? '课程管理' :
                     config.resource === 'class' ? '班级管理' :
                     config.resource === 'experiment' ? '实验管理' :
                     config.resource === 'grade' ? '成绩管理' :
                     config.resource === 'report' ? '报告管理' :
                     config.resource === 'system' ? '系统管理' : config.resource}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">操作类型</span>
                  <span className="text-sm font-medium text-gray-900">
                    {config.action === 'create' ? '创建' :
                     config.action === 'read' ? '查看' :
                     config.action === 'update' ? '编辑' :
                     config.action === 'delete' ? '删除' :
                     config.action === 'manage' ? '管理' :
                     config.action === 'export' ? '导出' :
                     config.action === 'import' ? '导入' : config.action}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">影响角色</span>
                  <div className="flex space-x-1">
                    {config.affectedRoles.map((role, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                      >
                        {role === 'teacher' ? '教师' : role === 'student' ? '学生' : role}
                      </span>
                    ))}
                  </div>
                </div>

                {config.isGlobal && (
                  <div className="flex items-center space-x-2 text-sm text-orange-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>全局权限配置</span>
                  </div>
                )}
              </div>

              {/* 配置状态 */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    状态: {config.currentValue ? (
                      <span className="text-green-600 font-medium">已启用</span>
                    ) : (
                      <span className="text-red-600 font-medium">已禁用</span>
                    )}
                  </span>
                  <span>
                    更新: {new Date(config.updatedAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PermissionConfigCard;
