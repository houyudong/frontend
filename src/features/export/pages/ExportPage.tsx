/**
 * 导出页面
 * 
 * 统一的数据导出页面，支持不同角色
 */

import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../pages/layout/MainLayout';
import ExportManager from '../components/ExportManager';

interface ExportPageProps {
  userRole: 'student' | 'teacher' | 'admin';
  userId: string;
}

const ExportPage: React.FC<ExportPageProps> = ({ userRole, userId }) => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link 
                to={`/${userRole}/dashboard`} 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                {userRole === 'student' ? '学习中心' : 
                 userRole === 'teacher' ? '教学中心' : '管理中心'}
              </Link>
            </li>
            <li className="flex items-center" aria-current="page">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="font-medium text-gray-900">数据导出</span>
            </li>
          </ol>
        </nav>

        {/* 导出管理组件 */}
        <ExportManager userRole={userRole} userId={userId} />
      </div>
    </MainLayout>
  );
};

export default ExportPage;
