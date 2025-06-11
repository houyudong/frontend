import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiCode } from 'react-icons/fi';
import PlatformLogo from '../../branding/PlatformLogo';
import './WebIDEBanner.css';

/**
 * WebIDEBanner - WebIDE专用banner组件
 *
 * 提供WebIDE页面的顶部banner，包含平台Logo和主页按钮。
 * 具有独特的动画效果，与其他页面的banner区分。
 *
 * @component
 * @example
 * ```jsx
 * <WebIDEBanner />
 * ```
 *
 * @returns {ReactElement} WebIDEBanner组件
 */
const WebIDEBanner = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [codeSymbols, setCodeSymbols] = useState([]);

  useEffect(() => {
    // 延迟一小段时间后开始动画，确保组件已经渲染
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);

    // 生成随机代码符号
    const symbols = ['{ }', '[ ]', '( )', '< >', '; ;', '// //', '/* */', '= =', '+ +', '- -'];
    const generateSymbols = () => {
      const newSymbols = [];
      for (let i = 0; i < 5; i++) {
        newSymbols.push({
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          left: Math.random() * 100,
          delay: Math.random() * 5
        });
      }
      setCodeSymbols(newSymbols);
    };

    generateSymbols();
    const symbolInterval = setInterval(generateSymbols, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(symbolInterval);
    };
  }, []);

  return (
    <div className={`webide-banner ${isAnimated ? 'banner-visible' : 'banner-hidden'}`}>
      {/* 背景代码符号 */}
      {codeSymbols.map((item, index) => (
        <span
          key={index}
          className="code-symbol"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`
          }}
        >
          {item.symbol}
        </span>
      ))}

      <div className="banner-left">
        <PlatformLogo size="small" withText={true} className="text-white" />
        <span className="banner-title">
          <FiCode className="code-icon" />
          AI代码IDE
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

export default WebIDEBanner;
