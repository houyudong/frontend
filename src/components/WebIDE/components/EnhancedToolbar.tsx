import React from 'react';
import {
  FaPlay,
  FaStop,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaCode,
  FaBug,
  FaDownload,
  FaUpload,
  FaCog,
  FaFolder,
  FaFile,
  FaSave,
  FaTrash,
  FaUndo,
  FaRedo,
  FaSearch,
  FaBook
} from 'react-icons/fa';
import './EnhancedToolbar.css';

interface EnhancedToolbarProps {
  isConnected: boolean;
  isRunning: boolean;
  onBuild: () => void;
  onRun: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onStepOver: () => void;
  onStepInto: () => void;
  onStepOut: () => void;
  onFlash: () => void;
  onVerify: () => void;
  onErase: () => void;
  onSettings: () => void;
  onNewFile: () => void;
  onOpenFile: () => void;
  onSaveFile: () => void;
  onDeleteFile: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSearch: () => void;
  onShowDocs: () => void;
}

/**
 * EnhancedToolbar - 增强工具栏组件
 * 
 * 提供完整的IDE功能工具栏，包括文件操作、编译、调试、烧录等功能。
 * 
 * @param {EnhancedToolbarProps} props - 组件属性
 * @returns {React.ReactElement} 增强工具栏组件
 */
const EnhancedToolbar: React.FC<EnhancedToolbarProps> = ({
  isConnected,
  isRunning,
  onBuild,
  onRun,
  onStop,
  onPause,
  onResume,
  onStepOver,
  onStepInto,
  onStepOut,
  onFlash,
  onVerify,
  onErase,
  onSettings,
  onNewFile,
  onOpenFile,
  onSaveFile,
  onDeleteFile,
  onUndo,
  onRedo,
  onSearch,
  onShowDocs
}) => {
  return (
    <div className="enhanced-toolbar">
      <div className="toolbar-group">
        <button className="toolbar-button" onClick={onNewFile} title="新建文件">
          <FaFile />
        </button>
        <button className="toolbar-button" onClick={onOpenFile} title="打开文件">
          <FaFolder />
        </button>
        <button className="toolbar-button" onClick={onSaveFile} title="保存文件">
          <FaSave />
        </button>
        <button className="toolbar-button" onClick={onDeleteFile} title="删除文件">
          <FaTrash />
        </button>
      </div>
      <div className="toolbar-group">
        <button className="toolbar-button" onClick={onUndo} title="撤销">
          <FaUndo />
        </button>
        <button className="toolbar-button" onClick={onRedo} title="重做">
          <FaRedo />
        </button>
        <button className="toolbar-button" onClick={onSearch} title="搜索">
          <FaSearch />
        </button>
      </div>
      <div className="toolbar-group">
        <button className="toolbar-button" onClick={onBuild} title="编译">
          <FaCode />
        </button>
        <button
          className="toolbar-button"
          onClick={isRunning ? onStop : onRun}
          title={isRunning ? '停止' : '运行'}
        >
          {isRunning ? <FaStop /> : <FaPlay />}
        </button>
        <button
          className="toolbar-button"
          onClick={isRunning ? onPause : onResume}
          disabled={!isRunning}
          title={isRunning ? '暂停' : '继续'}
        >
          <FaPause />
        </button>
      </div>
      <div className="toolbar-group">
        <button
          className="toolbar-button"
          onClick={onStepOver}
          disabled={!isRunning}
          title="单步跳过"
        >
          <FaStepForward />
        </button>
        <button
          className="toolbar-button"
          onClick={onStepInto}
          disabled={!isRunning}
          title="单步进入"
        >
          <FaStepBackward />
        </button>
        <button
          className="toolbar-button"
          onClick={onStepOut}
          disabled={!isRunning}
          title="单步跳出"
        >
          <FaStepBackward />
        </button>
      </div>
      <div className="toolbar-group">
        <button
          className="toolbar-button"
          onClick={onFlash}
          disabled={!isConnected}
          title="烧录"
        >
          <FaDownload />
        </button>
        <button
          className="toolbar-button"
          onClick={onVerify}
          disabled={!isConnected}
          title="验证"
        >
          <FaUpload />
        </button>
        <button
          className="toolbar-button"
          onClick={onErase}
          disabled={!isConnected}
          title="擦除"
        >
          <FaTrash />
        </button>
      </div>
      <div className="toolbar-group">
        <button className="toolbar-button" onClick={onSettings} title="设置">
          <FaCog />
        </button>
        <button className="toolbar-button" onClick={onShowDocs} title="文档">
          <FaBook />
        </button>
      </div>
    </div>
  );
};

export default EnhancedToolbar; 