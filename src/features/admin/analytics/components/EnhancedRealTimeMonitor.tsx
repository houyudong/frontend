/**
 * 增强版实时监控组件
 * 
 * 美化的实时监控大屏，增加更多实时数据展示
 */

import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, PieChart, DonutChart } from '../../../../components/charts/ChartComponents';

const EnhancedRealTimeMonitor: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [realTimeData, setRealTimeData] = useState({
    onlineUsers: 892,
    activeClasses: 15,
    submittedAssignments: 234,
    systemLoad: 68,
    networkLatency: 45,
    errorRate: 0.2
  });

  // 实时数据更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // 模拟实时数据变化
      setRealTimeData(prev => ({
        onlineUsers: prev.onlineUsers + Math.floor(Math.random() * 20 - 10),
        activeClasses: prev.activeClasses + Math.floor(Math.random() * 4 - 2),
        submittedAssignments: prev.submittedAssignments + Math.floor(Math.random() * 10),
        systemLoad: Math.max(0, Math.min(100, prev.systemLoad + Math.floor(Math.random() * 10 - 5))),
        networkLatency: Math.max(0, prev.networkLatency + Math.floor(Math.random() * 10 - 5)),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() * 0.2 - 0.1)))
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // 模拟实时图表数据
  const realtimeChartData = {
    onlineUsersTrend: [
      { label: '10:00', value: 850 },
      { label: '10:05', value: 867 },
      { label: '10:10', value: 882 },
      { label: '10:15', value: 895 },
      { label: '10:20', value: realTimeData.onlineUsers }
    ],
    systemMetrics: [
      { label: 'CPU使用率', value: realTimeData.systemLoad },
      { label: '内存使用率', value: 72 },
      { label: '磁盘使用率', value: 45 },
      { label: '网络带宽', value: 68 }
    ],
    courseActivity: [
      { label: 'STM32基础', value: 45, color: '#3B82F6' },
      { label: 'ARM架构', value: 38, color: '#10B981' },
      { label: 'C语言', value: 32, color: '#F59E0B' },
      { label: '嵌入式', value: 28, color: '#EF4444' },
      { label: '其他', value: 25, color: '#8B5CF6' }
    ],
    serverStatus: [
      { label: '正常', value: 85, color: '#10B981' },
      { label: '警告', value: 12, color: '#F59E0B' },
      { label: '错误', value: 3, color: '#EF4444' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* 实时状态头部 */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 rounded-2xl p-6 text-white overflow-hidden relative">
        {/* 背景动画效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🖥️</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold">实时监控大屏</h2>
                <p className="text-blue-200 mt-1">系统实时状态监控与数据分析</p>
              </div>
            </div>
            
            {/* 实时时间 */}
            <div className="text-right">
              <div className="text-2xl font-mono font-bold">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-blue-200">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* 实时指标卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { 
                title: '在线用户', 
                value: realTimeData.onlineUsers.toLocaleString(), 
                icon: '👥',
                status: 'normal',
                change: '+12'
              },
              { 
                title: '活跃课堂', 
                value: realTimeData.activeClasses.toString(), 
                icon: '📚',
                status: 'normal',
                change: '+2'
              },
              { 
                title: '作业提交', 
                value: realTimeData.submittedAssignments.toString(), 
                icon: '📝',
                status: 'normal',
                change: '+8'
              },
              { 
                title: '系统负载', 
                value: `${realTimeData.systemLoad}%`, 
                icon: '⚡',
                status: realTimeData.systemLoad > 80 ? 'warning' : 'normal',
                change: realTimeData.systemLoad > 80 ? '高' : '正常'
              },
              { 
                title: '网络延迟', 
                value: `${realTimeData.networkLatency}ms`, 
                icon: '🌐',
                status: realTimeData.networkLatency > 100 ? 'warning' : 'normal',
                change: realTimeData.networkLatency > 100 ? '高' : '正常'
              },
              { 
                title: '错误率', 
                value: `${realTimeData.errorRate.toFixed(1)}%`, 
                icon: '🔍',
                status: realTimeData.errorRate > 1 ? 'error' : 'normal',
                change: realTimeData.errorRate > 1 ? '异常' : '正常'
              }
            ].map((metric, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{metric.icon}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    metric.status === 'normal' ? 'bg-green-400' :
                    metric.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  } animate-pulse`}></div>
                </div>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm text-blue-200">{metric.title}</div>
                <div className="text-xs text-green-300 mt-1">+{metric.change}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 实时图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 在线用户趋势 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">在线用户趋势</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">实时更新</span>
            </div>
          </div>
          <LineChart 
            data={realtimeChartData.onlineUsersTrend}
            color="#10B981"
            height={200}
          />
        </div>

        {/* 系统性能指标 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">系统性能指标</h3>
          <div className="space-y-4">
            {realtimeChartData.systemMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        metric.value > 80 ? 'bg-red-500' :
                        metric.value > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {metric.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 热门课程实时活跃度 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">课程实时活跃度</h3>
          <BarChart 
            data={realtimeChartData.courseActivity}
            height={200}
          />
        </div>

        {/* 服务器状态分布 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">服务器状态分布</h3>
          <DonutChart 
            data={realtimeChartData.serverStatus}
            size={200}
            centerText="100"
          />
        </div>
      </div>

      {/* 实时活动日志 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">实时活动日志</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {[
              { time: '10:23:45', type: 'info', message: '用户 张三 登录系统', icon: '👤' },
              { time: '10:23:42', type: 'success', message: '课程 STM32基础 新增学员', icon: '📚' },
              { time: '10:23:38', type: 'warning', message: '服务器 Node-02 CPU使用率达到85%', icon: '⚠️' },
              { time: '10:23:35', type: 'info', message: '作业提交：嵌入式系统设计', icon: '📝' },
              { time: '10:23:30', type: 'success', message: '实验完成：ARM架构实验', icon: '🧪' },
              { time: '10:23:25', type: 'info', message: '用户 李四 开始学习视频', icon: '▶️' },
              { time: '10:23:20', type: 'error', message: '数据库连接异常，已自动恢复', icon: '🔧' },
              { time: '10:23:15', type: 'info', message: '新用户注册：王五', icon: '✨' }
            ].map((log, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="text-xs text-gray-500 font-mono w-16">{log.time}</div>
                <div className="text-lg">{log.icon}</div>
                <div className="flex-1 text-sm text-gray-700">{log.message}</div>
                <div className={`w-2 h-2 rounded-full ${
                  log.type === 'success' ? 'bg-green-400' :
                  log.type === 'warning' ? 'bg-yellow-400' :
                  log.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRealTimeMonitor;
