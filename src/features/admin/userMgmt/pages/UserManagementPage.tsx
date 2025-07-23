import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import UserEditModal from '../components/UserEditModal';
import BatchImportModal from '../components/BatchImportModal';
import SystemSyncModal from '../components/SystemSyncModal';
import SecurityLogModal from '../components/SecurityLogModal';
import { User } from '../types/User';
import { mockUsers } from '../data/mockUsers';




/**
 * UserManagementPage - 用户管理页面
 *
 * 管理员查看和管理所有用户信息
 * 支持用户的增删改查和状态管理
 */
const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [error, setError] = useState<string | null>(null);

  // 新增功能状态
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [showSystemSync, setShowSystemSync] = useState(false);
  const [showSecurityLog, setShowSecurityLog] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string>('2024-01-15 14:30:00');
  const [conflictUsers, setConflictUsers] = useState<any[]>([]);
  const [showConflictModal, setShowConflictModal] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    const loadUsers = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
        setLoading(false);
      } catch (err) {
        console.error('加载用户数据失败:', err);
        setError('加载用户数据失败');
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // 教务系统同步功能
  const handleSystemSync = async () => {
    setSyncStatus('syncing');
    try {
      // 模拟API调用教务系统
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 模拟检测到冲突用户
      const mockConflicts = [
        {
          id: 'conflict_1',
          studentId: '20231101',
          name: '张三',
          department: '计算机学院',
          class: '计算机2023-1班',
          status: '休学复学',
          existingUser: users.find(u => u.studentId === '20231101'),
          newData: {
            studentId: '20231101',
            fullName: '张三',
            department: '计算机学院',
            class: '计算机2023-1班',
            email: 'zhangsan@example.com'
          }
        }
      ];

      if (mockConflicts.length > 0) {
        setConflictUsers(mockConflicts);
        setShowConflictModal(true);
      }

      setSyncStatus('success');
      setLastSyncTime(new Date().toLocaleString());
    } catch (error) {
      setSyncStatus('error');
      console.error('同步失败:', error);
    }
  };

  // 批量导入功能
  const handleBatchImport = async (file: File) => {
    try {
      // 模拟Excel文件解析
      const formData = new FormData();
      formData.append('file', file);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 模拟导入结果
      const importResult = {
        total: 150,
        success: 145,
        failed: 5,
        errors: [
          { row: 12, error: '学工号格式错误: 2023110A' },
          { row: 25, error: '邮箱格式错误: invalid-email' },
          { row: 38, error: '必填字段缺失: 姓名' },
          { row: 67, error: '院系代码不存在: CS999' },
          { row: 89, error: '重复学工号: 20231101' }
        ]
      };

      alert(`导入完成！成功: ${importResult.success}, 失败: ${importResult.failed}`);

      // 重新加载用户列表
      loadUsers();
    } catch (error) {
      console.error('批量导入失败:', error);
      alert('批量导入失败，请检查文件格式');
    }
  };

  // 批量操作功能
  const handleBatchOperation = async (operation: 'activate' | 'deactivate' | 'graduate' | 'delete') => {
    if (selectedUsers.length === 0) {
      alert('请先选择要操作的用户');
      return;
    }

    const confirmMessage = {
      activate: '确定要激活选中的用户吗？',
      deactivate: '确定要停用选中的用户吗？',
      graduate: '确定要将选中的学生标记为已毕业吗？',
      delete: '确定要删除选中的用户吗？此操作不可恢复！'
    };

    if (!confirm(confirmMessage[operation])) {
      return;
    }

    try {
      // 模拟批量操作API调用
      await new Promise(resolve => setTimeout(resolve, 1500));

      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (selectedUsers.includes(user.id)) {
            switch (operation) {
              case 'activate':
                return { ...user, status: 'active' as const };
              case 'deactivate':
                return { ...user, status: 'inactive' as const };
              case 'graduate':
                return { ...user, status: 'graduated' as const };
              case 'delete':
                return null;
              default:
                return user;
            }
          }
          return user;
        }).filter(Boolean) as User[]
      );

      setSelectedUsers([]);
      alert(`批量${operation === 'activate' ? '激活' : operation === 'deactivate' ? '停用' : operation === 'graduate' ? '毕业归档' : '删除'}操作完成`);
    } catch (error) {
      console.error('批量操作失败:', error);
      alert('批量操作失败，请重试');
    }
  };

  // 用户选择功能
  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  // 全选功能
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // 过滤用户 - 添加院系筛选
  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.teacherId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  // 重新加载用户数据
  const loadUsers = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
    } catch (err) {
      console.error('加载用户数据失败:', err);
      setError('加载用户数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取角色颜色
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取角色文本
  const getRoleText = (role: string) => {
    switch (role) {
      case 'student': return '学生';
      case 'teacher': return '教师';
      case 'admin': return '管理员';
      default: return '未知';
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 格式化日期
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '从未登录';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '日期格式错误';
    }
  };



  // 编辑用户
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setModalMode('edit');
    setShowUserModal(true);
  };

  // 添加用户
  const handleAddUser = () => {
    setEditingUser(null);
    setModalMode('create');
    setShowUserModal(true);
  };

  // 查看用户详情
  const handleViewUser = (user: User) => {
    navigate(`/admin/users/${user.id}`);
  };

  // 保存用户
  const handleSaveUser = (userData: User) => {
    if (modalMode === 'create') {
      setUsers([...(users || []), userData]);
    } else {
      setUsers((users || []).map(user =>
        user.id === userData.id ? userData : user
      ));
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  // 删除用户
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('确定要删除这个用户吗？')) {
      setUsers((users || []).filter(user => user.id !== userId));
    }
  };

  // 更改用户状态
  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers((users || []).map(user =>
      user.id === userId ? { ...user, status: newStatus as any } : user
    ));
  };

  // 统计数据 - 添加安全检查
  const stats = {
    total: users?.length || 0,
    students: users?.filter(u => u.role === 'student').length || 0,
    teachers: users?.filter(u => u.role === 'teacher').length || 0,
    admins: users?.filter(u => u.role === 'admin').length || 0,
    active: users?.filter(u => u.status === 'active').length || 0
  };

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-red-800">加载错误</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-container">
          {/* 页面标题 - 现代化英雄区域 */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 rounded-2xl mb-8 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

            <div className="relative px-8 py-12">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">用户管理中心</span>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-3">用户管理</h1>
                  <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                    全面管理系统用户，包括学生、教师和管理员账户的创建、编辑和权限控制
                  </p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-white/90">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">系统运行正常</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/90">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-sm">管理 {stats.total} 名用户</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <span className="text-6xl">👥</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">加载用户数据</h3>
                <p className="text-gray-600">正在获取最新的用户信息...</p>
              </div>
            </div>
          ) : (
            <>
              {/* 统计卡片 - 现代化设计 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="relative text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</div>
                    <div className="text-sm font-medium text-gray-600">总用户数</div>
                  </div>
                </div>

                <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="relative text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stats.students}</div>
                    <div className="text-sm font-medium text-gray-600">学生用户</div>
                  </div>
                </div>

                <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="relative text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stats.teachers}</div>
                    <div className="text-sm font-medium text-gray-600">教师用户</div>
                  </div>
                </div>

                <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="relative text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stats.admins}</div>
                    <div className="text-sm font-medium text-gray-600">管理员</div>
                  </div>
                </div>

                <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="relative text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stats.active}</div>
                    <div className="text-sm font-medium text-gray-600">活跃用户</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 功能操作区域 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* 左侧：主要功能按钮 */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowUserModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>新增用户</span>
                </button>

                <button
                  onClick={() => setShowBatchImport(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>批量导入</span>
                </button>

                <button
                  onClick={() => setShowSystemSync(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>教务同步</span>
                  {syncStatus === 'syncing' && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white ml-1"></div>
                  )}
                </button>

                <button
                  onClick={() => setShowSecurityLog(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>安全日志</span>
                </button>
              </div>

              {/* 右侧：同步状态和时间 */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    syncStatus === 'success' ? 'bg-green-500' :
                    syncStatus === 'syncing' ? 'bg-blue-500 animate-pulse' :
                    syncStatus === 'error' ? 'bg-red-500' :
                    'bg-gray-400'
                  }`}></div>
                  <span>
                    {syncStatus === 'success' ? '同步正常' :
                     syncStatus === 'syncing' ? '同步中...' :
                     syncStatus === 'error' ? '同步异常' :
                     '待同步'}
                  </span>
                </div>
                <div className="text-gray-400">|</div>
                <div>上次同步: {lastSyncTime}</div>
              </div>
            </div>

            {/* 批量操作区域 */}
            {selectedUsers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      已选择 {selectedUsers.length} 个用户
                    </span>
                    <button
                      onClick={() => setSelectedUsers([])}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      取消选择
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBatchOperation('activate')}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      批量激活
                    </button>
                    <button
                      onClick={() => handleBatchOperation('deactivate')}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                    >
                      批量停用
                    </button>
                    <button
                      onClick={() => handleBatchOperation('graduate')}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      毕业归档
                    </button>
                    <button
                      onClick={() => handleBatchOperation('delete')}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      批量删除
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 搜索和筛选 - 现代化设计 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">用户管理</h3>
                <p className="text-gray-600 text-sm">搜索、筛选和管理系统用户</p>
              </div>
              <button
                onClick={handleAddUser}
                className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>添加用户</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  搜索用户
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                    placeholder="输入姓名、用户名或邮箱..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  角色筛选
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white appearance-none"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">全部角色</option>
                    <option value="student">👨‍🎓 学生</option>
                    <option value="teacher">👨‍🏫 教师</option>
                    <option value="admin">👨‍💼 管理员</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  状态筛选
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white appearance-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">全部状态</option>
                    <option value="active">🟢 活跃</option>
                    <option value="inactive">🟡 不活跃</option>
                    <option value="suspended">🔴 暂停</option>
                    <option value="graduated">🎓 已毕业</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  院系筛选
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white appearance-none"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="all">全部院系</option>
                    <option value="计算机学院">💻 计算机学院</option>
                    <option value="电子工程学院">⚡ 电子工程学院</option>
                    <option value="机械工程学院">⚙️ 机械工程学院</option>
                    <option value="数学学院">📐 数学学院</option>
                    <option value="物理学院">🔬 物理学院</option>
                    <option value="管理学院">📊 管理学院</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>找到 <span className="font-semibold text-blue-600">{filteredUsers.length}</span> 个用户</span>
                </span>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>清除搜索</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 用户列表 - 现代化表格设计 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">加载用户数据</h3>
                <p className="text-gray-600">正在获取最新的用户信息...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无用户数据</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                    ? '没有找到符合条件的用户，请尝试调整筛选条件'
                    : '系统中还没有用户，点击上方按钮添加第一个用户'}
                </p>
                <button
                  onClick={handleAddUser}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>添加用户</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>用户信息</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>学工号</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>角色</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>院系</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>状态</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>最后登录</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>统计信息</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                          <span>操作</span>
                        </div>
                      </th>
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user, index) => (
                      <tr key={user.id} className="group hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => handleUserSelect(user.id, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {user.fullName.charAt(0)}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{user.fullName}</div>
                              <div className="text-sm text-gray-500">@{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.studentId || user.teacherId || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.role === 'student' ? '学号' : user.role === 'teacher' ? '工号' : '管理员ID'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role === 'admin' ? '👑' : user.role === 'teacher' ? '👨‍🏫' : '🎓'} {getRoleText(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.department || '未分配'}
                          </div>
                          {user.class && (
                            <div className="text-sm text-gray-500">{user.class}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.status}
                            onChange={(e) => handleStatusChange(user.id, e.target.value)}
                            className={`text-xs font-medium rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(user.status)}`}
                          >
                            <option value="active">🟢 活跃</option>
                            <option value="inactive">🟡 不活跃</option>
                            <option value="suspended">🔴 暂停</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(user.lastLogin)}</div>
                          <div className="text-xs text-gray-500">最后活动</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.role === 'student' && (
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span className="text-xs text-gray-600">课程: {user.coursesCompleted || 0}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-xs text-gray-600">实验: {user.experimentsCompleted || 0}</span>
                              </div>
                            </div>
                          )}
                          {user.role === 'teacher' && (
                            <div className="flex items-center space-x-2">
                              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                              <span className="text-xs text-gray-600">管理学生: {user.studentsManaged || 0}</span>
                            </div>
                          )}
                          {user.role === 'admin' && (
                            <div className="flex items-center space-x-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              <span className="text-xs text-gray-600">系统管理员</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
                              title="查看详情"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="编辑用户"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="删除用户"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 用户编辑模态框 */}
        {showUserModal && (
          <UserEditModal
            isOpen={showUserModal}
            onClose={() => {
              setShowUserModal(false);
              setEditingUser(null);
            }}
            onSave={handleSaveUser}
            user={editingUser}
            mode={modalMode}
          />
        )}

        {/* 批量导入模态框 */}
        {showBatchImport && (
          <BatchImportModal
            isOpen={showBatchImport}
            onClose={() => setShowBatchImport(false)}
            onImport={handleBatchImport}
          />
        )}

        {/* 教务系统同步模态框 */}
        {showSystemSync && (
          <SystemSyncModal
            isOpen={showSystemSync}
            onClose={() => setShowSystemSync(false)}
            onSync={handleSystemSync}
            syncStatus={syncStatus}
            lastSyncTime={lastSyncTime}
            conflictUsers={conflictUsers}
            onResolveConflicts={(resolutions) => {
              console.log('处理冲突:', resolutions);
              setConflictUsers([]);
              setShowConflictModal(false);
            }}
          />
        )}

        {/* 安全日志模态框 */}
        {showSecurityLog && (
          <SecurityLogModal
            isOpen={showSecurityLog}
            onClose={() => setShowSecurityLog(false)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default UserManagementPage;
