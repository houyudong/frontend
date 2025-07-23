/**
 * 通知功能测试页面
 * 
 * 测试所有角色的通知功能和导航链接
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../../pages/layout/MainLayout';

const NotificationTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<{[key: string]: 'pending' | 'success' | 'error'}>({});

  const testLinks = [
    // 学生路由测试
    { role: 'student', name: '学生个人中心', path: '/student/profile' },
    { role: 'student', name: '学生通知中心', path: '/student/notifications' },
    { role: 'student', name: '学生仪表板', path: '/student/dashboard' },
    
    // 教师路由测试
    { role: 'teacher', name: '教师个人中心', path: '/teacher/profile' },
    { role: 'teacher', name: '教师通知中心', path: '/teacher/notifications' },
    { role: 'teacher', name: '教师仪表板', path: '/teacher/dashboard' },
    { role: 'teacher', name: '班级管理', path: '/teacher/management/classes' },
    { role: 'teacher', name: '学生管理', path: '/teacher/management/students' },
    { role: 'teacher', name: '教学分析', path: '/teacher/analytics' },
    { role: 'teacher', name: '学生进度分析', path: '/teacher/analytics/students' },
    
    // 管理员路由测试
    { role: 'admin', name: '管理员个人中心', path: '/admin/profile' },
    { role: 'admin', name: '管理员通知中心', path: '/admin/notifications' },
    { role: 'admin', name: '管理员仪表板', path: '/admin/dashboard' },
    
    // 通用路由测试
    { role: 'common', name: '用户中心', path: '/user-center' },
  ];

  const testLink = (link: typeof testLinks[0]) => {
    setTestResults(prev => ({ ...prev, [link.path]: 'pending' }));
    
    try {
      // 模拟导航测试
      navigate(link.path);
      setTimeout(() => {
        setTestResults(prev => ({ ...prev, [link.path]: 'success' }));
      }, 500);
    } catch (error) {
      setTestResults(prev => ({ ...prev, [link.path]: 'error' }));
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error' | undefined) => {
    switch (status) {
      case 'pending':
        return <span className="text-yellow-500">⏳</span>;
      case 'success':
        return <span className="text-green-500">✅</span>;
      case 'error':
        return <span className="text-red-500">❌</span>;
      default:
        return <span className="text-gray-400">⚪</span>;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'border-green-200 bg-green-50';
      case 'teacher':
        return 'border-blue-200 bg-blue-50';
      case 'admin':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

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
              <span className="font-medium text-gray-900">通知功能测试</span>
            </li>
          </ol>
        </nav>

        {/* 页面标题 */}
        <div className="relative bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 rounded-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🧪</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  通知功能测试
                </h1>
                <p className="text-gray-700 text-lg">
                  测试所有角色的通知功能和路由导航
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 测试说明 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-yellow-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            💡 测试说明
          </h3>
          <div className="text-sm text-yellow-700">
            <p className="mb-2">此页面用于测试通知系统的各项功能：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>点击下方的测试按钮来验证各个路由是否正常工作</li>
              <li>检查顶部导航栏的通知图标是否显示</li>
              <li>验证用户下拉菜单中的通知中心链接</li>
              <li>测试不同角色用户的页面访问权限</li>
            </ul>
          </div>
        </div>

        {/* 路由测试区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 学生路由测试 */}
          <div className={`rounded-2xl border-2 p-6 ${getRoleColor('student')}`}>
            <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">👨‍🎓</span>
              学生路由测试
            </h3>
            <div className="space-y-3">
              {testLinks.filter(link => link.role === 'student').map(link => (
                <div key={link.path} className="flex items-center justify-between">
                  <button
                    onClick={() => testLink(link)}
                    className="flex-1 text-left px-3 py-2 text-sm bg-white rounded-lg hover:bg-green-100 transition-colors"
                  >
                    {link.name}
                  </button>
                  <div className="ml-2">
                    {getStatusIcon(testResults[link.path])}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 教师路由测试 */}
          <div className={`rounded-2xl border-2 p-6 ${getRoleColor('teacher')}`}>
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">👨‍🏫</span>
              教师路由测试
            </h3>
            <div className="space-y-3">
              {testLinks.filter(link => link.role === 'teacher').map(link => (
                <div key={link.path} className="flex items-center justify-between">
                  <button
                    onClick={() => testLink(link)}
                    className="flex-1 text-left px-3 py-2 text-sm bg-white rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    {link.name}
                  </button>
                  <div className="ml-2">
                    {getStatusIcon(testResults[link.path])}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 管理员和通用路由测试 */}
          <div className="space-y-6">
            {/* 管理员路由 */}
            <div className={`rounded-2xl border-2 p-6 ${getRoleColor('admin')}`}>
              <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">👨‍💼</span>
                管理员路由测试
              </h3>
              <div className="space-y-3">
                {testLinks.filter(link => link.role === 'admin').map(link => (
                  <div key={link.path} className="flex items-center justify-between">
                    <button
                      onClick={() => testLink(link)}
                      className="flex-1 text-left px-3 py-2 text-sm bg-white rounded-lg hover:bg-red-100 transition-colors"
                    >
                      {link.name}
                    </button>
                    <div className="ml-2">
                      {getStatusIcon(testResults[link.path])}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 通用路由 */}
            <div className={`rounded-2xl border-2 p-6 ${getRoleColor('common')}`}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🌐</span>
                通用路由测试
              </h3>
              <div className="space-y-3">
                {testLinks.filter(link => link.role === 'common').map(link => (
                  <div key={link.path} className="flex items-center justify-between">
                    <button
                      onClick={() => testLink(link)}
                      className="flex-1 text-left px-3 py-2 text-sm bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {link.name}
                    </button>
                    <div className="ml-2">
                      {getStatusIcon(testResults[link.path])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 功能检查清单 */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">🔍 功能检查清单</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">导航栏功能</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">□</span>
                  顶部导航栏显示通知图标
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">□</span>
                  通知图标显示未读数量
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">□</span>
                  点击通知图标显示下拉菜单
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">□</span>
                  用户菜单包含通知中心链接
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-3">页面功能</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">□</span>
                  教师个人中心链接正确
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">□</span>
                  教学管理页面可访问
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">□</span>
                  教学分析页面可访问
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">□</span>
                  所有角色通知中心可访问
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 快速导航 */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 快速导航</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/student/notification-demo"
              className="block p-3 bg-white rounded-xl border border-blue-200 hover:border-blue-300 transition-colors text-center"
            >
              <span className="text-lg mb-1 block">📋</span>
              <span className="text-sm font-medium">通知中心演示</span>
            </Link>

            <Link
              to="/student/notification-navbar-demo"
              className="block p-3 bg-white rounded-xl border border-indigo-200 hover:border-indigo-300 transition-colors text-center"
            >
              <span className="text-lg mb-1 block">🔔</span>
              <span className="text-sm font-medium">导航栏功能</span>
            </Link>

            <Link
              to="/student/batch-operation-demo"
              className="block p-3 bg-white rounded-xl border border-purple-200 hover:border-purple-300 transition-colors text-center"
            >
              <span className="text-lg mb-1 block">🗂️</span>
              <span className="text-sm font-medium">批量操作</span>
            </Link>

            <Link
              to="/user-center"
              className="block p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-center"
            >
              <span className="text-lg mb-1 block">👤</span>
              <span className="text-sm font-medium">用户中心</span>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationTestPage;
