import React from 'react';
import './WebIDEBanner.css';

interface WebIDEBannerProps {
  title: string;
  subtitle?: string;
  version?: string;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
}

/**
 * WebIDEBanner - WebIDE顶部横幅组件
 * 
 * 显示IDE的标题、版本和操作按钮。
 * 
 * @param {WebIDEBannerProps} props - 组件属性
 * @returns {React.ReactElement} WebIDE横幅组件
 */
const WebIDEBanner: React.FC<WebIDEBannerProps> = ({
  title,
  subtitle,
  version,
  onSettingsClick,
  onHelpClick
}) => {
  return (
    <div className="webide-banner">
      <div className="banner-left">
        <h1 className="banner-title">{title}</h1>
        {subtitle && <p className="banner-subtitle">{subtitle}</p>}
        {version && <span className="banner-version">v{version}</span>}
      </div>
      <div className="banner-right">
        {onSettingsClick && (
          <button
            className="banner-button"
            onClick={onSettingsClick}
            title="设置"
          >
            设置
          </button>
        )}
        {onHelpClick && (
          <button
            className="banner-button"
            onClick={onHelpClick}
            title="帮助"
          >
            帮助
          </button>
        )}
      </div>
    </div>
  );
};

export default WebIDEBanner; 