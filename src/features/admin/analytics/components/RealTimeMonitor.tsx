/**
 * 实时监控大屏组件
 * 
 * 提供实时在线人数、热门课程、作业提交率等实时数据监控
 */

import React, { useState, useEffect } from 'react';

// 实时数据接口
interface RealTimeData {
  onlineUsers: {
    total: number;
    byDepartment: { department: string; count: number; color: string }[];
    trend: { time: string; count: number }[];
  };
  hotCourses: {
    courseId: string;
    courseName: string;
    department: string;
    currentViews: number;
    todayViews: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  assignmentSubmission: {
    todaySubmissions: number;
    totalAssignments: number;
    submissionRate: number;
    departmentAverage: number;
    hourlySubmissions: { hour: number; count: number }[];
  };
  systemStatus: {
    serverLoad: number;
    responseTime: number;
    errorRate: number;
    uptime: number;
  };
}

const RealTimeMonitor: React.FC = () => {
  const [data, setData] = useState<RealTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 模拟实时数据
  const generateMockData = (): RealTimeData => ({
    onlineUsers: {
      total: Math.floor(Math.random() * 50) + 180,
      byDepartment: [
        { department: '计算机学院', count: Math.floor(Math.random() * 30) + 80, color: '#3B82F6' },
        { department: '电子工程学院', count: Math.floor(Math.random() * 20) + 45, color: '#10B981' },
        { department: '机械工程学院', count: Math.floor(Math.random() * 15) + 30, color: '#F59E0B' },
        { department: '数学学院', count: Math.floor(Math.random() * 10) + 25, color: '#8B5CF6' }
      ],
      trend: Array.from({ length: 10 }, (_, i) => ({
        time: new Date(Date.now() - (9 - i) * 60000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        count: Math.floor(Math.random() * 50) + 150
      }))
    },
    hotCourses: [
      {
        courseId: 'course_001',
        courseName: 'STM32嵌入式开发基础',
        department: '计算机学院',
        currentViews: Math.floor(Math.random() * 20) + 45,
        todayViews: Math.floor(Math.random() * 200) + 380,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      },
      {
        courseId: 'course_002',
        courseName: 'ARM架构与编程',
        department: '计算机学院',
        currentViews: Math.floor(Math.random() * 15) + 32,
        todayViews: Math.floor(Math.random() * 150) + 290,
        trend: Math.random() > 0.5 ? 'up' : 'stable'
      },
      {
        courseId: 'course_003',
        courseName: '数字电路设计',
        department: '电子工程学院',
        currentViews: Math.floor(Math.random() * 12) + 28,
        todayViews: Math.floor(Math.random() * 120) + 220,
        trend: Math.random() > 0.5 ? 'down' : 'up'
      },
      {
        courseId: 'course_004',
        courseName: 'C语言程序设计',
        department: '计算机学院',
        currentViews: Math.floor(Math.random() * 10) + 25,
        todayViews: Math.floor(Math.random() * 100) + 180,
        trend: 'stable'
      },
      {
        courseId: 'course_005',
        courseName: '模拟电路分析',
        department: '电子工程学院',
        currentViews: Math.floor(Math.random() * 8) + 18,
        todayViews: Math.floor(Math.random() * 80) + 150,
        trend: 'up'
      }
    ],
    assignmentSubmission: {
      todaySubmissions: Math.floor(Math.random() * 50) + 156,
      totalAssignments: 245,
      submissionRate: Math.random() * 0.2 + 0.65,
      departmentAverage: 0.72,
      hourlySubmissions: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: i >= 8 && i <= 22 ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 3)
      }))
    },
    systemStatus: {
      serverLoad: Math.random() * 30 + 15,
      responseTime: Math.random() * 50 + 80,
      errorRate: Math.random() * 0.02,
      uptime: 99.8 + Math.random() * 0.15
    }
  });

  // 实时数据更新
  useEffect(() => {
    const updateData = () => {
      setData(generateMockData());
      setLastUpdate(new Date());
    };

    // 初始加载
    updateData();
    setLoading(false);

    // 每5秒更新一次数据
    const interval = setInterval(updateData, 5000);

    return () => clearInterval(interval);
  }, []);

  // 全屏切换
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 获取趋势图标
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>;
      case 'down':
        return <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
        </svg>;
      default:
        return <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">启动实时监控...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">暂无实时数据</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isFullscreen ? 'bg-gray-900 text-white p-8' : ''}`}>
      {/* 控制栏 */}
      <div className={`flex items-center justify-between ${isFullscreen ? 'text-white' : 'text-gray-900'}`}>
        <div>
          <h1 className={`text-2xl font-bold ${isFullscreen ? 'text-white' : 'text-gray-900'}`}>
            实时监控大屏
          </h1>
          <p className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-gray-600'}`}>
            最后更新: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${isFullscreen ? 'text-green-400' : 'text-green-600'}`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">实时更新中</span>
          </div>
          
          <button
            onClick={toggleFullscreen}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isFullscreen 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isFullscreen ? '退出全屏' : '全屏显示'}
          </button>
        </div>
      </div>

      {/* 第一行：在线用户和系统状态 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 当前在线人数 */}
        <div className={`rounded-lg shadow-lg p-6 ${isFullscreen ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${isFullscreen ? 'text-white' : 'text-gray-900'}`}>
              当前在线人数
            </h2>
            <div className={`text-3xl font-bold ${isFullscreen ? 'text-blue-400' : 'text-blue-600'}`}>
              {data.onlineUsers.total}
            </div>
          </div>
          
          {/* 院系分布 */}
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${isFullscreen ? 'text-gray-300' : 'text-gray-700'}`}>
              院系分布
            </h3>
            <div className="space-y-3">
              {data.onlineUsers.byDepartment.map(dept => (
                <div key={dept.department} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    ></div>
                    <span className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-gray-600'}`}>
                      {dept.department}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          backgroundColor: dept.color,
                          width: `${(dept.count / data.onlineUsers.total) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium w-8 text-right ${isFullscreen ? 'text-white' : 'text-gray-900'}`}>
                      {dept.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 在线趋势 */}
          <div className="mt-6">
            <h3 className={`text-lg font-medium mb-3 ${isFullscreen ? 'text-gray-300' : 'text-gray-700'}`}>
              10分钟趋势
            </h3>
            <div className="flex items-end space-x-1 h-16">
              {data.onlineUsers.trend.map((point, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full rounded-t transition-all duration-300 ${
                      isFullscreen ? 'bg-blue-400' : 'bg-blue-500'
                    }`}
                    style={{ 
                      height: `${(point.count / Math.max(...data.onlineUsers.trend.map(p => p.count))) * 100}%`,
                      minHeight: '4px'
                    }}
                    title={`${point.time}: ${point.count}人`}
                  ></div>
                  <div className={`text-xs mt-1 ${isFullscreen ? 'text-gray-400' : 'text-gray-500'}`}>
                    {point.time.split(':')[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 系统状态 */}
        <div className={`rounded-lg shadow-lg p-6 ${isFullscreen ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-6 ${isFullscreen ? 'text-white' : 'text-gray-900'}`}>
            系统状态
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${isFullscreen ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-gray-600'}`}>服务器负载</div>
              <div className={`text-2xl font-bold ${
                data.systemStatus.serverLoad > 80 ? 'text-red-500' :
                data.systemStatus.serverLoad > 60 ? 'text-yellow-500' : 
                isFullscreen ? 'text-green-400' : 'text-green-600'
              }`}>
                {data.systemStatus.serverLoad.toFixed(1)}%
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isFullscreen ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-gray-600'}`}>响应时间</div>
              <div className={`text-2xl font-bold ${
                data.systemStatus.responseTime > 200 ? 'text-red-500' :
                data.systemStatus.responseTime > 150 ? 'text-yellow-500' : 
                isFullscreen ? 'text-green-400' : 'text-green-600'
              }`}>
                {data.systemStatus.responseTime.toFixed(0)}ms
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isFullscreen ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-gray-600'}`}>错误率</div>
              <div className={`text-2xl font-bold ${
                data.systemStatus.errorRate > 0.01 ? 'text-red-500' :
                data.systemStatus.errorRate > 0.005 ? 'text-yellow-500' : 
                isFullscreen ? 'text-green-400' : 'text-green-600'
              }`}>
                {(data.systemStatus.errorRate * 100).toFixed(2)}%
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isFullscreen ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-gray-600'}`}>系统可用性</div>
              <div className={`text-2xl font-bold ${
                data.systemStatus.uptime < 99.5 ? 'text-red-500' :
                data.systemStatus.uptime < 99.8 ? 'text-yellow-500' : 
                isFullscreen ? 'text-green-400' : 'text-green-600'
              }`}>
                {data.systemStatus.uptime.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 第二行：热门课程TOP5 */}
      <div className={`rounded-lg shadow-lg p-6 ${isFullscreen ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${isFullscreen ? 'text-white' : 'text-gray-900'}`}>
            热门课程 TOP5 (实时点击量)
          </h2>
          <div className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-gray-600'}`}>
            实时更新
          </div>
        </div>

        <div className="space-y-4">
          {data.hotCourses.map((course, index) => (
            <div key={course.courseId} className={`flex items-center justify-between p-4 rounded-lg ${
              isFullscreen ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-600 text-white' :
                  isFullscreen ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>

                <div>
                  <h3 className={`font-medium ${isFullscreen ? 'text-white' : 'text-gray-900'}`}>
                    {course.courseName}
                  </h3>
                  <p className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-gray-600'}`}>
                    {course.department}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className={`text-lg font-bold ${isFullscreen ? 'text-blue-400' : 'text-blue-600'}`}>
                    {course.currentViews}
                  </div>
                  <div className={`text-xs ${isFullscreen ? 'text-gray-400' : 'text-gray-500'}`}>
                    当前在线
                  </div>
                </div>

                <div className="text-center">
                  <div className={`text-lg font-bold ${isFullscreen ? 'text-green-400' : 'text-green-600'}`}>
                    {course.todayViews}
                  </div>
                  <div className={`text-xs ${isFullscreen ? 'text-gray-400' : 'text-gray-500'}`}>
                    今日总量
                  </div>
                </div>

                <div className="flex items-center">
                  {getTrendIcon(course.trend)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 第三行：作业提交率 */}
      <div className={`rounded-lg shadow-lg p-6 ${isFullscreen ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${isFullscreen ? 'text-white' : 'text-gray-900'}`}>
            当日作业提交率
          </h2>
          <div className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-gray-600'}`}>
            对比全院平均值
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 提交统计 */}
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${isFullscreen ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <div className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-blue-600'}`}>今日提交</div>
              <div className={`text-3xl font-bold ${isFullscreen ? 'text-blue-400' : 'text-blue-600'}`}>
                {data.assignmentSubmission.todaySubmissions}
              </div>
              <div className={`text-sm ${isFullscreen ? 'text-gray-400' : 'text-gray-600'}`}>
                / {data.assignmentSubmission.totalAssignments} 总作业
              </div>
            </div>

            <div className={`p-4 rounded-lg ${isFullscreen ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-green-600'}`}>提交率</div>
              <div className={`text-3xl font-bold ${isFullscreen ? 'text-green-400' : 'text-green-600'}`}>
                {(data.assignmentSubmission.submissionRate * 100).toFixed(1)}%
              </div>
              <div className={`text-sm ${
                data.assignmentSubmission.submissionRate > data.assignmentSubmission.departmentAverage
                  ? isFullscreen ? 'text-green-400' : 'text-green-600'
                  : isFullscreen ? 'text-red-400' : 'text-red-600'
              }`}>
                {data.assignmentSubmission.submissionRate > data.assignmentSubmission.departmentAverage ? '↑' : '↓'}
                全院平均 {(data.assignmentSubmission.departmentAverage * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* 提交率对比 */}
          <div className="lg:col-span-2">
            <h3 className={`text-lg font-medium mb-4 ${isFullscreen ? 'text-gray-300' : 'text-gray-700'}`}>
              24小时提交分布
            </h3>
            <div className="flex items-end space-x-1 h-32">
              {data.assignmentSubmission.hourlySubmissions.map((hour, index) => (
                <div key={hour.hour} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      isFullscreen ? 'bg-green-400' : 'bg-green-500'
                    }`}
                    style={{
                      height: `${hour.count > 0 ? (hour.count / Math.max(...data.assignmentSubmission.hourlySubmissions.map(h => h.count))) * 100 : 2}%`,
                      minHeight: '2px'
                    }}
                    title={`${hour.hour}:00 - ${hour.count}次提交`}
                  ></div>
                  <div className={`text-xs mt-1 ${isFullscreen ? 'text-gray-400' : 'text-gray-500'}`}>
                    {hour.hour}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded ${isFullscreen ? 'bg-green-400' : 'bg-green-500'}`}></div>
                <span className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-gray-600'}`}>
                  提交次数
                </span>
              </div>
              <div className={`text-sm ${isFullscreen ? 'text-gray-400' : 'text-gray-500'}`}>
                峰值时段: 14:00-16:00, 19:00-21:00
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitor;
