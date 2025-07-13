import React, { useState, useEffect } from 'react';
import MainLayout from '../../../../shared/ui/layout/MainLayout';

// 用户接口定义
interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  coursesCompleted?: number;
  experimentsCompleted?: number;
  studentsManaged?: number;
}

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: '20250001',
    email: 'zhang.san@student.edu.cn',
    fullName: '张三',
    role: 'student',
    status: 'active',
    lastLogin: '2024-01-15 14:30:00',
    createdAt: '2024-01-01',
    coursesCompleted: 3,
    experimentsCompleted: 2
  },
  {
    id: '2',
    username: '20250002',
    email: 'li.si@student.edu.cn',
    fullName: '李四',
    role: 'student',
    status: 'active',
    lastLogin: '2024-01-15 10:15:00',
    createdAt: '2024-01-02',
    coursesCompleted: 2,
    experimentsCompleted: 1
  },
  {
    id: '3',
    username: 'teacher001',
    email: 'wang.wu@teacher.edu.cn',
    fullName: '王五',
    role: 'teacher',
    status: 'active',
    lastLogin: '2024-01-15 09:20:00',
    createdAt: '2023-12-01',
    studentsManaged: 45
  },
  {
    id: '4',
    username: 'teacher002',
    email: 'zhao.liu@teacher.edu.cn',
    fullName: '赵六',
    role: 'teacher',
    status: 'inactive',
    lastLogin: '2024-01-10 16:45:00',
    createdAt: '2023-11-15',
    studentsManaged: 32
  },
  {
    id: '5',
    username: 'admin',
    email: 'admin@system.edu.cn',
    fullName: '系统管理员',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15 15:00:00',
    createdAt: '2023-10-01'
  }
];

/**
 * UserManagementPage - 用户管理页面
 * 
 * 管理员查看和管理所有用户信息
 * 支持用户的增删改查和状态管理
 */
const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // 模拟数据加载
  useEffect(() => {
    const loadUsers = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
      setLoading(false);
    };

    loadUsers();
  }, []);

  // 过滤用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

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

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '活跃';
      case 'inactive': return '不活跃';
      case 'suspended': return '暂停';
      default: return '未知';
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // 编辑用户
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  // 删除用户
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('确定要删除这个用户吗？')) {
      setUsers(users.filter(user => user.id !== userId));
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    }
  };

  // 更改用户状态
  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus as any } : user
    ));
    if (selectedUser?.id === userId) {
      setSelectedUser({ ...selectedUser, status: newStatus as any });
    }
  };

  // 统计数据
  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.status === 'active').length
  };

  return (
    <MainLayout>
      <div className="page-container">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">用户管理</h1>
          <p className="text-gray-600">管理系统中的所有用户账户，包括学生、教师和管理员</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">总用户数</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{stats.students}</div>
            <div className="text-sm text-gray-600">学生</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.teachers}</div>
            <div className="text-sm text-gray-600">教师</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.admins}</div>
            <div className="text-sm text-gray-600">管理员</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
            <div className="text-sm text-gray-600">活跃用户</div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                搜索用户
              </label>
              <input
                type="text"
                className="input-primary"
                placeholder="输入姓名、用户名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                角色筛选
              </label>
              <select
                className="input-primary"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">全部角色</option>
                <option value="student">学生</option>
                <option value="teacher">教师</option>
                <option value="admin">管理员</option>
              </select>
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                状态筛选
              </label>
              <select
                className="input-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">全部状态</option>
                <option value="active">活跃</option>
                <option value="inactive">不活跃</option>
                <option value="suspended">暂停</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              找到 {filteredUsers.length} 个用户
            </span>
            <button
              onClick={() => {
                setEditingUser(null);
                setShowUserModal(true);
              }}
              className="btn-primary"
            >
              + 添加用户
            </button>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="card">
          {loading ? (
            <div className="p-6 text-center">
              <div className="loading-spinner h-8 w-8 mx-auto mb-2"></div>
              <p className="text-gray-600">加载用户中...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用户信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      角色
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最后登录
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      统计信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleText(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(user.status)}`}
                        >
                          <option value="active">活跃</option>
                          <option value="inactive">不活跃</option>
                          <option value="suspended">暂停</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role === 'student' && (
                          <div>
                            <div>课程: {user.coursesCompleted || 0}</div>
                            <div>实验: {user.experimentsCompleted || 0}</div>
                          </div>
                        )}
                        {user.role === 'teacher' && (
                          <div>管理学生: {user.studentsManaged || 0}</div>
                        )}
                        {user.role === 'admin' && (
                          <div>系统管理员</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-green-600 hover:text-green-900"
                          >
                            详情
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              删除
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

        {/* 用户详情模态框 */}
        {selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">用户详情</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">姓名</label>
                    <p className="text-gray-900">{selectedUser.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">用户名</label>
                    <p className="text-gray-900">{selectedUser.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">邮箱</label>
                    <p className="text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">角色</label>
                    <p className="text-gray-900">{getRoleText(selectedUser.role)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">状态</label>
                    <p className="text-gray-900">{getStatusText(selectedUser.status)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">创建时间</label>
                    <p className="text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">最后登录</label>
                    <p className="text-gray-900">{formatDate(selectedUser.lastLogin)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UserManagementPage;
