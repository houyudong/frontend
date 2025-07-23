/**
 * 通知功能演示页面
 * 
 * 展示教师和管理员的通知搜索和编辑功能
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../pages/layout/MainLayout';
import EnhancedNotificationCenter from '../components/EnhancedNotificationCenter';

const NotificationDemoPage: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher' | 'admin'>('teacher');

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
                首页
              </Link>
            </li>
            <li className="flex items-center" aria-current="page">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="font-medium text-gray-900">通知功能演示</span>
            </li>
          </ol>
        </nav>

        {/* 功能介绍 - 更现代化的设计 */}
        <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>

          <div className="relative">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🔔</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  通知系统增强功能
                </h1>
                <p className="text-gray-700 text-lg">
                  全新美化界面，强大的通知搜索和编辑功能，支持精确的目标受众选择
                </p>
              </div>
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">🔍 高级搜索功能</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 按通知类型、优先级、状态筛选</li>
                <li>• 支持关键词搜索标题和内容</li>
                <li>• 时间范围筛选</li>
                <li>• 多种排序方式</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">✏️ 智能编辑功能</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 分步骤创建通知</li>
                <li>• 精确选择目标受众</li>
                <li>• 支持院系、班级、个人选择</li>
                <li>• 通知模板和定时发送</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">📊 美观界面设计</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 现代化渐变设计</li>
                <li>• 统计仪表板</li>
                <li>• 快速发送浮动按钮</li>
                <li>• 模板管理系统</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 角色切换 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">选择角色体验</h2>
          <div className="flex space-x-4">
            {[
              { role: 'student' as const, label: '学生用户', color: 'bg-green-100 text-green-700', description: '只能接收通知' },
              { role: 'teacher' as const, label: '教师用户', color: 'bg-blue-100 text-blue-700', description: '可以发送和管理通知' },
              { role: 'admin' as const, label: '管理员用户', color: 'bg-red-100 text-red-700', description: '具有最高权限' }
            ].map(({ role, label, color, description }) => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  currentRole === role 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${color}`}>
                  {label}
                </div>
                <p className="text-sm text-gray-600">{description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 功能特性说明 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">智能搜索</h3>
            </div>
            <p className="text-sm text-gray-600">
              支持多维度搜索筛选，快速找到需要的通知。包括类型筛选、优先级筛选、时间范围等。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">精准投送</h3>
            </div>
            <p className="text-sm text-gray-600">
              支持按院系、班级、个人精确选择通知接收者，确保信息准确传达给目标用户。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">便捷编辑</h3>
            </div>
            <p className="text-sm text-gray-600">
              分步骤的通知创建流程，支持模板使用、定时发送、过期设置等高级功能。
            </p>
          </div>
        </div>

        {/* 通知中心组件 */}
        {currentRole === 'student' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <span className="text-6xl">👨‍🎓</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">学生用户界面</h3>
            <p className="text-gray-600 mb-6">
              学生用户只能接收和查看通知，无法发送通知。请切换到教师或管理员角色体验完整功能。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-medium text-green-800 mb-1">✅ 可以做的</div>
                <ul className="text-green-700 space-y-1">
                  <li>• 接收通知</li>
                  <li>• 查看通知</li>
                  <li>• 标记已读</li>
                  <li>• 删除通知</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="font-medium text-red-800 mb-1">❌ 不能做的</div>
                <ul className="text-red-700 space-y-1">
                  <li>• 发送通知</li>
                  <li>• 创建模板</li>
                  <li>• 批量操作</li>
                  <li>• 查看统计</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="font-medium text-blue-800 mb-1">💡 建议</div>
                <ul className="text-blue-700 space-y-1">
                  <li>• 切换到教师角色</li>
                  <li>• 体验发送功能</li>
                  <li>• 查看统计数据</li>
                  <li>• 使用快速模板</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <EnhancedNotificationCenter
            userRole={currentRole}
            userId={`${currentRole}_demo_001`}
          />
        )}

        {/* 使用说明 */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-800 mb-3">💡 使用提示</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
            <div>
              <h4 className="font-medium mb-2">教师用户功能：</h4>
              <ul className="space-y-1">
                <li>• 点击右下角按钮创建通知</li>
                <li>• 使用搜索筛选功能查找通知</li>
                <li>• 可以编辑自己发送的通知</li>
                <li>• 支持选择班级和课程学生</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">管理员用户功能：</h4>
              <ul className="space-y-1">
                <li>• 具有最高权限，可发送系统通知</li>
                <li>• 支持使用通知模板</li>
                <li>• 可以向所有用户发送通知</li>
                <li>• 支持按院系、角色精确投送</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationDemoPage;
