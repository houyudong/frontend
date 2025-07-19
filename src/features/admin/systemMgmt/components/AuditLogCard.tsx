/**
 * 审计日志卡片组件
 * 
 * 显示权限变更的审计日志
 */

import React, { useState } from 'react';
import { PermissionAuditLog } from '../types/Permission';

interface AuditLogCardProps {
  logs: PermissionAuditLog[];
}

const AuditLogCard: React.FC<AuditLogCardProps> = ({ logs }) => {
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterTargetType, setFilterTargetType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 过滤日志
  const filteredLogs = logs.filter(log => {
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesTargetType = filterTargetType === 'all' || log.targetType === filterTargetType;
    const matchesSearch = log.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesTargetType && matchesSearch;
  });

  // 获取操作图标
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'grant': return '✅';
      case 'revoke': return '❌';
      case 'modify': return '✏️';
      case 'create': return '➕';
      case 'delete': return '🗑️';
      default: return '🔄';
    }
  };

  // 获取操作颜色
  const getActionColor = (action: string) => {
    switch (action) {
      case 'grant': return 'bg-green-100 text-green-800';
      case 'revoke': return 'bg-red-100 text-red-800';
      case 'modify': return 'bg-blue-100 text-blue-800';
      case 'create': return 'bg-purple-100 text-purple-800';
      case 'delete': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取目标类型图标
  const getTargetTypeIcon = (targetType: string) => {
    switch (targetType) {
      case 'user': return '👤';
      case 'role': return '👥';
      case 'permission': return '🔐';
      default: return '📄';
    }
  };

  // 获取操作名称
  const getActionName = (action: string) => {
    const names: Record<string, string> = {
      grant: '授予',
      revoke: '撤销',
      modify: '修改',
      create: '创建',
      delete: '删除'
    };
    return names[action] || action;
  };

  // 获取目标类型名称
  const getTargetTypeName = (targetType: string) => {
    const names: Record<string, string> = {
      user: '用户',
      role: '角色',
      permission: '权限'
    };
    return names[targetType] || targetType;
  };

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* 搜索和筛选 */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索操作员、目标或详情..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white appearance-none"
          >
            <option value="all">所有操作</option>
            <option value="grant">授予权限</option>
            <option value="revoke">撤销权限</option>
            <option value="modify">修改权限</option>
            <option value="create">创建</option>
            <option value="delete">删除</option>
          </select>
          
          <select
            value={filterTargetType}
            onChange={(e) => setFilterTargetType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white appearance-none"
          >
            <option value="all">所有类型</option>
            <option value="user">用户</option>
            <option value="role">角色</option>
            <option value="permission">权限</option>
          </select>
        </div>
      </div>

      {/* 审计日志列表 */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无审计日志</h3>
          <p className="text-gray-600">没有找到符合条件的审计记录</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* 操作图标 */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{getActionIcon(log.action)}</span>
                    </div>
                  </div>

                  {/* 日志内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                          {getActionName(log.action)}
                        </span>
                        <span className="flex items-center space-x-1 text-sm text-gray-600">
                          <span>{getTargetTypeIcon(log.targetType)}</span>
                          <span>{getTargetTypeName(log.targetType)}</span>
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{formatTime(log.timestamp)}</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        {log.operatorName} 对 "{log.targetName}" 执行了{getActionName(log.action)}操作
                      </p>
                      <p className="text-sm text-gray-600">{log.details}</p>
                    </div>

                    {log.ipAddress && (
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                          </svg>
                          <span>IP: {log.ipAddress}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{new Date(log.timestamp).toLocaleString('zh-CN')}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 日志统计 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">审计统计</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{logs.length}</div>
            <div className="text-sm text-gray-600">总记录数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {logs.filter(log => log.action === 'grant').length}
            </div>
            <div className="text-sm text-gray-600">权限授予</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {logs.filter(log => log.action === 'revoke').length}
            </div>
            <div className="text-sm text-gray-600">权限撤销</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {logs.filter(log => log.action === 'modify').length}
            </div>
            <div className="text-sm text-gray-600">权限修改</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogCard;
