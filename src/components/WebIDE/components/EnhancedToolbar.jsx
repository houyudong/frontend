import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSave,
  FaTerminal,
  FaBug,
  FaLink,
  FaStop,
  FaPlay,
  FaBook,
  FaCog,
  FaFolder,
  FaWrench,
  FaLightbulb
} from 'react-icons/fa';
import { FiHome, FiCode } from 'react-icons/fi';
import { RiFlashlightFill } from 'react-icons/ri';
import { IoMdBuild } from 'react-icons/io';
import { MCU_MODELS } from '../constants';
import PlatformLogo from '../../branding/PlatformLogo';
import './EnhancedToolbar.css';

/**
 * EnhancedToolbar - 增强版WebIDE工具栏组件
 *
 * 集成了WebIDEBanner和Toolbar功能，提供统一的顶部导航和工具栏体验。
 * 包含动画banner、主页按钮和所有工具按钮，优化了布局和视觉效果。
 *
 * @component
 * @example
 * ```jsx
 * <EnhancedToolbar
 *   mcuModel="STM32F103C8T6"
 *   onMcuModelChange={handleMcuModelChange}
 *   onSaveFile={handleSaveFile}
 *   onBuild={handleBuild}
 *   isBuilding={isBuilding}
 *   onConnectStLink={handleConnectStLink}
 *   isStLinkConnected={isStLinkConnected}
 *   onFlash={handleFlash}
 *   isFlashing={isFlashing}
 *   onEraseDevice={handleEraseDevice}
 *   isErasing={isErasing}
 *   onOpenStLinkSettings={handleOpenStLinkSettings}
 *   onToggleDocPanel={handleToggleDocPanel}
 *   onLoadLedExample={handleLoadLedExample}
 *   onOpenProjectDialog={handleOpenProjectDialog}
 *   onOpenBuildSettings={handleOpenBuildSettings}
 *   buildMode="debug"
 *   currentProject={{ name: "MyProject" }}
 * />
 * ```
 *
 * @returns {ReactElement} EnhancedToolbar组件
 */
const EnhancedToolbar = ({
  mcuModel,
  onMcuModelChange,
  onSaveFile,
  onBuild,
  isBuilding,
  onConnectStLink,
  isStLinkConnected,
  onFlash,
  isFlashing,
  onEraseDevice,
  isErasing,
  onOpenStLinkSettings,
  onToggleDocPanel,
  onToggleDebugPanel,
  onLoadLedExample,
  onOpenProjectDialog,
  onOpenBuildSettings,
  buildMode = 'debug',
  currentProject = null
}) => {
  // Banner动画状态
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
    <div className="enhanced-toolbar">
      {/* Banner部分 */}
      <div className={`toolbar-banner ${isAnimated ? 'banner-visible' : 'banner-hidden'}`}>
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

      {/* 工具栏部分 */}
      <div className="toolbar-main">
        {/* 左侧工具按钮 */}
        <div className="toolbar-section">
          <button
            className="toolbar-button toolbar-button-primary"
            onClick={onOpenProjectDialog}
            title="项目管理"
          >
            <FaFolder />
            <span className="button-text">项目</span>
          </button>
          <button
            className="toolbar-button toolbar-button-primary"
            onClick={onSaveFile}
            title="保存文件 (Ctrl+S)"
          >
            <FaSave />
            <span className="button-text">保存</span>
          </button>
          <div className="toolbar-divider"></div>
          <button
            className="toolbar-button toolbar-button-primary"
            onClick={() => onToggleDebugPanel && onToggleDebugPanel()}
            title="调试面板"
          >
            <FaBug />
            <span className="button-text">调试面板</span>
          </button>
          <button
            className="toolbar-button toolbar-button-primary"
            onClick={onOpenStLinkSettings}
            title="设置"
          >
            <FaCog />
            <span className="button-text">设置</span>
          </button>
          <div className="toolbar-divider"></div>
          <button
            className="toolbar-button toolbar-button-primary"
            onClick={onBuild}
            disabled={isBuilding}
            title={`编译项目 (${buildMode})`}
          >
            <IoMdBuild />
            <span className="button-text">编译</span>
            {isBuilding && <span className="toolbar-button-badge"></span>}
          </button>
          <button
            className="toolbar-button toolbar-button-primary"
            onClick={onOpenBuildSettings}
            title="构建设置"
          >
            <FaWrench />
            <span className="button-text">配置</span>
          </button>
        </div>

        {/* 中间工具按钮 */}
        <div className="toolbar-section">
          <div className="toolbar-divider"></div>
          <button
            className={`toolbar-button toolbar-button-primary ${isStLinkConnected ? 'connected' : ''}`}
            onClick={onConnectStLink}
            title={isStLinkConnected ? '断开ST-Link' : '连接ST-Link'}
          >
            <FaLink />
            <span className="button-text">连接</span>
          </button>
          <button
            className="toolbar-button toolbar-button-primary"
            onClick={onFlash}
            disabled={!isStLinkConnected || isFlashing}
            title="烧录固件"
          >
            <RiFlashlightFill />
            <span className="button-text">下载</span>
            {isFlashing && <span className="toolbar-button-badge"></span>}
          </button>
          <button
            className="toolbar-button toolbar-button-primary"
            onClick={() => {/* 运行功能 */}}
            title="运行"
          >
            <FaPlay />
            <span className="button-text">运行</span>
          </button>
        </div>

        {/* 右侧工具按钮和信息 */}
        <div className="toolbar-section">
          <div className="toolbar-chip">
            <span className="toolbar-chip-label">MCU:</span>
            <select
              className="mcu-select"
              value={mcuModel}
              onChange={onMcuModelChange}
              title="选择MCU型号"
            >
              {MCU_MODELS.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          <div className="toolbar-chip">
            <span className="toolbar-chip-label">项目:</span>
            <span className="toolbar-chip-value">{currentProject ? currentProject.name : '未选择'}</span>
          </div>

          <button
            className="toolbar-button toolbar-button-primary"
            onClick={onLoadLedExample}
            title="加载LED示例"
          >
            <FaLightbulb />
            <span className="button-text">示例</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedToolbar;
