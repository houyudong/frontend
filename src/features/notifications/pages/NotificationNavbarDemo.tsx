/**
 * 通知导航栏功能演示页面
 * 
 * 展示顶部导航栏中的通知功能
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../pages/layout/MainLayout';

const NotificationNavbarDemo: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher' | 'admin'>('student');

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
              <span className="font-medium text-gray-900">导航栏通知功能演示</span>
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
                <span className="text-3xl">🔔</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  导航栏通知功能
                </h1>
                <p className="text-gray-700 text-lg">
                  顶部导航栏集成的通知中心入口，支持实时提醒和快速访问
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">🔔 实时通知图标</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 显示未读通知数量</li>
                  <li>• 紧急通知红色指示</li>
                  <li>• 新通知动画提醒</li>
                  <li>• 角色主题色彩</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">📋 下拉通知列表</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 最近通知预览</li>
                  <li>• 快速标记已读</li>
                  <li>• 优先级颜色区分</li>
                  <li>• 一键跳转详情</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">🎯 智能提示Toast</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 新通知弹出提示</li>
                  <li>• 优先级自动显示时长</li>
                  <li>• 快速操作按钮</li>
                  <li>• 优雅动画效果</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 功能特性说明 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">通知图标功能</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>未读数量徽章：</strong>显示未读通知数量，超过99显示99+</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span><strong>紧急通知指示：</strong>红色脉冲动画提示紧急通知</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>角色主题色：</strong>学生绿色、教师蓝色、管理员红色</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>动画反馈：</strong>新通知到达时的弹跳动画</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">下拉菜单功能</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>最近通知：</strong>显示最新的4条通知预览</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span><strong>快速操作：</strong>点击通知标记已读，查看详情</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>优先级标识：</strong>不同颜色标签区分通知重要性</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>一键跳转：</strong>底部按钮直接进入通知中心</span>
              </div>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="font-semibold text-yellow-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            💡 使用说明
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-yellow-700">
            <div>
              <h4 className="font-medium mb-2">如何使用通知功能：</h4>
              <ul className="space-y-1">
                <li>• 查看顶部导航栏右侧的通知图标</li>
                <li>• 点击图标查看下拉通知列表</li>
                <li>• 点击通知项目标记为已读</li>
                <li>• 点击"查看所有通知"进入通知中心</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">通知提示说明：</h4>
              <ul className="space-y-1">
                <li>• 新通知会在右上角弹出Toast提示</li>
                <li>• 紧急通知显示时间更长</li>
                <li>• 可以点击Toast快速查看或标记已读</li>
                <li>• 系统会定期检查新通知（每30秒）</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 角色权限说明 */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">👥 不同角色的通知功能</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-green-200 rounded-xl p-4 bg-green-50">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">👨‍🎓</span>
                <h4 className="font-semibold text-green-800">学生用户</h4>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 接收课程通知</li>
                <li>• 接收作业提醒</li>
                <li>• 接收成绩通知</li>
                <li>• 接收系统公告</li>
              </ul>
            </div>

            <div className="border border-blue-200 rounded-xl p-4 bg-blue-50">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">👨‍🏫</span>
                <h4 className="font-semibold text-blue-800">教师用户</h4>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 接收教学通知</li>
                <li>• 接收学生反馈</li>
                <li>• 接收系统更新</li>
                <li>• 发送通知给学生</li>
              </ul>
            </div>

            <div className="border border-red-200 rounded-xl p-4 bg-red-50">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">👨‍💼</span>
                <h4 className="font-semibold text-red-800">管理员用户</h4>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• 接收系统警报</li>
                <li>• 接收安全通知</li>
                <li>• 发送系统公告</li>
                <li>• 管理全平台通知</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 技术特性 */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">⚡ 技术特性</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">🔄 实时更新</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• WebSocket连接（模拟）</li>
                <li>• 30秒定期轮询</li>
                <li>• 实时未读数量更新</li>
                <li>• 新通知动画提示</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-3">🎨 用户体验</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 响应式设计</li>
                <li>• 平滑动画过渡</li>
                <li>• 角色主题色彩</li>
                <li>• 优雅的Toast提示</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationNavbarDemo;
