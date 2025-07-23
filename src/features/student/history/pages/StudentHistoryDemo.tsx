/**
 * 学生学习历史演示页面
 * 
 * 展示美化后的学生学习历史功能和图表展示
 */

import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';

const StudentHistoryDemo: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/student/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                学生首页
              </Link>
            </li>
            <li className="flex items-center" aria-current="page">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="font-medium text-gray-900">学习历史分析演示</span>
            </li>
          </ol>
        </nav>

        {/* 功能介绍 */}
        <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">📚</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  学习历史分析
                </h1>
                <p className="text-gray-700 text-lg">
                  美化的学习数据可视化界面，个人成长轨迹和学习成就展示
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">📈 学习概览</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 学习统计指标展示</li>
                  <li>• 进度趋势分析</li>
                  <li>• 学习时长统计</li>
                  <li>• 技能发展雷达图</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">📚 课程学习</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 课程完成情况</li>
                  <li>• 学习进度分布</li>
                  <li>• 课程详细分析</li>
                  <li>• 学习效果评估</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">🧪 实验记录</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 实验活动统计</li>
                  <li>• 实验时长分析</li>
                  <li>• 实验成果展示</li>
                  <li>• 操作技能评估</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-orange-900 mb-2">🏆 成就徽章</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 学习成就展示</li>
                  <li>• 里程碑记录</li>
                  <li>• 技能认证</li>
                  <li>• 激励系统</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 功能特性详解 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">学习数据可视化</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>学习进度趋势：</strong>线性图展示学习进度变化</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span><strong>课程完成分布：</strong>环形图显示各课程完成情况</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>技能发展雷达：</strong>多维度技能水平评估</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>学习时长统计：</strong>每周学习时间分布</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">个性化分析</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>个人成长轨迹：</strong>记录学习历程和重要节点</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span><strong>学习习惯分析：</strong>识别学习模式和偏好</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>成就系统：</strong>激励学习动机和目标达成</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>智能建议：</strong>基于数据的学习建议</span>
              </div>
            </div>
          </div>
        </div>

        {/* 图表类型展示 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">📊 支持的图表类型</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: '线性图表', icon: '📈', desc: '进度趋势', color: 'from-blue-500 to-blue-600' },
              { name: '柱状图表', icon: '📊', desc: '时长统计', color: 'from-green-500 to-green-600' },
              { name: '饼图', icon: '🥧', desc: '活动分布', color: 'from-yellow-500 to-yellow-600' },
              { name: '环形图', icon: '🍩', desc: '完成情况', color: 'from-purple-500 to-purple-600' },
              { name: '雷达图', icon: '🎯', desc: '技能评估', color: 'from-pink-500 to-pink-600' }
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

        {/* 成就系统展示 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">🏆 成就系统预览</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: '学习新手', desc: '完成第一个课程', icon: '🌟', earned: true, color: 'from-yellow-400 to-orange-500' },
              { name: '实验达人', desc: '完成10个实验', icon: '🧪', earned: true, color: 'from-purple-400 to-pink-500' },
              { name: '编程高手', desc: '编程作业满分', icon: '💻', earned: true, color: 'from-blue-400 to-indigo-500' },
              { name: '持续学习', desc: '连续学习7天', icon: '🔥', earned: true, color: 'from-red-400 to-orange-500' },
              { name: '知识探索者', desc: '学习5门课程', icon: '🎓', earned: false, color: 'from-green-400 to-emerald-500' },
              { name: '完美主义者', desc: '所有作业满分', icon: '💯', earned: false, color: 'from-indigo-400 to-purple-500' }
            ].map((achievement, index) => (
              <div key={index} className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                achievement.earned 
                  ? `border-yellow-200 bg-gradient-to-br ${achievement.color} text-white` 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="text-center">
                  <div className={`text-4xl mb-2 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <h4 className={`font-semibold mb-1 ${
                    achievement.earned ? 'text-white' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </h4>
                  <p className={`text-sm ${
                    achievement.earned ? 'text-white/90' : 'text-gray-400'
                  }`}>
                    {achievement.desc}
                  </p>
                  {achievement.earned && (
                    <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                      已获得
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            💡 使用说明
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">如何使用学习历史分析：</h4>
              <ul className="space-y-1">
                <li>• 点击下方"查看学习历史"按钮</li>
                <li>• 选择不同的分析标签页</li>
                <li>• 查看个人学习数据和图表</li>
                <li>• 收集成就徽章和里程碑</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">功能特色：</h4>
              <ul className="space-y-1">
                <li>• 个性化学习轨迹记录</li>
                <li>• 多维度数据可视化展示</li>
                <li>• 激励性成就系统</li>
                <li>• 美观的界面设计和动画</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 快速访问 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 快速访问</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/student/history"
              className="block p-6 bg-white rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">查看学习历史</h4>
                  <p className="text-sm text-gray-600">体验完整的学习历史分析功能</p>
                </div>
              </div>
            </Link>

            <Link
              to="/student/dashboard"
              className="block p-6 bg-white rounded-xl border border-indigo-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span className="text-2xl">🏠</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">返回学生首页</h4>
                  <p className="text-sm text-gray-600">回到学生控制面板</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentHistoryDemo;
