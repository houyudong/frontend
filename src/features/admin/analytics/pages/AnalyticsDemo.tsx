/**
 * 管理员数据分析演示页面
 * 
 * 展示美化后的数据分析功能和图表展示
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';

const AnalyticsDemo: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/admin/dashboard" className="text-gray-600 hover:text-red-600 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                管理员首页
              </Link>
            </li>
            <li className="flex items-center" aria-current="page">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="font-medium text-gray-900">数据分析演示</span>
            </li>
          </ol>
        </nav>

        {/* 功能介绍 */}
        <div className="relative bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 rounded-2xl p-8 mb-8 overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/30 to-indigo-200/30 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">📊</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  管理员数据分析
                </h1>
                <p className="text-gray-700 text-lg">
                  美化的数据可视化界面，丰富的图表展示和实时监控
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-red-900 mb-2">📈 数据概览</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 核心指标卡片展示</li>
                  <li>• 多维度图表分析</li>
                  <li>• 趋势变化可视化</li>
                  <li>• 实时数据更新</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-pink-200">
                <h3 className="font-semibold text-pink-900 mb-2">⚠️ 学习行为分析</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 挂科风险预测模型</li>
                  <li>• 多维度风险因子分析</li>
                  <li>• 教师评估看板</li>
                  <li>• 学生行为模式识别</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">📋 运营数据分析</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 用户活跃度分析</li>
                  <li>• 课程热度统计</li>
                  <li>• 地域分布可视化</li>
                  <li>• 设备使用情况</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-2">🖥️ 实时监控</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 实时系统状态监控</li>
                  <li>• 在线用户动态追踪</li>
                  <li>• 服务器性能指标</li>
                  <li>• 活动日志实时展示</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 功能特性详解 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">图表可视化</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>线性图表：</strong>展示趋势变化，支持多数据系列</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-pink-500 font-bold">•</span>
                <span><strong>柱状图表：</strong>对比数据差异，支持分组显示</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>饼图/环形图：</strong>展示数据占比和分布情况</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong>雷达图：</strong>多维度指标对比分析</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">实时功能</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>实时数据更新：</strong>每3秒自动刷新关键指标</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-pink-500 font-bold">•</span>
                <span><strong>状态监控：</strong>系统健康状态实时展示</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>活动日志：</strong>用户操作和系统事件追踪</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong>告警提示：</strong>异常情况自动高亮显示</span>
              </div>
            </div>
          </div>
        </div>

        {/* 图表类型展示 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">📊 支持的图表类型</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: '线性图表', icon: '📈', desc: '趋势分析', color: 'from-blue-500 to-blue-600' },
              { name: '柱状图表', icon: '📊', desc: '数据对比', color: 'from-green-500 to-green-600' },
              { name: '饼图', icon: '🥧', desc: '占比分析', color: 'from-yellow-500 to-yellow-600' },
              { name: '环形图', icon: '🍩', desc: '分布展示', color: 'from-purple-500 to-purple-600' },
              { name: '雷达图', icon: '🎯', desc: '多维对比', color: 'from-pink-500 to-pink-600' }
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
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-yellow-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            💡 使用说明
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-yellow-700">
            <div>
              <h4 className="font-medium mb-2">如何使用数据分析功能：</h4>
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
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 快速访问</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/analytics"
              className="block p-6 bg-white rounded-xl border border-red-200 hover:border-red-300 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">进入数据分析</h4>
                  <p className="text-sm text-gray-600">体验完整的数据分析功能</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/dashboard"
              className="block p-6 bg-white rounded-xl border border-pink-200 hover:border-pink-300 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span className="text-2xl">🏠</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors">返回管理员首页</h4>
                  <p className="text-sm text-gray-600">回到管理员控制面板</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AnalyticsDemo;
