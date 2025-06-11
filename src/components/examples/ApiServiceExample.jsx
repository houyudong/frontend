import React, { useState, useEffect } from 'react';
import { api } from '../../services';

/**
 * API服务示例组件
 * 展示如何使用统一的API服务
 */
const ApiServiceExample = () => {
  const [courses, setCourses] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 加载课程和实验数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 使用统一API服务加载数据
        const [coursesData, experimentsData] = await Promise.all([
          api.content.getCourses(),
          api.content.getExperiments()
        ]);
        
        setCourses(coursesData);
        setExperiments(experimentsData);
      } catch (err) {
        console.error('加载数据失败:', err);
        setError('加载数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // 模拟用户登录
  const handleLogin = async () => {
    try {
      setLoading(true);
      
      // 使用认证API登录
      const result = await api.auth.login('20250001', '20250001');
      
      if (result.success) {
        alert(`登录成功，欢迎 ${result.user.name}`);
      } else {
        alert(`登录失败: ${result.message}`);
      }
    } catch (err) {
      console.error('登录失败:', err);
      alert(`登录失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 模拟创建项目
  const handleCreateProject = async () => {
    try {
      setLoading(true);
      
      // 使用项目API创建项目
      const result = await api.project.createProject({
        name: '示例项目',
        description: '这是一个使用统一API服务创建的示例项目',
        chipModel: 'STM32F103ZET6',
        chipFamily: 'STM32F1'
      });
      
      alert(`项目创建成功: ${result.name}`);
    } catch (err) {
      console.error('创建项目失败:', err);
      alert(`创建项目失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">API服务示例</h2>
      
      {/* 加载状态 */}
      {loading && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">
          加载中...
        </div>
      )}
      
      {/* 错误信息 */}
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* 操作按钮 */}
      <div className="flex gap-2 mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleLogin}
          disabled={loading}
        >
          模拟登录
        </button>
        
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleCreateProject}
          disabled={loading}
        >
          创建项目
        </button>
      </div>
      
      {/* 课程列表 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">课程列表</h3>
        {courses.length > 0 ? (
          <ul className="list-disc pl-5">
            {courses.map((course) => (
              <li key={course.id} className="mb-1">
                {course.title} - {course.difficulty}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">暂无课程数据</p>
        )}
      </div>
      
      {/* 实验列表 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">实验列表</h3>
        {experiments.length > 0 ? (
          <ul className="list-disc pl-5">
            {experiments.map((experiment) => (
              <li key={experiment.id} className="mb-1">
                {experiment.title} - {experiment.type}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">暂无实验数据</p>
        )}
      </div>
    </div>
  );
};

export default ApiServiceExample;
