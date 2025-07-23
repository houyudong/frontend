/**
 * 批量操作功能演示页面
 * 
 * 展示通知系统的批量删除和管理功能
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../pages/layout/MainLayout';

const BatchOperationDemo: React.FC = () => {
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
              <span className="font-medium text-gray-900">批量操作功能演示</span>
            </li>
          </ol>
        </nav>

        {/* 功能介绍 */}
        <div className="relative bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-8 mb-8 overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🗂️</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  批量操作功能
                </h1>
                <p className="text-gray-700 text-lg">
                  高效的通知批量管理，支持多选、筛选和安全删除
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">✅ 智能多选</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 全选/取消全选功能</li>
                  <li>• 单个通知选择切换</li>
                  <li>• 实时选择数量统计</li>
                  <li>• 筛选条件下的全选</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-2">🛠️ 批量操作</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 批量标记已读/未读</li>
                  <li>• 批量删除选中通知</li>
                  <li>• 删除所有已读通知</li>
                  <li>• 删除当前筛选结果</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">🔒 安全确认</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 删除前二次确认</li>
                  <li>• 危险操作输入确认</li>
                  <li>• 操作统计信息展示</li>
                  <li>• 防误操作保护</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 功能特性详解 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">多选功能</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>全选按钮：</strong>一键选择当前筛选条件下的所有通知</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span><strong>单选切换：</strong>点击通知前的复选框进行单个选择</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>选择统计：</strong>实时显示已选择的通知数量</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">•</span>
                <span><strong>智能清空：</strong>切换筛选条件时自动清空选择</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">批量删除</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>选中删除：</strong>删除当前选中的所有通知</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-500 font-bold">•</span>
                <span><strong>删除已读：</strong>一键删除所有已读状态的通知</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>删除全部：</strong>删除当前筛选条件下的所有通知</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong>安全确认：</strong>危险操作需要输入确认文字</span>
              </div>
            </div>
          </div>
        </div>

        {/* 操作流程说明 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">📋 操作流程</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">1</span>
                选择通知
              </h4>
              <div className="ml-8 space-y-2 text-sm text-gray-600">
                <p>• 使用全选按钮选择当前页面所有通知</p>
                <p>• 或者单击通知前的复选框进行单个选择</p>
                <p>• 查看右上角的选择统计信息</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">2</span>
                执行操作
              </h4>
              <div className="ml-8 space-y-2 text-sm text-gray-600">
                <p>• 选择要执行的批量操作类型</p>
                <p>• 点击相应的操作按钮</p>
                <p>• 在确认对话框中确认操作</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">3</span>
                安全确认
              </h4>
              <div className="ml-8 space-y-2 text-sm text-gray-600">
                <p>• 查看操作统计信息</p>
                <p>• 对于危险操作，输入确认文字</p>
                <p>• 点击确认按钮完成操作</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">4</span>
                操作完成
              </h4>
              <div className="ml-8 space-y-2 text-sm text-gray-600">
                <p>• 系统执行批量操作</p>
                <p>• 自动清空选择状态</p>
                <p>• 更新通知列表显示</p>
              </div>
            </div>
          </div>
        </div>

        {/* 安全特性说明 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-red-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            🔒 安全保护机制
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-red-700">
            <div>
              <h4 className="font-medium mb-2">删除确认机制：</h4>
              <ul className="space-y-1">
                <li>• 所有删除操作都需要二次确认</li>
                <li>• 显示将要删除的通知数量</li>
                <li>• 危险操作需要输入确认文字</li>
                <li>• 提供取消操作的选项</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">防误操作设计：</h4>
              <ul className="space-y-1">
                <li>• 删除按钮使用警告色彩</li>
                <li>• 操作前显示详细统计信息</li>
                <li>• 不可撤销操作的明确提示</li>
                <li>• 操作过程中的加载状态</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 快速访问链接 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 快速体验</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/student/notifications"
              className="block p-4 bg-white rounded-xl border border-blue-200 hover:border-blue-300 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👨‍🎓</span>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600">学生通知中心</h4>
                  <p className="text-sm text-gray-600">体验接收和管理通知</p>
                </div>
              </div>
            </Link>

            <Link
              to="/teacher/notifications"
              className="block p-4 bg-white rounded-xl border border-indigo-200 hover:border-indigo-300 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👨‍🏫</span>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-indigo-600">教师通知中心</h4>
                  <p className="text-sm text-gray-600">体验发送和管理通知</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/notifications"
              className="block p-4 bg-white rounded-xl border border-purple-200 hover:border-purple-300 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👨‍💼</span>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-purple-600">管理员通知中心</h4>
                  <p className="text-sm text-gray-600">体验系统级通知管理</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BatchOperationDemo;
