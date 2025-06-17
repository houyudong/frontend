import React from 'react';
import { FiGithub, FiHelpCircle, FiMail, FiBook } from 'react-icons/fi';

/**
 * BottomIcons - 底部图标组件
 *
 * 显示在左侧导航栏底部的图标链接
 *
 * @component
 * @example
 * ```tsx
 * <BottomIcons />
 * ```
 */
const BottomIcons: React.FC = () => {
  // 添加CSS动画
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .bottom-icon:hover {
        color: #1F2937 !important;
        background-color: #F3F4F6 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    color: '#6B7280', // gray-500 in Tailwind
    borderRadius: '4px',
    marginRight: '4px',
    transition: 'all 0.2s'
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e5e7eb',
      width: '100%'
    }}>
      <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" style={iconStyle} className="bottom-icon">
        <FiGithub size={18} />
      </a>
      <a href="#" style={iconStyle} className="bottom-icon">
        <FiMail size={18} />
      </a>
      <a href="#" style={iconStyle} className="bottom-icon">
        <FiBook size={18} />
      </a>
      <a href="#" style={iconStyle} className="bottom-icon">
        <FiHelpCircle size={18} />
      </a>
    </div>
  );
};

export default BottomIcons; 