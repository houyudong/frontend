/**
 * 系统管理页面 - 权限管理
 *
 * 管理员可以在此页面配置用户权限、角色权限等
 * 移除了原有的系统监控功能，专注于权限管理
 */

import React, { useState, useEffect } from 'react';
import MainLayout from '../../../../pages/layout/MainLayout';
import { PermissionConfig, PermissionAuditLog, UserRole } from '../types/Permission';
import { mockPermissionConfigs, mockPermissionAuditLogs, mockUserRoles } from '../data/mockPermissions';
import PermissionConfigCard from '../components/PermissionConfigCard';
import RoleManagementCard from '../components/RoleManagementCard';
import AuditLogCard from '../components/AuditLogCard';

const SystemManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'permissions' | 'roles' | 'audit'>('permissions');
  const [permissionConfigs, setPermissionConfigs] = useState<PermissionConfig[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [auditLogs, setAuditLogs] = useState<PermissionAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'teacher' | 'student' | 'system'>('all');

  // 模拟数据加载
  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPermissionConfigs(mockPermissionConfigs);
        setUserRoles(mockUserRoles);
        setAuditLogs(mockPermissionAuditLogs);
        setLoading(false);
      } catch (error) {
        console.error('加载数据失败:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 过滤权限配置
  const filteredConfigs = permissionConfigs.filter(config => {
    const matchesSearch = config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         config.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || config.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // 处理权限配置更新
  const handleConfigUpdate = (configId: string, newValue: boolean) => {
    setPermissionConfigs(prev =>
      prev.map(config =>
        config.id === configId
          ? { ...config, currentValue: newValue, updatedAt: new Date().toISOString() }
          : config
      )
    );

    // 添加审计日志
    const config = permissionConfigs.find(c => c.id === configId);
    if (config) {
      const newLog: PermissionAuditLog = {
        id: `log_${Date.now()}`,
        action: 'modify',
        targetType: 'permission',
        targetId: configId,
        targetName: config.name,
        operatorId: 'admin_1',
        operatorName: '系统管理员',
        details: `将权限从${config.currentValue ? '启用' : '禁用'}改为${newValue ? '启用' : '禁用'}`,
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.100'
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  // 统计数据
  const stats = {
    totalConfigs: permissionConfigs.length,
    enabledConfigs: permissionConfigs.filter(c => c.currentValue).length,
    totalRoles: userRoles.length,
    activeRoles: userRoles.filter(r => r.isActive).length,
    totalUsers: userRoles.reduce((sum, role) => sum + role.userCount, 0),
    recentChanges: auditLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate > weekAgo;
    }).length
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">加载系统管理数据</h3>
            <p className="text-gray-600">正在获取权限配置信息...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-container">
          {/* 页面标题 - 现代化英雄区域 */}
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl mb-8 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

            <div className="relative px-8 py-12">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">权限管理中心</span>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-3">系统管理</h1>
                  <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                    管理用户权限、角色配置和系统安全设置，确保平台安全有序运行
                  </p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-white/90">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">权限系统正常</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/90">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-sm">管理 {stats.totalUsers} 名用户</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalConfigs}</div>
                <div className="text-sm font-medium text-gray-600">权限配置项</div>
                <div className="text-xs text-green-600 mt-1">启用: {stats.enabledConfigs}</div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalRoles}</div>
                <div className="text-sm font-medium text-gray-600">用户角色</div>
                <div className="text-xs text-green-600 mt-1">活跃: {stats.activeRoles}</div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalUsers}</div>
                <div className="text-sm font-medium text-gray-600">系统用户</div>
                <div className="text-xs text-blue-600 mt-1">受权限管理</div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.recentChanges}</div>
                <div className="text-sm font-medium text-gray-600">近期变更</div>
                <div className="text-xs text-gray-500 mt-1">最近7天</div>
              </div>
            </div>
          </div>

          {/* 标签页导航 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {[
                  { id: 'permissions', name: '权限配置', icon: '🔐' },
                  { id: 'roles', name: '角色管理', icon: '👥' },
                  { id: 'audit', name: '审计日志', icon: '📋' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* 标签页内容 */}
            <div className="p-6">
              {activeTab === 'permissions' && (
                <PermissionConfigCard
                  configs={filteredConfigs}
                  onConfigUpdate={handleConfigUpdate}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  categoryFilter={categoryFilter}
                  onCategoryChange={setCategoryFilter}
                />
              )}

              {activeTab === 'roles' && (
                <RoleManagementCard roles={userRoles} />
              )}

              {activeTab === 'audit' && (
                <AuditLogCard logs={auditLogs} />
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SystemManagementPage;
