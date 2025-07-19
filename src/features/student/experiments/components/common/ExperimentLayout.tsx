/**
 * 实验通用布局组件
 * 
 * 提供所有实验页面的统一布局结构
 * 遵循DRY原则，避免重复代码
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../../../pages/layout/MainLayout';

interface ExperimentLayoutProps {
  experiment: {
    id: string;
    name: string;
    description?: string;
  };
  principles?: Array<{ title: string; content: string }>;
  purposes?: string[];
  steps?: Array<{ title: string; description: string; code?: string; note?: string }>;
  onDeleteExperiment?: () => void;
  children?: React.ReactNode;
}

const ExperimentLayout: React.FC<ExperimentLayoutProps> = ({
  experiment,
  principles = [],
  purposes = [],
  steps = [],
  onDeleteExperiment,
  children
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'environment'>('guide');

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* 面包屑导航 */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 py-3 text-sm">
              <Link to="/student/experiments" className="text-blue-600 hover:text-blue-800 transition-colors">
                实验中心
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{experiment.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* 实验标题和操作 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{experiment.name}</h1>
                {experiment.description && (
                  <p className="text-gray-600">{experiment.description}</p>
                )}
              </div>
              
              {onDeleteExperiment && (
                <button
                  onClick={onDeleteExperiment}
                  className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  删除实验
                </button>
              )}
            </div>
          </div>

          {/* 标签页导航 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'guide'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  实验指导
                </button>
                <button
                  onClick={() => setActiveTab('environment')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'environment'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  开发环境
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'guide' ? (
                <div className="space-y-8">
                  {/* 实验目的 */}
                  {purposes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">实验目的</h3>
                      <ul className="space-y-2">
                        {purposes.map((purpose, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{purpose}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 实验原理 */}
                  {principles.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">实验原理</h3>
                      <div className="space-y-4">
                        {principles.map((principle, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">{principle.title}</h4>
                            <p className="text-gray-700 leading-relaxed">{principle.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 实验步骤 */}
                  {steps.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">实验步骤</h3>
                      <div className="space-y-6">
                        {steps.map((step, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start">
                              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-2">{step.title}</h4>
                                <p className="text-gray-700 mb-4">{step.description}</p>
                                
                                {step.code && (
                                  <div className="bg-gray-900 rounded-lg p-4 mb-4">
                                    <pre className="text-green-400 text-sm overflow-x-auto">
                                      <code>{step.code}</code>
                                    </pre>
                                  </div>
                                )}
                                
                                {step.note && (
                                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <div className="flex">
                                      <svg className="flex-shrink-0 w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                      </svg>
                                      <p className="text-yellow-800 text-sm">{step.note}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 自定义内容 */}
                  {children}
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">开发环境</h3>
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">STM32开发环境</h4>
                    <p className="text-gray-600 mb-4">
                      集成开发环境将在这里加载，提供代码编辑、编译、调试等功能
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      启动开发环境
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExperimentLayout;
