/**
 * 用户权限分配页面
 * 
 * 提供详细的权限分配功能，支持按院系、课程、班级等维度进行权限分配
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import AddPermissionModal from '../components/AddPermissionModal';
import { User } from '../types/User';
import { mockUsers } from '../data/mockUsers';

// 权限分配接口
interface PermissionAssignment {
  id: string;
  name: string;
  description: string;
  category: 'course' | 'class' | 'student' | 'experiment' | 'system';
  resourceType: string;
  resourceId: string;
  resourceName: string;
  department?: string;
  permissions: string[];
  enabled: boolean;
  expiryDate?: string;
}

// 资源接口
interface Resource {
  id: string;
  name: string;
  type: 'course' | 'class' | 'department' | 'experiment';
  department: string;
  description?: string;
  metadata?: any;
}

const UserPermissionAssignmentPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assignments, setAssignments] = useState<PermissionAssignment[]>([]);
  const [availableResources, setAvailableResources] = useState<Resource[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // 模拟用户数据
  const mockUserDetail = mockUsers.find(u => u.id === userId) || mockUsers[0];

  // 模拟权限分配数据
  const mockAssignments: PermissionAssignment[] = [
    {
      id: '1',
      name: '计算机基础课程管理',
      description: '管理计算机基础相关课程的教学内容和学生进度',
      category: 'course',
      resourceType: 'course',
      resourceId: 'course_001',
      resourceName: 'STM32嵌入式开发基础',
      department: '计算机学院',
      permissions: ['view', 'edit', 'grade', 'manage_students'],
      enabled: true,
      expiryDate: '2024-12-31'
    },
    {
      id: '2',
      name: '计算机2023-1班管理',
      description: '管理计算机2023-1班的学生信息和学习进度',
      category: 'class',
      resourceType: 'class',
      resourceId: 'class_001',
      resourceName: '计算机2023-1班',
      department: '计算机学院',
      permissions: ['view_students', 'manage_students', 'assign_courses'],
      enabled: true
    },
    {
      id: '3',
      name: '嵌入式实验管理',
      description: '管理嵌入式系统相关实验的设计和评分',
      category: 'experiment',
      resourceType: 'experiment',
      resourceId: 'exp_001',
      resourceName: 'STM32 GPIO实验',
      department: '计算机学院',
      permissions: ['create', 'edit', 'grade', 'view_submissions'],
      enabled: false
    }
  ];

  // 模拟可用资源数据
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

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(mockUserDetail);
        setAssignments(mockAssignments);
        setAvailableResources(mockResources);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadData();
    }
  }, [userId]);

  // 权限切换
  const handlePermissionToggle = async (assignmentId: string, enabled: boolean) => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAssignments(prev => 
        prev.map(assignment => 
          assignment.id === assignmentId 
            ? { ...assignment, enabled }
            : assignment
        )
      );
    } catch (error) {
      console.error('更新权限失败:', error);
    } finally {
      setSaving(false);
    }
  };

  // 删除权限分配
  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm('确定要删除这个权限分配吗？')) {
      return;
    }

    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
    } catch (error) {
      console.error('删除权限分配失败:', error);
    } finally {
      setSaving(false);
    }
  };

  // 添加权限分配
  const handleAddAssignment = async (assignment: any) => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAssignments(prev => [...prev, assignment]);
    } catch (error) {
      console.error('添加权限分配失败:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      course: '📚',
      class: '👥',
      student: '🎓',
      experiment: '🔬',
      system: '⚙️'
    };
    return icons[category] || '📄';
  };

  // 获取分类名称
  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      course: '课程管理',
      class: '班级管理',
      student: '学生管理',
      experiment: '实验管理',
      system: '系统管理'
    };
    return names[category] || category;
  };

  // 获取权限名称
  const getPermissionName = (permission: string) => {
    const names: Record<string, string> = {
      view: '查看',
      edit: '编辑',
      create: '创建',
      delete: '删除',
      grade: '评分',
      manage_students: '管理学生',
      view_students: '查看学生',
      assign_courses: '分配课程',
      view_submissions: '查看提交'
    };
    return names[permission] || permission;
  };

  // 过滤权限分配
  const filteredAssignments = assignments.filter(assignment => {
    const matchesDepartment = selectedDepartment === 'all' || assignment.department === selectedDepartment;
    const matchesCategory = selectedCategory === 'all' || assignment.category === selectedCategory;
    return matchesDepartment && matchesCategory;
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">加载中...</span>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">用户不存在</h2>
          <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            返回用户列表
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                <span className="hidden sm:inline">管理后台</span>
                <span className="sm:hidden">后台</span>
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <Link to="/admin/users" className="font-medium text-gray-600 hover:text-blue-600 transition-colors">
                <span className="hidden sm:inline">用户管理</span>
                <span className="sm:hidden">用户</span>
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <Link to={`/admin/users/${userId}`} className="font-medium text-gray-600 hover:text-blue-600 transition-colors">
                <span className="hidden sm:inline">用户详情</span>
                <span className="sm:hidden">详情</span>
              </Link>
            </li>
            <li className="flex items-center" aria-current="page">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="font-medium text-gray-900">权限分配</span>
            </li>
          </ol>
        </nav>

        {/* 用户信息头部 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user.fullName.charAt(0)}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{user.fullName} - 权限分配</h1>
                  <p className="text-gray-600">@{user.username} • {user.role === 'teacher' ? '教师' : user.role === 'admin' ? '管理员' : '学生'}</p>
                  {user.department && (
                    <p className="text-sm text-gray-500">{user.department}</p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  添加权限
                </button>
                <Link
                  to={`/admin/users/${userId}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                >
                  返回详情
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 权限统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">总权限数</p>
                <p className="text-2xl font-semibold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">已启用</p>
                <p className="text-2xl font-semibold text-gray-900">{assignments.filter(a => a.enabled).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">已禁用</p>
                <p className="text-2xl font-semibold text-gray-900">{assignments.filter(a => !a.enabled).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">涉及院系</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Set(assignments.map(a => a.department).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 筛选和搜索 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">所有院系</option>
                <option value="计算机学院">计算机学院</option>
                <option value="电子工程学院">电子工程学院</option>
                <option value="机械工程学院">机械工程学院</option>
                <option value="数学学院">数学学院</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">所有类型</option>
                <option value="course">课程管理</option>
                <option value="class">班级管理</option>
                <option value="student">学生管理</option>
                <option value="experiment">实验管理</option>
                <option value="system">系统管理</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              显示 {filteredAssignments.length} / {assignments.length} 项权限分配
            </div>
          </div>
        </div>

        {/* 权限分配列表 */}
        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无权限分配</h3>
              <p className="text-gray-600 mb-4">
                该用户还没有分配任何权限，点击"添加权限"开始分配权限。
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                添加权限
              </button>
            </div>
          ) : (
            filteredAssignments.map(assignment => (
              <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{getCategoryIcon(assignment.category)}</span>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{assignment.name}</h3>
                        <p className="text-sm text-gray-600">{assignment.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">资源类型</label>
                        <p className="text-sm text-gray-900 mt-1">{getCategoryName(assignment.category)}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">资源名称</label>
                        <p className="text-sm text-gray-900 mt-1">{assignment.resourceName}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">所属院系</label>
                        <p className="text-sm text-gray-900 mt-1">{assignment.department || '未指定'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">有效期</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {assignment.expiryDate ? assignment.expiryDate : '永久有效'}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">权限列表</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {assignment.permissions.map(permission => (
                          <span
                            key={permission}
                            className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                          >
                            {getPermissionName(permission)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 ml-6">
                    <div className="flex items-center">
                      <button
                        onClick={() => handlePermissionToggle(assignment.id, !assignment.enabled)}
                        disabled={saving}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                          assignment.enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                            assignment.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="ml-2 text-sm text-gray-600">
                        {assignment.enabled ? '已启用' : '已禁用'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      disabled={saving}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="删除权限分配"
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

        {/* 保存状态提示 */}
        {saving && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>保存中...</span>
          </div>
        )}

        {/* 添加权限模态框 */}
        {showAddModal && (
          <AddPermissionModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddAssignment}
            userRole={user?.role || 'student'}
            userDepartment={user?.department}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default UserPermissionAssignmentPage;
