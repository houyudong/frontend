// 导出所有组件
export { default as FileExplorer } from './FileExplorer';
export { default as ProjectExplorer } from './ProjectExplorer';
export { default as CodeEditor } from './CodeEditor';
export { default as Toolbar } from './Toolbar'; // 保留原始Toolbar以兼容旧代码
export { default as EnhancedToolbar } from './EnhancedToolbar'; // 新增增强版工具栏
export { default as BuildPanel } from './BuildPanel';
export { default as DebugConsole } from './DebugConsole';
export { default as FlashPanel } from './FlashPanel';
export { default as STLinkPanel } from './STLinkPanel';
export { default as DocPanel } from './DocPanel';
export { default as STLinkSettingsDialog } from './dialogs/STLinkSettingsDialog';
export { default as DebugPanel } from './DebugPanel'; // 新增调试面板
// ServiceStatusDialog 已被 StatusNotification 替代
export { default as ProjectDialog } from './dialogs/ProjectDialog';

// 构建设置对话框
export { default as BuildSettings } from './dialogs/BuildSettings';
