/**
 * 批量导入模态框组件
 * 
 * 支持Excel文件导入用户数据，包含模板下载和数据校验功能
 */

import React, { useState, useRef } from 'react';

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
}

const BatchImportModal: React.FC<BatchImportModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 处理文件选择
  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
        file.type !== 'application/vnd.ms-excel') {
      alert('请选择Excel文件（.xlsx或.xls格式）');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB限制
      alert('文件大小不能超过10MB');
      return;
    }
    
    setSelectedFile(file);
  };

  // 处理文件拖拽
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // 处理导入
  const handleImport = async () => {
    if (!selectedFile) {
      alert('请先选择文件');
      return;
    }

    setImporting(true);
    try {
      await onImport(selectedFile);
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error('导入失败:', error);
    } finally {
      setImporting(false);
    }
  };

  // 下载模板
  const downloadTemplate = () => {
    // 创建模板数据
    const templateData = [
      ['学工号*', '姓名*', '院系代码*', '班级', '角色*', '邮箱*', '手机号', '备注'],
      ['20231101', '张三', 'CS', '计算机2023-1班', 'student', 'zhangsan@example.com', '13800138001', ''],
      ['20231102', '李四', 'CS', '计算机2023-1班', 'student', 'lisi@example.com', '13800138002', ''],
      ['T001', '王老师', 'CS', '', 'teacher', 'wangteacher@example.com', '13800138003', '计算机系教师'],
      ['A001', '管理员', 'ADMIN', '', 'admin', 'admin@example.com', '13800138004', '系统管理员']
    ];

    // 创建CSV内容
    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '用户导入模板.csv';
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 标题 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">批量导入用户</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 导入说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">📋 导入说明</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 支持Excel文件格式（.xlsx, .xls）</li>
              <li>• 文件大小限制：10MB</li>
              <li>• 学工号格式：学生为8位数字（如20231101），教师为字母+数字</li>
              <li>• 必填字段：学工号、姓名、院系代码、角色、邮箱</li>
              <li>• 角色类型：student（学生）、teacher（教师）、admin（管理员）</li>
            </ul>
          </div>

          {/* 模板下载 */}
          <div className="mb-6">
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>下载导入模板</span>
            </button>
          </div>

          {/* 文件上传区域 */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="hidden"
            />
            
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  重新选择文件
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    拖拽Excel文件到此处，或
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      点击选择文件
                    </button>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    支持 .xlsx, .xls 格式，最大10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 校验规则说明 */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">⚠️ 校验规则</h4>
            <div className="text-sm text-yellow-800 space-y-1">
              <p><strong>学工号格式：</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• 学生：8位数字，前4位为入学年份（如20231101为2023级学生）</li>
                <li>• 教师：字母开头+数字（如T001, PROF001）</li>
                <li>• 管理员：A开头+数字（如A001）</li>
              </ul>
              <p><strong>院系代码：</strong>CS（计算机）、EE（电子）、ME（机械）、ADMIN（管理）</p>
              <p><strong>邮箱格式：</strong>必须为有效邮箱地址</p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              disabled={importing}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              取消
            </button>
            <button
              onClick={handleImport}
              disabled={!selectedFile || importing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {importing && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{importing ? '导入中...' : '开始导入'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchImportModal;
