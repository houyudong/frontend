import React, { useState, useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import PlatformLogo from '../branding/PlatformLogo';
import './ErrorDebuggerBanner.css';

/**
 * ErrorDebuggerBanner - 错误调试专用banner组件
 *
 * 提供错误调试页面的顶部标题栏，具有动画效果。
 *
 * @component
 * @example
 * ```tsx
 * <ErrorDebuggerBanner />
 * ```
 *
 * @returns {ReactElement} ErrorDebuggerBanner组件
 */
const ErrorDebuggerBanner: React.FC = () => {
  const [isAnimated, setIsAnimated] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);

  useEffect(() => {
    // 延迟一小段时间后开始动画，确保组件已经渲染
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);

    // 模拟错误计数器增加
    const countInterval = setInterval(() => {
      setErrorCount(prev => (prev < 3 ? prev + 1 : 0));
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(countInterval);
    };
  }, []);

  return (
    <div className={`error-debugger-banner ${isAnimated ? 'banner-visible' : 'banner-hidden'}`}>
      <div className="banner-left">
        <PlatformLogo size="small" withText={true} className="text-white" />
        <span className="banner-title">
          <FiAlertTriangle className="error-icon" />
          错误调试
          {errorCount > 0 && <span className="error-count">{errorCount}</span>}
        </span>
      </div>
    </div>
  );
};

export default ErrorDebuggerBanner; 