import React from 'react';
import {
  FaSave,
  FaTerminal,
  FaDownload,
  FaBug,
  FaLink,
  FaStop,
  FaPlay,
  FaBook,
  FaCog,
  FaFolder,
  FaWrench,
  FaCode,
  FaSearch,
  FaPlus,
  FaChevronDown,
  FaLightbulb
} from 'react-icons/fa';
import { RiFlashlightFill } from 'react-icons/ri';
import { IoMdBuild } from 'react-icons/io';
import { MCU_MODELS } from '../constants';
import './Toolbar.css';

const Toolbar = ({
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
  onLoadLedExample,
  onOpenProjectDialog,
  onOpenBuildSettings,
  buildMode = 'debug',
  currentProject = null
}) => {
  return (
    <div className="toolbar">
      {/* 主工具栏 */}
      <div className="toolbar-main">
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
            onClick={() => {/* 调试功能 */}}
            title="调试"
          >
            <FaBug />
            <span className="button-text">调试</span>
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

export default Toolbar;
