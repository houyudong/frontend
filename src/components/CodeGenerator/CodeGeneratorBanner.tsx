import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import PlatformLogo from '../branding/PlatformLogo';
import './CodeGeneratorBanner.css';

/**
 * CodeGeneratorBanner - 代码生成器专用banner组件
 *
 * 提供代码生成器页面的顶部banner，包含平台Logo和主页按钮。
 * 具有独特的动画效果，与其他页面的banner区分。
 *
 * @component
 * @example
 * ```tsx
 * <CodeGeneratorBanner />
 * ```
 *
 * @returns {ReactElement} CodeGeneratorBanner组件
 */
const CodeGeneratorBanner: React.FC = () => {
  const [isAnimated, setIsAnimated] = useState<boolean>(false);

  useEffect(() => {
    // 延迟一小段时间后开始动画，确保组件已经渲染
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`code-generator-banner ${isAnimated ? 'banner-visible' : 'banner-hidden'}`}>
      <div className="banner-left">
        <PlatformLogo size="small" withText={true} className="text-white" />
        <span className="banner-title">AI代码生成器</span>
      </div>
      <Link
        to="/"
        className="banner-home-button"
        aria-label="返回主页"
        title="返回主页"
      >
        <FiHome className="home-icon" />
        <span>主页</span>
      </Link>
    </div>
  );
};

export default CodeGeneratorBanner; 