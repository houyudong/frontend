import React, { useState, useEffect } from 'react';
import MainLayout from '../../../../shared/ui/layout/MainLayout';

// 报表数据接口
interface SystemReport {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalCourses: number;
    totalExperiments: number;
    systemUptime: number;
    storageUsed: number;
    storageTotal: number;
  };
  userStats: {
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    activeUsersToday: number;
    usersByRole: {
      students: number;
      teachers: number;
      admins: number;
    };
  };
  learningStats: {
    coursesCompletedToday: number;
    experimentsCompletedToday: number;
    avgSessionDuration: number;
    totalStudyTime: number;
    popularCourses: {
      name: string;
      enrollments: number;
      completionRate: number;
    }[];
  };
  systemHealth: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
    errorRate: number;
    services: {
      name: string;
      status: 'healthy' | 'warning' | 'error';
      uptime: number;
      lastCheck: string;
    }[];
  };
  timeSeriesData: {
    date: string;
    users: number;
    sessions: number;
    errors: number;
    performance: number;
  }[];
}

// 模拟报表数据
const mockReportData: SystemReport = {
  overview: {
    totalUsers: 156,
    activeUsers: 89,
    totalCourses: 12,
    totalExperiments: 13,
    systemUptime: 99.8,
    storageUsed: 2.4,
    storageTotal: 10.0
  },
  userStats: {
    newUsersToday: 3,
    newUsersThisWeek: 15,
    newUsersThisMonth: 42,
    activeUsersToday: 89,
    usersByRole: {
      students: 120,
      teachers: 15,
      admins: 3
    }
  },
  learningStats: {
    coursesCompletedToday: 8,
    experimentsCompletedToday: 15,
    avgSessionDuration: 45,
    totalStudyTime: 2340,
    popularCourses: [
      { name: 'STM32基础入门', enrollments: 45, completionRate: 78 },
      { name: 'GPIO编程与LED控制', enrollments: 40, completionRate: 80 },
      { name: 'UART串口通信', enrollments: 35, completionRate: 57 },
      { name: '定时器与PWM控制', enrollments: 30, completionRate: 50 }
    ]
  },
  systemHealth: {
    cpuUsage: 35,
    memoryUsage: 68,
    diskUsage: 24,
    networkLatency: 12,
    errorRate: 0.2,
    services: [
      { name: '数据库服务', status: 'healthy', uptime: 99.9, lastCheck: '2024-01-15 15:30:00' },
      { name: 'API服务', status: 'healthy', uptime: 99.8, lastCheck: '2024-01-15 15:30:00' },
      { name: 'WebIDE服务', status: 'warning', uptime: 98.5, lastCheck: '2024-01-15 15:29:00' },
      { name: '文件存储', status: 'healthy', uptime: 99.9, lastCheck: '2024-01-15 15:30:00' },
      { name: '邮件服务', status: 'healthy', uptime: 99.7, lastCheck: '2024-01-15 15:30:00' }
    ]
  },
  timeSeriesData: [
    { date: '2024-01-09', users: 82, sessions: 156, errors: 3, performance: 98 },
    { date: '2024-01-10', users: 85, sessions: 162, errors: 2, performance: 99 },
    { date: '2024-01-11', users: 78, sessions: 145, errors: 5, performance: 97 },
    { date: '2024-01-12', users: 91, sessions: 178, errors: 1, performance: 99 },
    { date: '2024-01-13', users: 88, sessions: 171, errors: 4, performance: 98 },
    { date: '2024-01-14', users: 93, sessions: 185, errors: 2, performance: 99 },
    { date: '2024-01-15', users: 89, sessions: 168, errors: 3, performance: 98 }
  ]
};

/**
 * SystemReportsPage - 系统报表页面
 * 
 * 管理员查看系统运行状态和数据统计
 * 提供多维度的系统分析和监控
 */
const SystemReportsPage: React.FC = () => {
  const [reportData, setReportData] = useState<SystemReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'learning' | 'system'>('overview');
  const [refreshing, setRefreshing] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    const loadReportData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReportData(mockReportData);
      setLoading(false);
    };

    loadReportData();
  }, []);

  // 刷新数据
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 模拟数据更新
    setReportData({ ...mockReportData });
    setRefreshing(false);
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return '正常';
      case 'warning': return '警告';
      case 'error': return '错误';
      default: return '未知';
    }
  };

  // 格式化存储大小
  const formatStorage = (gb: number) => {
    return `${gb.toFixed(1)} GB`;
  };

  // 格式化时间
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner h-8 w-8 mr-3"></div>
            <span className="text-gray-600">加载报表数据中...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!reportData) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">数据加载失败</h3>
            <p className="text-gray-600">请刷新页面重试</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-container">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">系统报表</h1>
              <p className="text-gray-600">监控系统运行状态，分析平台使用数据</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-primary flex items-center space-x-2"
            >
              {refreshing ? (
                <>
                  <div className="loading-spinner h-4 w-4"></div>
                  <span>刷新中...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>刷新数据</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 标签导航 */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: '总览', icon: '📊' },
                { id: 'users', name: '用户统计', icon: '👥' },
                { id: 'learning', name: '学习统计', icon: '📚' },
                { id: 'system', name: '系统健康', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
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
        </div>

        {/* 内容区域 */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* 核心指标 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-3xl font-bold text-blue-600">{reportData.overview.totalUsers}</div>
                <div className="text-sm text-gray-600 mt-1">总用户数</div>
                <div className="text-xs text-green-600 mt-1">
                  活跃: {reportData.overview.activeUsers} ({Math.round(reportData.overview.activeUsers / reportData.overview.totalUsers * 100)}%)
                </div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-green-600">{reportData.overview.systemUptime}%</div>
                <div className="text-sm text-gray-600 mt-1">系统可用性</div>
                <div className="text-xs text-gray-500 mt-1">过去30天</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-purple-600">{reportData.overview.totalCourses}</div>
                <div className="text-sm text-gray-600 mt-1">课程总数</div>
                <div className="text-xs text-gray-500 mt-1">{reportData.overview.totalExperiments} 个实验</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {formatStorage(reportData.overview.storageUsed)}
                </div>
                <div className="text-sm text-gray-600 mt-1">存储使用</div>
                <div className="text-xs text-gray-500 mt-1">
                  总计: {formatStorage(reportData.overview.storageTotal)}
                </div>
              </div>
            </div>

            {/* 最近7天趋势 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">最近7天趋势</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {reportData.timeSeriesData.slice(-7).map((day, index) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900 w-20">
                          {new Date(day.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span>👥 {day.users} 活跃用户</span>
                          <span>🔗 {day.sessions} 会话</span>
                          <span>⚠️ {day.errors} 错误</span>
                          <span>⚡ {day.performance}% 性能</span>
                        </div>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${day.performance}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'users' && (
          <div className="space-y-6">
            {/* 用户增长统计 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-2xl font-bold text-blue-600">{reportData.userStats.newUsersToday}</div>
                <div className="text-sm text-gray-600">今日新用户</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-600">{reportData.userStats.newUsersThisWeek}</div>
                <div className="text-sm text-gray-600">本周新用户</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-purple-600">{reportData.userStats.newUsersThisMonth}</div>
                <div className="text-sm text-gray-600">本月新用户</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-orange-600">{reportData.userStats.activeUsersToday}</div>
                <div className="text-sm text-gray-600">今日活跃用户</div>
              </div>
            </div>

            {/* 用户角色分布 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">用户角色分布</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{reportData.userStats.usersByRole.students}</div>
                    <div className="text-sm text-gray-600">学生</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(reportData.userStats.usersByRole.students / reportData.overview.totalUsers * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{reportData.userStats.usersByRole.teachers}</div>
                    <div className="text-sm text-gray-600">教师</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(reportData.userStats.usersByRole.teachers / reportData.overview.totalUsers * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{reportData.userStats.usersByRole.admins}</div>
                    <div className="text-sm text-gray-600">管理员</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(reportData.userStats.usersByRole.admins / reportData.overview.totalUsers * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'learning' && (
          <div className="space-y-6">
            {/* 学习活动统计 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-2xl font-bold text-blue-600">{reportData.learningStats.coursesCompletedToday}</div>
                <div className="text-sm text-gray-600">今日完成课程</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-600">{reportData.learningStats.experimentsCompletedToday}</div>
                <div className="text-sm text-gray-600">今日完成实验</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-purple-600">{formatTime(reportData.learningStats.avgSessionDuration)}</div>
                <div className="text-sm text-gray-600">平均会话时长</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-orange-600">{formatTime(reportData.learningStats.totalStudyTime)}</div>
                <div className="text-sm text-gray-600">总学习时长</div>
              </div>
            </div>

            {/* 热门课程 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">热门课程统计</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {reportData.learningStats.popularCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900 w-4">#{index + 1}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{course.name}</div>
                          <div className="text-xs text-gray-500">{course.enrollments} 人报名</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{course.completionRate}% 完成率</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'system' && (
          <div className="space-y-6">
            {/* 系统资源使用 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-2xl font-bold text-blue-600">{reportData.systemHealth.cpuUsage}%</div>
                <div className="text-sm text-gray-600">CPU使用率</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-600">{reportData.systemHealth.memoryUsage}%</div>
                <div className="text-sm text-gray-600">内存使用率</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-purple-600">{reportData.systemHealth.diskUsage}%</div>
                <div className="text-sm text-gray-600">磁盘使用率</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-orange-600">{reportData.systemHealth.networkLatency}ms</div>
                <div className="text-sm text-gray-600">网络延迟</div>
              </div>
            </div>

            {/* 服务状态 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">服务状态监控</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {reportData.systemHealth.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          service.status === 'healthy' ? 'bg-green-500' : 
                          service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          <div className="text-xs text-gray-500">最后检查: {service.lastCheck}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                          {getStatusText(service.status)}
                        </span>
                        <span className="text-sm text-gray-600">运行时间: {service.uptime}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 错误率统计 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">系统错误率</h3>
              </div>
              <div className="p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">{reportData.systemHealth.errorRate}%</div>
                  <div className="text-sm text-gray-600 mt-2">过去24小时错误率</div>
                  <div className="text-xs text-gray-500 mt-1">目标: &lt; 1%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SystemReportsPage;
