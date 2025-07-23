/**
 * 搜索框演示页面
 * 
 * 展示优化后的搜索框功能和特性
 */

import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../pages/layout/MainLayout';

const SearchBoxDemo: React.FC = () => {
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
              <span className="font-medium text-gray-900">智能搜索框演示</span>
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
                <span className="text-3xl">🔍</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  智能搜索框
                </h1>
                <p className="text-gray-700 text-lg">
                  美观且实用的搜索体验，支持智能建议、历史记录和高级筛选
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">🎯 智能建议</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 实时搜索建议</li>
                  <li>• 热门搜索推荐</li>
                  <li>• 搜索历史记录</li>
                  <li>• 智能关键词匹配</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-2">⚡ 快捷筛选</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 快捷筛选标签</li>
                  <li>• 一键应用筛选</li>
                  <li>• 筛选结果统计</li>
                  <li>• 清除所有筛选</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">🔧 高级筛选</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 多维度筛选器</li>
                  <li>• 可折叠筛选面板</li>
                  <li>• 筛选条件组合</li>
                  <li>• 筛选状态保存</li>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">搜索体验优化</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>实时建议：</strong>输入时显示相关搜索建议</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong>搜索历史：</strong>自动保存最近搜索记录</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>热门推荐：</strong>显示热门搜索关键词</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-pink-500 font-bold">•</span>
                <span><strong>键盘导航：</strong>支持键盘快捷操作</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">筛选功能增强</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>快捷标签：</strong>一键应用常用筛选条件</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong>高级筛选：</strong>多维度筛选器组合</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>结果统计：</strong>实时显示筛选结果数量</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-pink-500 font-bold">•</span>
                <span><strong>状态管理：</strong>筛选状态持久化保存</span>
              </div>
            </div>
          </div>
        </div>

        {/* 主题色彩展示 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">🎨 主题色彩适配</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: '蓝色主题', theme: 'blue', desc: '课程搜索', color: 'from-blue-500 to-blue-600', bg: 'from-blue-50 to-blue-100' },
              { name: '紫色主题', theme: 'purple', desc: '实验搜索', color: 'from-purple-500 to-purple-600', bg: 'from-purple-50 to-purple-100' },
              { name: '绿色主题', theme: 'green', desc: '资源搜索', color: 'from-green-500 to-green-600', bg: 'from-green-50 to-green-100' },
              { name: '靛蓝主题', theme: 'indigo', desc: '通用搜索', color: 'from-indigo-500 to-indigo-600', bg: 'from-indigo-50 to-indigo-100' }
            ].map((theme, index) => (
              <div key={index} className={`p-4 rounded-xl bg-gradient-to-br ${theme.bg} border border-white/50`}>
                <div className="text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${theme.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{theme.name}</h4>
                  <p className="text-sm text-gray-600">{theme.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 使用场景 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">📍 使用场景</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-blue-600 text-sm">📚</span>
                </span>
                课程搜索场景
              </h4>
              <ul className="text-sm text-gray-600 space-y-2 ml-8">
                <li>• 按课程名称、描述搜索</li>
                <li>• 按难度等级筛选</li>
                <li>• 按学习状态筛选</li>
                <li>• 热门课程快捷访问</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-purple-600 text-sm">🧪</span>
                </span>
                实验搜索场景
              </h4>
              <ul className="text-sm text-gray-600 space-y-2 ml-8">
                <li>• 按实验名称、标签搜索</li>
                <li>• 按实验类型筛选</li>
                <li>• 按难度等级筛选</li>
                <li>• 相关实验推荐</li>
              </ul>
            </div>
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
              <h4 className="font-medium mb-2">如何使用智能搜索：</h4>
              <ul className="space-y-1">
                <li>• 在搜索框中输入关键词</li>
                <li>• 点击搜索建议快速选择</li>
                <li>• 使用快捷筛选标签</li>
                <li>• 展开高级筛选设置</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">功能特色：</h4>
              <ul className="space-y-1">
                <li>• 响应式设计适配各种设备</li>
                <li>• 搜索历史自动保存</li>
                <li>• 键盘快捷键支持</li>
                <li>• 主题色彩自动适配</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 快速访问 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 体验搜索功能</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/student/courses"
              className="block p-6 bg-white rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">课程搜索体验</h4>
                  <p className="text-sm text-gray-600">体验课程搜索和筛选功能</p>
                </div>
              </div>
            </Link>

            <Link
              to="/student/experiments"
              className="block p-6 bg-white rounded-xl border border-purple-200 hover:border-purple-300 transition-all duration-200 hover:shadow-lg group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span className="text-2xl">🧪</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">实验搜索体验</h4>
                  <p className="text-sm text-gray-600">体验实验搜索和筛选功能</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchBoxDemo;
