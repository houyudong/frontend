/**
 * 增强版运营数据分析组件
 * 
 * 美化的用户活跃度和课程热度分析，增加更多图表展示
 */

import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, PieChart, DonutChart, RadarChart } from '../../../../components/charts/ChartComponents';

const EnhancedOperationalDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // 模拟运营数据
  const mockOperationalData = {
    userActivity: {
      daily: [
        { label: '周一', value: 234 },
        { label: '周二', value: 267 },
        { label: '周三', value: 298 },
        { label: '周四', value: 312 },
        { label: '周五', value: 289 },
        { label: '周六', value: 156 },
        { label: '周日', value: 178 }
      ],
      hourly: [
        { label: '8:00', value: 45 },
        { label: '10:00', value: 89 },
        { label: '12:00', value: 67 },
        { label: '14:00', value: 156 },
        { label: '16:00', value: 234 },
        { label: '18:00', value: 198 },
        { label: '20:00', value: 267 },
        { label: '22:00', value: 123 }
      ]
    },
    coursePopularity: [
      { label: 'STM32基础', value: 320, color: '#3B82F6' },
      { label: 'ARM架构', value: 280, color: '#10B981' },
      { label: 'C语言编程', value: 250, color: '#F59E0B' },
      { label: '嵌入式系统', value: 200, color: '#EF4444' },
      { label: '单片机应用', value: 180, color: '#8B5CF6' },
      { label: '其他课程', value: 120, color: '#6B7280' }
    ],
    deviceUsage: [
      { label: '桌面端', value: 45, color: '#3B82F6' },
      { label: '移动端', value: 35, color: '#10B981' },
      { label: '平板端', value: 20, color: '#F59E0B' }
    ],
    userEngagement: [
      { label: '视频观看', value: 85 },
      { label: '作业提交', value: 78 },
      { label: '讨论参与', value: 65 },
      { label: '实验完成', value: 72 },
      { label: '测试参与', value: 68 }
    ],
    contentConsumption: [
      { label: '1月', value: 1250 },
      { label: '2月', value: 1380 },
      { label: '3月', value: 1520 },
      { label: '4月', value: 1680 },
      { label: '5月', value: 1850 }
    ],
    regionDistribution: [
      { label: '华北', value: 28, color: '#3B82F6' },
      { label: '华东', value: 25, color: '#10B981' },
      { label: '华南', value: 18, color: '#F59E0B' },
      { label: '华中', value: 15, color: '#EF4444' },
      { label: '西南', value: 8, color: '#8B5CF6' },
      { label: '其他', value: 6, color: '#6B7280' }
    ]
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoading(false);
    };
    loadData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">加载运营数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 用户活跃度分析 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* 标题区域 */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">用户活跃度分析</h2>
                <p className="text-gray-600 mt-1">用户行为模式和活跃度趋势分析</p>
              </div>
            </div>
            
            {/* 时间范围选择器 */}
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl p-2">
              {[
                { key: '7d', label: '7天' },
                { key: '30d', label: '30天' },
                { key: '90d', label: '90天' }
              ].map(option => (
                <button
                  key={option.key}
                  onClick={() => setTimeRange(option.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    timeRange === option.key
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 活跃度图表 */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 每日活跃用户 */}
            <div>
              <BarChart 
                data={mockOperationalData.userActivity.daily.map(item => ({
                  ...item,
                  color: '#8B5CF6'
                }))}
                title="每日活跃用户"
                height={250}
              />
            </div>

            {/* 小时活跃度分布 */}
            <div>
              <LineChart 
                data={mockOperationalData.userActivity.hourly}
                title="小时活跃度分布"
                color="#10B981"
                height={250}
              />
            </div>
          </div>

          {/* 用户参与度指标 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 参与度雷达图 */}
            <div>
              <RadarChart 
                data={mockOperationalData.userEngagement}
                title="用户参与度指标"
                size={300}
                maxValue={100}
              />
            </div>

            {/* 设备使用分布 */}
            <div>
              <DonutChart 
                data={mockOperationalData.deviceUsage}
                title="设备使用分布"
                size={300}
                centerText="100%"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 课程热度分析 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* 标题区域 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">课程热度分析</h2>
              <p className="text-gray-600 mt-1">课程受欢迎程度和内容消费趋势</p>
            </div>
          </div>
        </div>

        {/* 课程热度图表 */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 课程受欢迎程度 */}
            <div>
              <PieChart 
                data={mockOperationalData.coursePopularity}
                title="课程受欢迎程度"
                size={300}
              />
            </div>

            {/* 内容消费趋势 */}
            <div>
              <LineChart 
                data={mockOperationalData.contentConsumption}
                title="内容消费趋势（小时）"
                color="#10B981"
                height={250}
              />
            </div>
          </div>

          {/* 热门课程排行榜 */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">热门课程排行榜</h3>
            <div className="space-y-4">
              {[
                { rank: 1, name: 'STM32基础入门', students: 320, growth: '+15%', category: '嵌入式' },
                { rank: 2, name: 'ARM架构原理', students: 280, growth: '+12%', category: '硬件' },
                { rank: 3, name: 'C语言程序设计', students: 250, growth: '+8%', category: '编程' },
                { rank: 4, name: '嵌入式系统设计', students: 200, growth: '+5%', category: '系统' },
                { rank: 5, name: '单片机应用开发', students: 180, growth: '+3%', category: '应用' }
              ].map((course, index) => (
                <div key={index} className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      course.rank === 1 ? 'bg-yellow-500' :
                      course.rank === 2 ? 'bg-gray-400' :
                      course.rank === 3 ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}>
                      {course.rank}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{course.name}</div>
                      <div className="text-sm text-gray-600">{course.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{course.students}人</div>
                    <div className="text-sm text-green-600">{course.growth}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 地域分布分析 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* 标题区域 */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🌍</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">地域分布分析</h2>
              <p className="text-gray-600 mt-1">用户地理分布和区域活跃度</p>
            </div>
          </div>
        </div>

        {/* 地域分布图表 */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 地域分布饼图 */}
            <div>
              <PieChart 
                data={mockOperationalData.regionDistribution}
                title="用户地域分布"
                size={300}
              />
            </div>

            {/* 地域活跃度排行 */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">地域活跃度排行</h3>
              <div className="space-y-3">
                {mockOperationalData.regionDistribution.map((region, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: region.color }}
                      ></div>
                      <span className="font-medium text-gray-900">{region.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${region.value * 3}%`,
                            backgroundColor: region.color
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{region.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOperationalDashboard;
