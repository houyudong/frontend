import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiHome } from 'react-icons/fi';
import PlatformLogo from '../branding/PlatformLogo';

interface WebIDELayoutProps {
  children: React.ReactNode;
  projectName?: string;
  [key: string]: any;
}

/**
 * WebIDELayout - WebIDE页面布局组件
 *
 * 专门为WebIDE页面设计的布局，提供全屏编辑体验
 * 包含动画banner和主页按钮，同时保留WebIDE组件的工具栏
 *
 * @component
 * @example
 * ```tsx
 * <WebIDELayout>
 *   <WebIDE />
 * </WebIDELayout>
 * ```
 */
const WebIDELayout: React.FC<WebIDELayoutProps> = ({
  children,
  projectName = 'Untitled Project',
  ...props
}) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <div className="h-screen flex flex-col bg-gray-100" {...props}>
      {/* 侧边菜单 */}
      <div className={`fixed inset-y-0 left-0 transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out z-20 pt-12`}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">WebIDE菜单</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <a href="#projects" className="block px-3 py-2 rounded-md hover:bg-gray-700">
                  项目管理
                </a>
              </li>
              <li>
                <a href="#examples" className="block px-3 py-2 rounded-md hover:bg-gray-700">
                  示例代码
                </a>
              </li>
              <li>
                <a href="#documentation" className="block px-3 py-2 rounded-md hover:bg-gray-700">
                  文档
                </a>
              </li>
              <li>
                <a href="#settings" className="block px-3 py-2 rounded-md hover:bg-gray-700">
                  设置
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* 遮罩层 */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* 主内容区域 */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default WebIDELayout; 