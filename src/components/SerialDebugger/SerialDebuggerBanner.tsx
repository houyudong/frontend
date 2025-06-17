import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiTerminal } from 'react-icons/fi';
import PlatformLogo from '../branding/PlatformLogo';
import './SerialDebuggerBanner.css';

/**
 * SerialDebuggerBanner - 串口调试器专用banner组件
 *
 * 提供串口调试器页面的顶部banner，包含平台Logo和主页按钮。
 * 具有独特的动画效果，与其他页面的banner区分。
 *
 * @component
 * @example
 * ```tsx
 * <SerialDebuggerBanner />
 * ```
 *
 * @returns {ReactElement} SerialDebuggerBanner组件
 */
const SerialDebuggerBanner: React.FC = () => {
  const [isAnimated, setIsAnimated] = useState<boolean>(false);
  const [terminalBlink, setTerminalBlink] = useState<boolean>(false);

  useEffect(() => {
    // 延迟一小段时间后开始动画，确保组件已经渲染
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);

    // 设置终端图标闪烁效果
    const blinkInterval = setInterval(() => {
      setTerminalBlink(prev => !prev);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(blinkInterval);
    };
  }, []);

  return (
    <div className={`serial-debugger-banner ${isAnimated ? 'banner-visible' : 'banner-hidden'}`}>
      <div className="banner-left">
        <PlatformLogo size="small" withText={true} className="text-white" />
        <span className="banner-title">
          <FiTerminal className={`terminal-icon ${terminalBlink ? 'terminal-blink' : ''}`} />
          串口调试工具
        </span>
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

export default SerialDebuggerBanner; 