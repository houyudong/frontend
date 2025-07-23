/**
 * 批量删除确认对话框组件
 * 
 * 提供更安全的批量删除确认界面
 */

import React, { useState } from 'react';

interface BatchDeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemCount: number;
  itemType: string;
  isDangerous?: boolean;
}

const BatchDeleteConfirmDialog: React.FC<BatchDeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemCount,
  itemType,
  isDangerous = false
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const requiredText = isDangerous ? '删除' : '';
  const canConfirm = !isDangerous || confirmText === requiredText;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('删除失败:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) return;
    setConfirmText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 */}
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* 对话框 */}
        <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* 图标和标题 */}
          <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
              isDangerous ? 'bg-red-100' : 'bg-orange-100'
            }`}>
              <svg 
                className={`h-6 w-6 ${isDangerous ? 'text-red-600' : 'text-orange-600'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
              <h3 className="text-lg leading-6 font-semibold text-gray-900">
                {title}
              </h3>
              
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-4">
                  {message}
                </p>
                
                {/* 统计信息 */}
                <div className={`p-4 rounded-xl border-2 ${
                  isDangerous ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">将要删除的{itemType}：</span>
                    <span className={`text-lg font-bold ${
                      isDangerous ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {itemCount} 条
                    </span>
                  </div>
                </div>

                {/* 危险操作确认输入 */}
                {isDangerous && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      请输入 "<span className="font-bold text-red-600">{requiredText}</span>" 来确认删除：
                    </label>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder={`请输入"${requiredText}"`}
                      disabled={isDeleting}
                    />
                  </div>
                )}

                {/* 警告提示 */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex">
                    <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="text-sm text-yellow-700">
                      <p className="font-medium">注意：此操作不可撤销</p>
                      <p>删除后的{itemType}将无法恢复，请谨慎操作。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse space-y-2 sm:space-y-0 sm:space-x-reverse sm:space-x-3">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canConfirm || isDeleting}
              className={`w-full inline-flex justify-center items-center rounded-xl border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200 ${
                canConfirm && !isDeleting
                  ? isDangerous
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  删除中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  确认删除
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
              className="w-full inline-flex justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto sm:text-sm transition-colors duration-200"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDeleteConfirmDialog;
