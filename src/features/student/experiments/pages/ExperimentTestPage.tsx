import React, { useState, useEffect } from 'react';
import { ExperimentApi, ExperimentTemplate, UserExperiment } from '../../../../api/experimentApi';

/**
 * 实验API测试页面
 * 用于验证Frontend与Backend的API连接
 */
export const ExperimentTestPage: React.FC = () => {
  const [templates, setTemplates] = useState<ExperimentTemplate[]>([]);
  const [userExperiments, setUserExperiments] = useState<UserExperiment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // 测试用户ID
  const testUserId = '123e4567-e89b-12d3-a456-426614174000';

  // 获取实验模板
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ExperimentApi.getExperimentTemplates();
      setTemplates(data);
      setSuccess(`成功获取 ${data.length} 个实验模板`);
    } catch (err) {
      setError(`获取实验模板失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  // 获取用户实验记录
  const fetchUserExperiments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ExperimentApi.getUserExperiments(testUserId);
      setUserExperiments(data);
      setSuccess(`成功获取 ${data.length} 个用户实验记录`);
    } catch (err) {
      setError(`获取用户实验记录失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  // 开始实验
  const startExperiment = async (templateId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ExperimentApi.startExperiment(testUserId, templateId);
      setSuccess(`成功开始实验: ${result.id}`);
      // 重新获取用户实验记录
      await fetchUserExperiments();
    } catch (err) {
      setError(`开始实验失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  // 更新实验进度
  const updateExperiment = async (experimentId: string, progress: number, status: string) => {
    setLoading(true);
    setError(null);
    try {
      await ExperimentApi.updateExperiment(testUserId, experimentId, {
        progress,
        status: status as any
      });
      setSuccess(`成功更新实验进度: ${progress}%`);
      // 重新获取用户实验记录
      await fetchUserExperiments();
    } catch (err) {
      setError(`更新实验进度失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    fetchTemplates();
    fetchUserExperiments();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">实验API测试页面</h1>
      
      {/* 状态显示 */}
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          加载中...
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          错误: {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          成功: {success}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={fetchTemplates}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          获取实验模板
        </button>
        <button
          onClick={fetchUserExperiments}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          获取用户实验
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 实验模板列表 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">实验模板 ({templates.length})</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {templates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{template.name}</h3>
                  <span className="text-sm text-gray-500">ID: {template.id}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{template.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>难度: {template.difficulty}</span>
                  <span>时长: {template.duration}分钟</span>
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => startExperiment(template.id)}
                    disabled={loading}
                    className="bg-purple-500 hover:bg-purple-700 text-white text-sm font-bold py-1 px-3 rounded disabled:opacity-50"
                  >
                    开始实验
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 用户实验记录 */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">用户实验记录 ({userExperiments.length})</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {userExperiments.map((experiment) => (
              <div key={experiment.id} className="border border-gray-200 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">实验ID: {experiment.template_id}</h3>
                  <span className="text-sm text-gray-500">{experiment.status}</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>进度</span>
                    <span>{experiment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${experiment.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  开始时间: {new Date(experiment.started_at).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateExperiment(experiment.id, 50, 'in_progress')}
                    disabled={loading}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white text-xs font-bold py-1 px-2 rounded disabled:opacity-50"
                  >
                    设为50%
                  </button>
                  <button
                    onClick={() => updateExperiment(experiment.id, 100, 'completed')}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 rounded disabled:opacity-50"
                  >
                    完成实验
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 测试信息 */}
      <div className="mt-6 bg-gray-100 rounded-lg p-4">
        <h3 className="font-semibold mb-2">测试信息</h3>
        <p className="text-sm text-gray-600">
          测试用户ID: {testUserId}<br/>
          Backend API地址: http://localhost:5000<br/>
          当前测试的API端点:
        </p>
        <ul className="text-xs text-gray-500 mt-2 list-disc list-inside">
          <li>GET /api/experiments - 获取实验模板</li>
          <li>GET /api/users/:userId/experiments - 获取用户实验记录</li>
          <li>POST /api/users/:userId/experiments - 开始新实验</li>
          <li>PUT /api/users/:userId/experiments/:experimentId - 更新实验进度</li>
        </ul>
      </div>
    </div>
  );
};

export default ExperimentTestPage;
