/**
 * 教务系统同步模态框组件
 * 
 * 提供与教务系统的数据同步功能，包含冲突检测和处理
 */

import React, { useState } from 'react';

interface ConflictUser {
  id: string;
  studentId: string;
  name: string;
  department: string;
  class: string;
  status: string;
  existingUser?: any;
  newData: any;
}

interface SystemSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSync: () => Promise<void>;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncTime: string;
  conflictUsers: ConflictUser[];
  onResolveConflicts: (resolutions: Record<string, 'keep' | 'update' | 'merge'>) => void;
}

const SystemSyncModal: React.FC<SystemSyncModalProps> = ({
  isOpen,
  onClose,
  onSync,
  syncStatus,
  lastSyncTime,
  conflictUsers,
  onResolveConflicts
}) => {
  const [resolutions, setResolutions] = useState<Record<string, 'keep' | 'update' | 'merge'>>({});
  const [showConflicts, setShowConflicts] = useState(false);

  if (!isOpen) return null;

  const handleResolutionChange = (conflictId: string, resolution: 'keep' | 'update' | 'merge') => {
    setResolutions(prev => ({
      ...prev,
      [conflictId]: resolution
    }));
  };

  const handleResolveConflicts = () => {
    onResolveConflicts(resolutions);
    setShowConflicts(false);
    setResolutions({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 标题 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">教务系统同步</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!showConflicts ? (
            <>
              {/* 同步状态 */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">同步状态</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    syncStatus === 'idle' ? 'bg-gray-100 text-gray-800' :
                    syncStatus === 'syncing' ? 'bg-blue-100 text-blue-800' :
                    syncStatus === 'success' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {syncStatus === 'idle' ? '待同步' :
                     syncStatus === 'syncing' ? '同步中' :
                     syncStatus === 'success' ? '同步成功' :
                     '同步失败'}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-2xl font-bold text-blue-600">1,248</div>
                    <div className="text-sm text-gray-600">教务系统用户总数</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-2xl font-bold text-green-600">1,156</div>
                    <div className="text-sm text-gray-600">本系统用户总数</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-2xl font-bold text-orange-600">92</div>
                    <div className="text-sm text-gray-600">待同步用户数</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p>上次同步时间: {lastSyncTime}</p>
                  <p>同步频率: 每日凌晨2:00自动同步</p>
                </div>
              </div>

              {/* 同步规则说明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-2">🔄 同步规则</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>新增用户：</strong>自动创建账号，默认密码为学工号</li>
                  <li>• <strong>信息更新：</strong>同步姓名、院系、班级等基本信息</li>
                  <li>• <strong>状态变更：</strong>休学、复学、毕业等状态自动更新</li>
                  <li>• <strong>冲突处理：</strong>检测重复账号并提示手动处理</li>
                  <li>• <strong>数据保护：</strong>不会覆盖用户自定义的学习数据</li>
                </ul>
              </div>

              {/* 同步选项 */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">同步选项</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">同步学生信息（学号、姓名、院系、班级）</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">同步教师信息（工号、姓名、院系、职称）</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">同步学籍状态（在读、休学、毕业）</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">强制覆盖本地修改（谨慎使用）</span>
                  </label>
                </div>
              </div>

              {/* 同步进度 */}
              {syncStatus === 'syncing' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-800">正在从教务系统获取数据...</span>
                  </div>
                  <div className="mt-3">
                    <div className="bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: '65%' }}></div>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">已处理 812/1248 条记录</div>
                  </div>
                </div>
              )}

              {/* 冲突提示 */}
              {conflictUsers.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h4 className="font-medium text-yellow-900">检测到数据冲突</h4>
                  </div>
                  <p className="text-sm text-yellow-800 mb-3">
                    发现 {conflictUsers.length} 个用户存在数据冲突，需要手动处理
                  </p>
                  <button
                    onClick={() => setShowConflicts(true)}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                  >
                    处理冲突
                  </button>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  disabled={syncStatus === 'syncing'}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={onSync}
                  disabled={syncStatus === 'syncing'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {syncStatus === 'syncing' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{syncStatus === 'syncing' ? '同步中...' : '开始同步'}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 冲突处理界面 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">数据冲突处理</h3>
                <p className="text-sm text-gray-600 mb-4">
                  以下用户在教务系统和本系统中都存在，请选择处理方式：
                </p>

                <div className="space-y-4">
                  {conflictUsers.map(conflict => (
                    <div key={conflict.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{conflict.name}</h4>
                          <p className="text-sm text-gray-600">学工号: {conflict.studentId}</p>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          {conflict.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 rounded p-3">
                          <h5 className="font-medium text-gray-700 mb-2">本系统数据</h5>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>院系: {conflict.existingUser?.department || '未知'}</p>
                            <p>班级: {conflict.existingUser?.class || '未知'}</p>
                            <p>邮箱: {conflict.existingUser?.email || '未知'}</p>
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded p-3">
                          <h5 className="font-medium text-blue-700 mb-2">教务系统数据</h5>
                          <div className="text-sm text-blue-600 space-y-1">
                            <p>院系: {conflict.newData.department}</p>
                            <p>班级: {conflict.newData.class}</p>
                            <p>邮箱: {conflict.newData.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`resolution-${conflict.id}`}
                            value="keep"
                            onChange={() => handleResolutionChange(conflict.id, 'keep')}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">保留本系统数据</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`resolution-${conflict.id}`}
                            value="update"
                            onChange={() => handleResolutionChange(conflict.id, 'update')}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">使用教务系统数据</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`resolution-${conflict.id}`}
                            value="merge"
                            onChange={() => handleResolutionChange(conflict.id, 'merge')}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">手动合并</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 冲突处理按钮 */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConflicts(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  返回
                </button>
                <button
                  onClick={handleResolveConflicts}
                  disabled={Object.keys(resolutions).length !== conflictUsers.length}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  应用处理方案
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSyncModal;
