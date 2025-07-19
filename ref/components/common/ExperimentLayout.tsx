/**
 * 实验通用布局组件
 * 
 * 提供所有实验页面的统一布局结构
 * 遵循DRY原则，避免重复代码
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../../../pages';
import STMIDEWrapper from '../../../stmIde/STMIDEWrapper';
import HardwareConnection from '../hardware/HardwareConnection';
import KnowledgePoints from '../knowledge/KnowledgePoints';

interface ExperimentLayoutProps {
  experiment: any;
  principles: Array<{ title: string; content: string }>;
  purposes: string[];
  steps: Array<{ title: string; description: string; code?: string; note?: string }>;
  onDeleteExperiment?: () => void;
  children?: React.ReactNode;
}

const ExperimentLayout: React.FC<ExperimentLayoutProps> = ({
  experiment,
  principles,
  purposes,
  steps,
  onDeleteExperiment,
  children
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'environment'>('guide');

  return (
    <MainLayout showSidebar={false}>
      <div className="min-h-screen bg-gray-50">
        {/* 面包屑导航 */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 py-3 text-sm">
              <Link to="/experiments" className="text-blue-600 hover:text-blue-800 transition-colors">
                实验中心
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{experiment.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* 实验标题和基本信息 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{experiment.name}</h1>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {experiment.chip_model}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {experiment.project_name}
                </span>
              </div>
            </div>
            <p className="text-lg text-gray-600 mb-4">{experiment.description}</p>
          </div>

          {/* 实验操作按钮 */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              🚀 开始实验
            </button>
            {onDeleteExperiment && (
              <button 
                onClick={onDeleteExperiment}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                🗑️ 删除实验
              </button>
            )}
            <Link 
              to="/student/courses" 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-block"
            >
              📖 前往课程学习
            </Link>
          </div>

          {/* 标签页切换 */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('guide')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'guide'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📖 实验指导
              </button>
              <button
                onClick={() => setActiveTab('environment')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'environment'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💻 编程环境
              </button>
            </nav>
          </div>

          {/* 标签页内容 */}
          {activeTab === 'guide' && (
            <div className="space-y-8">
              {/* 实验目标 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🎯</span>
                  实验目标
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {purposes.map((purpose, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700">{purpose}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 实验原理 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-2">🔬</span>
                  实验原理
                </h2>
                <div className="space-y-6">
                  {principles.map((principle, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{principle.title}</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{principle.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 硬件连接 */}
              <HardwareConnection experimentName={experiment.name} />

              {/* 实验步骤 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-2">📋</span>
                  实验步骤
                </h2>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                        {step.code && (
                          <div className="bg-gray-900 text-green-400 p-3 rounded-md text-xs font-mono overflow-x-auto">
                            <pre>{step.code}</pre>
                          </div>
                        )}
                        {step.note && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                            <strong>注意：</strong> {step.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 相关知识点 */}
              <KnowledgePoints experimentName={experiment.name || ''} />

              {/* 自定义内容 */}
              {children}
            </div>
          )}

          {activeTab === 'environment' && (
            <div className="h-[calc(100vh-200px)]">
              <STMIDEWrapper />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ExperimentLayout;
