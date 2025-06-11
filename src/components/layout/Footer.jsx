import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiMail, FiExternalLink } from 'react-icons/fi';

/**
 * Footer - 页脚组件
 * 
 * 应用底部页脚，显示版权信息、链接和其他信息
 * 
 * @component
 * @example
 * ```jsx
 * <Footer />
 * ```
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* 版权信息 */}
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} STM32 AI嵌入式教学平台. 保留所有权利.
            </p>
          </div>
          
          {/* 链接 */}
          <div className="flex space-x-6">
            <a
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <FiGithub className="h-5 w-5 mr-1" />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href="mailto:support@example.com"
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <FiMail className="h-5 w-5 mr-1" />
              <span className="text-sm">联系我们</span>
            </a>
            <Link
              to="/about"
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <span className="text-sm">关于平台</span>
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <span className="text-sm">使用条款</span>
            </Link>
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <span className="text-sm">隐私政策</span>
            </Link>
          </div>
        </div>
        
        {/* 额外信息 */}
        <div className="mt-4 text-center text-xs text-gray-400">
          <p>
            本平台基于STM32系列微控制器开发，旨在提供嵌入式系统教学和实验环境。
          </p>
          <p className="mt-1">
            <a
              href="https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 inline-flex items-center"
            >
              了解更多STM32微控制器
              <FiExternalLink className="h-3 w-3 ml-1" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
