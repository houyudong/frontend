/**
 * 实验中心主页面
 *
 * 参考课程学习页面的设计风格
 * 展示实验列表和统计信息
 */

import React, { useEffect } from 'react';
import { MainLayout } from '../../../pages';
import ExperimentList from '../components/ExperimentList';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useExperiments } from '../stores/experimentStore';
import { getUserExperimentStats } from '../utils/experimentUtils';

const ExperimentsPage: React.FC = () => {
  const { user } = useAuth();
  const { userExperiments, loadUserExperiments, loadTemplates } = useExperiments();

  // 加载数据
  useEffect(() => {
    loadTemplates();
    if (user?.id) {
      loadUserExperiments(user.id);
    }
  }, [user?.id, loadTemplates, loadUserExperiments]);

  // 计算统计信息
  const stats = getUserExperimentStats(userExperiments);
  const totalExperiments = 19;
  const notStarted = totalExperiments - userExperiments.length;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* 页面头部 */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-3xl font-bold text-gray-900">实验中心</h1>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-600">{totalExperiments}</div>
              <div className="text-sm text-gray-600">总实验数</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">已完成</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">学习中</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-gray-600">{notStarted}</div>
              <div className="text-sm text-gray-600">未开始</div>
            </div>
          </div>



          {/* 实验列表 */}
          <div>
            <ExperimentList />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExperimentsPage;
