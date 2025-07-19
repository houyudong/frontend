import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
// import { ConfirmDialog } from '../../../stmIde/components/UI/ConfirmDialog';

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended' | 'graduated';
  enrollDate: string;
  lastLogin?: string;
  avatar?: string;
  grade?: string;
  major?: string;
}

const StudentManagementPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [batchOperation, setBatchOperation] = useState<string>('');
  const [batchLoading, setBatchLoading] = useState(false);

  // 模拟数据
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: '1',
        name: '张三',
        studentId: '2021001',
        email: 'zhangsan@example.com',
        phone: '13800138001',
        status: 'active',
        enrollDate: '2021-09-01',
        lastLogin: '2024-01-15T10:30:00Z',
        grade: '大三',
        major: '计算机科学与技术'
      },
      {
        id: '2',
        name: '李四',
        studentId: '2021002',
        email: 'lisi@example.com',
        phone: '13800138002',
        status: 'active',
        enrollDate: '2021-09-01',
        lastLogin: '2024-01-14T15:20:00Z',
        grade: '大三',
        major: '软件工程'
      },
      {
        id: '3',
        name: '王五',
        studentId: '2021003',
        email: 'wangwu@example.com',
        phone: '13800138003',
        status: 'inactive',
        enrollDate: '2021-09-01',
        grade: '大三',
        major: '信息安全'
      }
    ];

    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 1000);
  }, [classId]);

  // 过滤学生
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '在读';
      case 'inactive': return '未激活';
      case 'suspended': return '暂停';
      case 'graduated': return '毕业';
      default: return status;
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

  // 处理批量操作
  const handleBatchOperation = async () => {
    setBatchLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 更新学生状态
      setStudents(prev => prev.map(student => {
        if (selectedStudents.includes(student.id)) {
          return { ...student, status: batchOperation as Student['status'] };
        }
        return student;
      }));
      
      setSelectedStudents([]);
      setShowBatchDialog(false);
    } catch (error) {
      console.error('批量操作失败:', error);
    } finally {
      setBatchLoading(false);
    }
  };

  // 获取操作文本
  const getOperationText = (operation: string) => {
    const operationMap: Record<string, string> = {
      active: '激活',
      inactive: '停用',
      suspended: '暂停',
      graduated: '毕业',
      delete: '删除'
    };
    return operationMap[operation] || operation;
  };

  return (
    <MainLayout>
      {/* 面包屑导航 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 mb-8">
        <div className="page-container py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/teacher/dashboard" className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              教师工作台
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
            <span className="text-gray-600">教学管理</span>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
            <span className="text-green-700 font-medium">学生管理</span>
          </nav>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="page-container">
        {/* 页面标题 */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 rounded-2xl mb-8 shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
          
          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-200 text-sm font-medium rounded-full">学生管理</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">
                  班级学生管理
                </h1>
                <p className="text-emerald-100 text-lg mb-6 max-w-2xl">
                  管理班级学生信息，跟踪学习进度，维护学生档案
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                    <span className="text-emerald-200 text-sm">共 {students.length} 名学生</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-emerald-200 text-sm">在读 {students.filter(s => s.status === 'active').length} 人</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <span className="text-7xl">👥</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="搜索学生姓名、学号或邮箱..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">全部状态</option>
                <option value="active">在读</option>
                <option value="inactive">未激活</option>
                <option value="suspended">暂停</option>
                <option value="graduated">毕业</option>
              </select>
              
              {selectedStudents.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">已选择 {selectedStudents.length} 个学生</span>
                  <button
                    onClick={() => {
                      setBatchOperation('active');
                      setShowBatchDialog(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                  >
                    批量操作
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 学生列表 */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载学生信息中...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents(filteredStudents.map(s => s.id));
                          } else {
                            setSelectedStudents([]);
                          }
                        }}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">学生信息</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">联系方式</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">状态</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">最后登录</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents(prev => [...prev, student.id]);
                            } else {
                              setSelectedStudents(prev => prev.filter(id => id !== student.id));
                            }
                          }}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">{student.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">学号: {student.studentId}</div>
                            {student.major && <div className="text-sm text-gray-500">{student.major} · {student.grade}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{student.email}</div>
                        <div className="text-sm text-gray-500">{student.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                          {getStatusText(student.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(student.lastLogin)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                            编辑
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 批量操作确认对话框 - 暂时注释掉 */}
        {/* <ConfirmDialog
          isOpen={showBatchDialog}
          onClose={() => setShowBatchDialog(false)}
          onConfirm={handleBatchOperation}
          title={`批量${getOperationText(batchOperation)}`}
          message={`确定要${getOperationText(batchOperation)} ${selectedStudents.length} 个学生吗？`}
          confirmText="确认"
          cancelText="取消"
          loading={batchLoading}
        /> */}
      </div>
    </MainLayout>
  );
};

export default StudentManagementPage;
