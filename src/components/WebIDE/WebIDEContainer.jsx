import React, { useState, useEffect } from 'react';
import { WebIDELayout } from '../layout';
import WebIDE from './WebIDE';
import { FiInfo, FiX } from 'react-icons/fi';

/**
 * WebIDEContainer - WebIDE容器组件
 *
 * 使用WebIDELayout包装WebIDE组件，提供统一的布局和导航。
 * 包含动画banner和明显的主页按钮，同时保留WebIDE组件的工具栏。
 * 提供使用指南对话框，帮助用户了解WebIDE的功能和使用方法。
 *
 * @component
 * @example
 * ```jsx
 * <WebIDEContainer />
 * ```
 *
 * @returns {ReactElement} WebIDEContainer组件
 */
const WebIDEContainer = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [projectName, setProjectName] = useState('STM32F103_LED');

  // 监听自定义事件，显示使用指南
  useEffect(() => {
    const handleShowGuide = () => {
      setShowGuide(true);
    };

    window.addEventListener('webide-show-guide', handleShowGuide);

    return () => {
      window.removeEventListener('webide-show-guide', handleShowGuide);
    };
  }, []);

  return (
    <WebIDELayout
      projectName={projectName}
    >
      {/* WebIDE组件 */}
      <WebIDE />

      {/* 使用指南对话框 */}
      {showGuide && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FiInfo className="mr-2 text-blue-500" />
                  WebIDE 使用指南
                </h2>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-4">
                <p className="mb-4 text-gray-700">
                  嵌入式智能开发平台提供完整的STM32程序开发流程，包括代码编辑、编译和下载功能。
                  平台集成了常用的HAL库函数、实时编译输出以及通过ST-Link下载程序到设备的功能。
                </p>

                <h4 className="font-semibold text-blue-800 mb-2">基本功能</h4>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li>使用左侧文件栏管理项目文件</li>
                  <li>点击"编译"按钮编译代码，查看编译输出窗口获取编译结果</li>
                  <li>通过ST-Link连接按钮连接到您的调试器</li>
                  <li>成功连接ST-Link后，点击"烧录"按钮将程序烧录到STM32开发板</li>
                  <li>可以使用"保存"功能将当前工作保存到本地</li>
                  <li>通过"上传文件"功能可以恢复之前的工作</li>
                </ul>

                <h4 className="font-semibold text-blue-800 mb-2">调试功能</h4>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li>连接ST-Link后，可以使用调试按钮启动调试会话</li>
                  <li>支持断点设置、单步执行和变量监视等功能</li>
                  <li>编译错误会在输出面板中显示，点击错误信息可以跳转到对应代码位置</li>
                </ul>

                <h4 className="font-semibold text-blue-800 mb-2">文档支持</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>使用右侧的文档按钮可以打开API文档面板</li>
                  <li>支持搜索STM32标准外设库文档</li>
                  <li>包含常用函数示例和参考代码</li>
                </ul>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowGuide(false)}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </WebIDELayout>
  );
};

export default WebIDEContainer;
