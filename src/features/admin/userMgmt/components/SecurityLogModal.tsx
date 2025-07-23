/**
 * 安全日志模态框组件
 * 
 * 显示用户登录安全日志，包含风控记录和异常登录检测
 */

import React, { useState, useEffect } from 'react';

interface SecurityLog {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  action: 'login_success' | 'login_failed' | 'login_blocked' | 'password_reset' | 'account_locked';
  ip: string;
  location: string;
  device: string;
  userAgent: string;
  timestamp: string;
  riskLevel: 'low' | 'medium' | 'high';
  details: string;
}

interface SecurityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SecurityLogModal: React.FC<SecurityLogModalProps> = ({
  isOpen,
  onClose
}) => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    action: 'all',
    riskLevel: 'all',
    timeRange: '24h'
  });

  // 模拟安全日志数据
  const mockSecurityLogs: SecurityLog[] = [
    {
      id: '1',
      userId: 'user_001',
      username: '20231101',
      fullName: '张三',
      action: 'login_failed',
      ip: '192.168.1.100',
      location: '北京市海淀区',
      device: 'Windows PC',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '2024-01-15 14:25:30',
      riskLevel: 'medium',
      details: '密码错误，连续失败3次'
    },
    {
      id: '2',
      userId: 'user_002',
      username: 'teacher001',
      fullName: '李老师',
      action: 'login_blocked',
      ip: '203.208.60.1',
      location: '广东省深圳市',
      device: 'iPhone',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      timestamp: '2024-01-15 13:45:12',
      riskLevel: 'high',
      details: '非校内IP登录被阻止，需要短信验证'
    },
    {
      id: '3',
      userId: 'user_003',
      username: '20231102',
      fullName: '王五',
      action: 'login_success',
      ip: '10.0.0.50',
      location: '校内网络',
      device: 'MacBook Pro',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      timestamp: '2024-01-15 13:30:45',
      riskLevel: 'low',
      details: '正常登录'
    },
    {
      id: '4',
      userId: 'user_004',
      username: '20231103',
      fullName: '赵六',
      action: 'login_success',
      ip: '118.89.214.123',
      location: '上海市浦东新区',
      device: 'Android Phone',
      userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-G998B)',
      timestamp: '2024-01-15 12:15:20',
      riskLevel: 'medium',
      details: '异地登录，已发送通知短信'
    },
    {
      id: '5',
      userId: 'user_005',
      username: 'admin',
      fullName: '系统管理员',
      action: 'account_locked',
      ip: '192.168.1.200',
      location: '北京市海淀区',
      device: 'Windows PC',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: '2024-01-15 11:50:15',
      riskLevel: 'high',
      details: '连续登录失败5次，账户已锁定30分钟'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      loadSecurityLogs();
    }
  }, [isOpen]);

  const loadSecurityLogs = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLogs(mockSecurityLogs);
    } catch (error) {
      console.error('加载安全日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // 过滤日志
  const filteredLogs = logs.filter(log => {
    const matchesAction = filter.action === 'all' || log.action === filter.action;
    const matchesRiskLevel = filter.riskLevel === 'all' || log.riskLevel === filter.riskLevel;
    
    // 时间范围过滤（简化实现）
    const now = new Date();
    const logTime = new Date(log.timestamp);
    const timeDiff = now.getTime() - logTime.getTime();
    const matchesTimeRange = 
      filter.timeRange === '24h' ? timeDiff <= 24 * 60 * 60 * 1000 :
      filter.timeRange === '7d' ? timeDiff <= 7 * 24 * 60 * 60 * 1000 :
      filter.timeRange === '30d' ? timeDiff <= 30 * 24 * 60 * 60 * 1000 :
      true;
    
    return matchesAction && matchesRiskLevel && matchesTimeRange;
  });

  // 获取操作类型显示文本
  const getActionText = (action: string) => {
    const actionMap: Record<string, string> = {
      login_success: '登录成功',
      login_failed: '登录失败',
      login_blocked: '登录阻止',
      password_reset: '密码重置',
      account_locked: '账户锁定'
    };
    return actionMap[action] || action;
  };

  // 获取风险级别颜色
  const getRiskLevelColor = (level: string) => {
    const colorMap: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colorMap[level] || 'bg-gray-100 text-gray-800';
  };

  // 获取操作类型颜色
  const getActionColor = (action: string) => {
    const colorMap: Record<string, string> = {
      login_success: 'bg-green-100 text-green-800',
      login_failed: 'bg-red-100 text-red-800',
      login_blocked: 'bg-red-100 text-red-800',
      password_reset: 'bg-blue-100 text-blue-800',
      account_locked: 'bg-red-100 text-red-800'
    };
    return colorMap[action] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 标题 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">安全日志</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 统计概览 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {logs.filter(log => log.action === 'login_success').length}
              </div>
              <div className="text-sm text-blue-600">成功登录</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">
                {logs.filter(log => log.action === 'login_failed').length}
              </div>
              <div className="text-sm text-red-600">登录失败</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {logs.filter(log => log.action === 'login_blocked').length}
              </div>
              <div className="text-sm text-yellow-600">登录阻止</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {logs.filter(log => log.riskLevel === 'high').length}
              </div>
              <div className="text-sm text-purple-600">高风险事件</div>
            </div>
          </div>

          {/* 筛选器 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <select
                value={filter.action}
                onChange={(e) => setFilter(prev => ({ ...prev, action: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">所有操作</option>
                <option value="login_success">登录成功</option>
                <option value="login_failed">登录失败</option>
                <option value="login_blocked">登录阻止</option>
                <option value="password_reset">密码重置</option>
                <option value="account_locked">账户锁定</option>
              </select>
              
              <select
                value={filter.riskLevel}
                onChange={(e) => setFilter(prev => ({ ...prev, riskLevel: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">所有风险级别</option>
                <option value="low">低风险</option>
                <option value="medium">中风险</option>
                <option value="high">高风险</option>
              </select>
              
              <select
                value={filter.timeRange}
                onChange={(e) => setFilter(prev => ({ ...prev, timeRange: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">最近24小时</option>
                <option value="7d">最近7天</option>
                <option value="30d">最近30天</option>
                <option value="all">全部时间</option>
              </select>
            </div>
            
            <button
              onClick={loadSecurityLogs}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>刷新</span>
            </button>
          </div>

          {/* 日志列表 */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">加载中...</span>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        用户信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作类型
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        风险级别
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP地址/位置
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        设备信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        详情
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{log.fullName}</div>
                            <div className="text-sm text-gray-500">{log.username}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                            {getActionText(log.action)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(log.riskLevel)}`}>
                            {log.riskLevel === 'low' ? '低风险' : log.riskLevel === 'medium' ? '中风险' : '高风险'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">{log.ip}</div>
                            <div className="text-sm text-gray-500">{log.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{log.device}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{log.timestamp}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={log.details}>
                            {log.details}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredLogs.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无日志记录</h3>
                  <p className="text-gray-600">当前筛选条件下没有找到相关的安全日志</p>
                </div>
              )}
            </div>
          )}

          {/* 关闭按钮 */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityLogModal;
