/**
 * 运营数据分析组件
 * 
 * 提供用户活跃度、课程热度等运营数据分析
 */

import React, { useState, useEffect } from 'react';

// 运营数据接口
interface OperationalData {
  userActivity: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    retentionRate: number;
    dailyActiveUsers: { date: string; count: number }[];
  };
  coursePopularity: {
    courseId: string;
    courseName: string;
    department: string;
    enrollments: number;
    completionRate: number;
    averageScore: number;
    viewCount: number;
    downloadCount: number;
  }[];
  systemUsage: {
    totalSessions: number;
    averageSessionDuration: number;
    bounceRate: number;
    peakHours: { hour: number; users: number }[];
  };
  contentEngagement: {
    videoWatchTime: number;
    documentDownloads: number;
    forumPosts: number;
    assignmentSubmissions: number;
  };
}

const OperationalDashboard: React.FC = () => {
  const [data, setData] = useState<OperationalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // 模拟运营数据
  const mockOperationalData: OperationalData = {
    userActivity: {
      totalUsers: 1250,
      activeUsers: 892,
      newUsers: 45,
      retentionRate: 0.78,
      dailyActiveUsers: [
        { date: '2024-01-08', count: 234 },
        { date: '2024-01-09', count: 267 },
        { date: '2024-01-10', count: 298 },
        { date: '2024-01-11', count: 312 },
        { date: '2024-01-12', count: 289 },
        { date: '2024-01-13', count: 156 },
        { date: '2024-01-14', count: 178 }
      ]
    },
    coursePopularity: [
      {
        courseId: 'course_001',
        courseName: 'STM32嵌入式开发基础',
        department: '计算机学院',
        enrollments: 156,
        completionRate: 0.78,
        averageScore: 85.6,
        viewCount: 2340,
        downloadCount: 890
      },
      {
        courseId: 'course_002',
        courseName: 'ARM架构与编程',
        department: '计算机学院',
        enrollments: 134,
        completionRate: 0.65,
        averageScore: 82.3,
        viewCount: 1980,
        downloadCount: 720
      },
      {
        courseId: 'course_003',
        courseName: '数字电路设计',
        department: '电子工程学院',
        enrollments: 98,
        completionRate: 0.72,
        averageScore: 79.8,
        viewCount: 1560,
        downloadCount: 580
      },
      {
        courseId: 'course_004',
        courseName: 'C语言程序设计',
        department: '计算机学院',
        enrollments: 89,
        completionRate: 0.83,
        averageScore: 88.2,
        viewCount: 1420,
        downloadCount: 650
      },
      {
        courseId: 'course_005',
        courseName: '模拟电路分析',
        department: '电子工程学院',
        enrollments: 76,
        completionRate: 0.69,
        averageScore: 76.5,
        viewCount: 1180,
        downloadCount: 420
      }
    ],
    systemUsage: {
      totalSessions: 3456,
      averageSessionDuration: 28.5,
      bounceRate: 0.15,
      peakHours: [
        { hour: 8, users: 45 },
        { hour: 9, users: 78 },
        { hour: 10, users: 123 },
        { hour: 11, users: 156 },
        { hour: 14, users: 189 },
        { hour: 15, users: 234 },
        { hour: 16, users: 198 },
        { hour: 19, users: 167 },
        { hour: 20, users: 145 },
        { hour: 21, users: 98 }
      ]
    },
    contentEngagement: {
      videoWatchTime: 15680, // 分钟
      documentDownloads: 2340,
      forumPosts: 567,
      assignmentSubmissions: 1234
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(mockOperationalData);
      setLoading(false);
    };

    loadData();
  }, [timeRange]);

  // 过滤课程数据
  const filteredCourses = data?.coursePopularity.filter(course => 
    selectedDepartment === 'all' || course.department === selectedDepartment
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">加载运营数据...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">暂无运营数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 筛选器 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
              <option value="90d">最近90天</option>
            </select>
            
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有院系</option>
              <option value="计算机学院">计算机学院</option>
              <option value="电子工程学院">电子工程学院</option>
              <option value="机械工程学院">机械工程学院</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            数据更新时间: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* 用户活跃度概览 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">用户活跃度分析</h2>
          <p className="text-gray-600 mt-1">用户注册、活跃度和留存率统计</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">总用户数</p>
                  <p className="text-2xl font-semibold text-gray-900">{data.userActivity.totalUsers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">活跃用户</p>
                  <p className="text-2xl font-semibold text-gray-900">{data.userActivity.activeUsers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">新增用户</p>
                  <p className="text-2xl font-semibold text-gray-900">{data.userActivity.newUsers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">留存率</p>
                  <p className="text-2xl font-semibold text-gray-900">{(data.userActivity.retentionRate * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 每日活跃用户趋势 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">每日活跃用户趋势</h3>
            <div className="flex items-end space-x-2 h-32">
              {data.userActivity.dailyActiveUsers.map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                    style={{ 
                      height: `${(day.count / Math.max(...data.userActivity.dailyActiveUsers.map(d => d.count))) * 100}%`,
                      minHeight: '4px'
                    }}
                    title={`${day.date}: ${day.count}人`}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(day.date).getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 课程热度分析 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">课程热度分析</h2>
          <p className="text-gray-600 mt-1">课程注册、完成率和资源使用情况</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-gray-600">当前筛选条件下没有课程数据</p>
              </div>
            ) : (
              filteredCourses.map((course, index) => (
                <div key={course.courseId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                          #{index + 1}
                        </div>
                        <h3 className="font-medium text-gray-900">{course.courseName}</h3>
                        <span className="text-sm text-gray-500">{course.department}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">注册人数</span>
                          <p className="text-lg font-semibold text-gray-900">{course.enrollments}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">完成率</span>
                          <p className="text-lg font-semibold text-gray-900">{(course.completionRate * 100).toFixed(0)}%</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">平均分</span>
                          <p className="text-lg font-semibold text-gray-900">{course.averageScore.toFixed(1)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">浏览量</span>
                          <p className="text-lg font-semibold text-gray-900">{course.viewCount}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">完成进度</span>
                            <span className="font-medium">{(course.completionRate * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${course.completionRate * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">资源下载</span>
                            <span className="font-medium">{course.downloadCount}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min((course.downloadCount / course.enrollments) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="text-sm text-gray-500 mb-1">热度指数</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round((course.viewCount / 100) + (course.enrollments * 2) + (course.completionRate * 50))}
                      </div>
                      <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                        查看详情
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 系统使用情况 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">系统使用情况</h2>
            <p className="text-gray-600 mt-1">会话数据和用户行为分析</p>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{data.systemUsage.totalSessions}</div>
                  <div className="text-sm text-gray-500">总会话数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{data.systemUsage.averageSessionDuration.toFixed(1)}min</div>
                  <div className="text-sm text-gray-500">平均会话时长</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{(data.systemUsage.bounceRate * 100).toFixed(0)}%</div>
                  <div className="text-sm text-gray-500">跳出率</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">使用高峰时段</h3>
                <div className="space-y-2">
                  {data.systemUsage.peakHours.map(peak => (
                    <div key={peak.hour} className="flex items-center space-x-3">
                      <div className="w-12 text-sm text-gray-600">{peak.hour}:00</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(peak.users / Math.max(...data.systemUsage.peakHours.map(p => p.users))) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-sm text-gray-900 text-right">{peak.users}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">内容互动情况</h2>
            <p className="text-gray-600 mt-1">用户对各类内容的参与度</p>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">视频观看</p>
                      <p className="text-xl font-semibold text-gray-900">{(data.contentEngagement.videoWatchTime / 60).toFixed(0)}h</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">文档下载</p>
                      <p className="text-xl font-semibold text-gray-900">{data.contentEngagement.documentDownloads}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">论坛发帖</p>
                      <p className="text-xl font-semibold text-gray-900">{data.contentEngagement.forumPosts}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">作业提交</p>
                      <p className="text-xl font-semibold text-gray-900">{data.contentEngagement.assignmentSubmissions}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalDashboard;
