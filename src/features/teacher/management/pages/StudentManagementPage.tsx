import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../../shared/ui/layout/MainLayout';

// 学生接口定义
interface Student {
  id: string;
  username: string;
  email: string;
  fullName: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  coursesCompleted: number;
  experimentsCompleted: number;
  totalStudyTime: number; // 分钟
  averageScore: number;
  joinDate: string;
}

// 活动记录接口
interface Activity {
  id: string;
  type: 'login' | 'course_complete' | 'experiment_start' | 'experiment_complete' | 'logout';
  description: string;
  timestamp: string;
  data?: any;
}

// 模拟学生数据
const mockStudents: Student[] = [
  {
    id: '20250001',
    username: '20250001',
    email: 'zhang.san@student.edu.cn',
    fullName: '张三',
    status: 'active',
    lastLogin: '2024-01-15 14:30:00',
    coursesCompleted: 3,
    experimentsCompleted: 2,
    totalStudyTime: 180,
    averageScore: 85,
    joinDate: '2024-01-01'
  },
  {
    id: '20250002',
    username: '20250002',
    email: 'li.si@student.edu.cn',
    fullName: '李四',
    status: 'active',
    lastLogin: '2024-01-15 10:15:00',
    coursesCompleted: 2,
    experimentsCompleted: 1,
    totalStudyTime: 120,
    averageScore: 78,
    joinDate: '2024-01-02'
  },
  {
    id: '20250003',
    username: '20250003',
    email: 'wang.wu@student.edu.cn',
    fullName: '王五',
    status: 'inactive',
    lastLogin: '2024-01-10 16:45:00',
    coursesCompleted: 1,
    experimentsCompleted: 0,
    totalStudyTime: 60,
    averageScore: 65,
    joinDate: '2024-01-03'
  },
  {
    id: '20250004',
    username: '20250004',
    email: 'zhao.liu@student.edu.cn',
    fullName: '赵六',
    status: 'active',
    lastLogin: '2024-01-15 09:20:00',
    coursesCompleted: 4,
    experimentsCompleted: 3,
    totalStudyTime: 240,
    averageScore: 92,
    joinDate: '2024-01-01'
  }
];

// 模拟活动数据
const mockActivities: { [key: string]: Activity[] } = {
  '20250001': [
    {
      id: '1',
      type: 'login',
      description: '登录系统',
      timestamp: '2024-01-15 14:30:00'
    },
    {
      id: '2',
      type: 'course_complete',
      description: '完成课程：STM32基础入门',
      timestamp: '2024-01-15 14:25:00'
    },
    {
      id: '3',
      type: 'experiment_start',
      description: '开始实验：LED闪烁实验',
      timestamp: '2024-01-15 13:45:00'
    }
  ],
  '20250002': [
    {
      id: '4',
      type: 'login',
      description: '登录系统',
      timestamp: '2024-01-15 10:15:00'
    },
    {
      id: '5',
      type: 'experiment_complete',
      description: '完成实验：GPIO编程',
      timestamp: '2024-01-15 10:00:00'
    }
  ]
};

/**
 * StudentManagementPage - 学生管理页面
 * 
 * 教师查看和管理学生信息，监控学习进度和活动
 * 参考ref目录实现，优化用户体验
 */
const StudentManagementPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentActivities, setStudentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 模拟数据加载
  useEffect(() => {
    const loadStudents = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStudents(mockStudents);
      setLoading(false);
    };

    loadStudents();
  }, []);

  // 选择学生
  const handleStudentSelect = async (student: Student) => {
    setSelectedStudent(student);
    // 模拟加载学生活动
    const activities = mockActivities[student.id] || [];
    setStudentActivities(activities);
  };

  // 过滤学生
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  // 格式化时间
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // 获取活动类型文本
  const getActivityTypeText = (type: string) => {
    const typeMap = {
      'login': '登录',
      'logout': '登出',
      'course_complete': '完成课程',
      'experiment_start': '开始实验',
      'experiment_complete': '完成实验'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  return (
    <MainLayout>
      <div className="page-container">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">学生管理</h1>
          <p className="text-gray-600">查看学生信息，监控学习进度和活动记录</p>
        </div>

        {/* 搜索和筛选 */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                搜索学生
              </label>
              <input
                type="text"
                className="input-primary"
                placeholder="输入姓名、学号或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
        </div>

        {/* 主要内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧学生列表 */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">
                  学生列表 ({filteredStudents.length})
                </h3>
              </div>

              {loading ? (
                <div className="p-6 text-center">
                  <div className="loading-spinner h-8 w-8 mx-auto mb-2"></div>
                  <p className="text-gray-600">加载中...</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {filteredStudents.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <button
                          key={student.id}
                          onClick={() => handleStudentSelect(student)}
                          className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                            selectedStudent?.id === student.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{student.fullName}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(student.status)}`}>
                              {getStatusText(student.status)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            <p>学号: {student.username}</p>
                            <p>最后登录: {formatDate(student.lastLogin)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      没有找到匹配的学生
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 右侧学生详情 */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="space-y-6">
                {/* 学生基本信息 */}
                <div className="card">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">学生详情</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedStudent.fullName}</h2>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>学号: {selectedStudent.username}</p>
                          <p>邮箱: {selectedStudent.email}</p>
                          <p>入学时间: {formatDate(selectedStudent.joinDate)}</p>
                          <p>最后登录: {formatDate(selectedStudent.lastLogin)}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedStudent.status)}`}>
                        {getStatusText(selectedStudent.status)}
                      </span>
                    </div>

                    {/* 学习统计 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedStudent.coursesCompleted}</div>
                        <div className="text-sm text-gray-600">完成课程</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedStudent.experimentsCompleted}</div>
                        <div className="text-sm text-gray-600">完成实验</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{formatTime(selectedStudent.totalStudyTime)}</div>
                        <div className="text-sm text-gray-600">学习时长</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{selectedStudent.averageScore}</div>
                        <div className="text-sm text-gray-600">平均分数</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 活动记录 */}
                <div className="card">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">最近活动</h3>
                  </div>
                  <div className="p-6">
                    {studentActivities.length > 0 ? (
                      <div className="space-y-4">
                        {studentActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">
                                  {getActivityTypeText(activity.type)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(activity.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        该学生暂无活动记录
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">选择学生查看详情</h3>
                  <p className="text-gray-600">从左侧列表中选择一名学生查看详细信息和活动记录</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentManagementPage;
