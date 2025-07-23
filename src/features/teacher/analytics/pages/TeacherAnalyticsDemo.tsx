/**
 * 教师数据分析演示页面
 * 
 * 展示美化后的教师数据分析功能和图表展示
 */

import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';

const TeacherAnalyticsDemo: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/teacher/dashboard" className="text-gray-600 hover:text-green-600 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                教师首页
              </Link>
            </li>
            <li className="flex items-center" aria-current="page">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="font-medium text-gray-900">教学数据分析演示</span>
            </li>
          </ol>
        </nav>

        {/* 功能介绍 */}
        <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-8 mb-8 overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-teal-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-200/30 to-cyan-200/30 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">📊</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  教学数据分析
                </h1>
                <p className="text-gray-700 text-lg">
                  美化的教学数据可视化界面，丰富的图表展示和学生分析
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">📈 数据概览</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 核心教学指标展示</li>
                  <li>• 学生进度趋势分析</li>
                  <li>• 教学效果可视化</li>
                  <li>• 实时数据更新</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">📚 课程分析</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 课程完成率统计</li>
                  <li>• 学习进度分布</li>
                  <li>• 课程难度分析</li>
                  <li>• 学生参与度评估</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">🧪 实验分析</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 实验成功率统计</li>
                  <li>• 实验时长分析</li>
                  <li>• 错误模式识别</li>
                  <li>• 实验难度评估</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-orange-900 mb-2">👥 学生分析</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 学生表现排行</li>
                  <li>• 学习行为分析</li>
                  <li>• 个性化建议</li>
                  <li>• 学习轨迹追踪</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 功能特性详解 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">教学图表可视化</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span><strong>学生进度趋势：</strong>线性图展示学生学习进度变化</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>课程完成分布：</strong>饼图显示各课程完成情况</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>教学指标雷达：</strong>多维度教学效果评估</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>活跃度柱状图：</strong>每周学生活跃度统计</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">智能分析功能</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span><strong>时间范围筛选：</strong>支持7天、30天、90天数据分析</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>交互式图表：</strong>悬停显示详细数据信息</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>学生排行榜：</strong>自动生成学生表现排行</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>实时更新：</strong>数据自动刷新和状态同步</span>
              </div>
            </div>
          </div>
        </div>

        {/* 图表类型展示 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">📊 支持的图表类型</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: '线性图表', icon: '📈', desc: '进度趋势', color: 'from-green-500 to-green-600' },
              { name: '柱状图表', icon: '📊', desc: '活跃度对比', color: 'from-blue-500 to-blue-600' },
              { name: '饼图', icon: '🥧', desc: '完成率分布', color: 'from-yellow-500 to-yellow-600' },
              { name: '环形图', icon: '🍩', desc: '课程分布', color: 'from-purple-500 to-purple-600' },
              { name: '雷达图', icon: '🎯', desc: '教学指标', color: 'from-pink-500 to-pink-600' }
            ].map((chart, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${chart.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <span className="text-2xl">{chart.icon}</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{chart.name}</h4>
                <p className="text-sm text-gray-600">{chart.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-green-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            💡 使用说明
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-green-700">
            <div>
              <h4 className="font-medium mb-2">如何使用教学数据分析：</h4>
              <ul className="space-y-1">
                <li>• 点击下方"进入数据分析"按钮</li>
                <li>• 选择不同的分析标签页</li>
                <li>• 使用时间范围筛选器</li>
                <li>• 悬停图表查看详细数据</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">功能特色：</h4>
              <ul className="space-y-1">
                <li>• 响应式设计，支持各种屏幕</li>
                <li>• 交互式图表，支持缩放和筛选</li>
                <li>• 实时数据更新和状态监控</li>
                <li>• 美观的渐变色彩和动画效果</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 快速访问 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 快速访问</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/teacher/analytics"
              className="block p-6 bg-white rounded-xl border border-green-200 hover:border-green-300 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">进入教学数据分析</h4>
                  <p className="text-sm text-gray-600">体验完整的教学数据分析功能</p>
                </div>
              </div>
            </Link>

            <Link
              to="/teacher/dashboard"
              className="block p-6 bg-white rounded-xl border border-emerald-200 hover:border-emerald-300 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span className="text-2xl">🏠</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">返回教师首页</h4>
                  <p className="text-sm text-gray-600">回到教师控制面板</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeacherAnalyticsDemo;
