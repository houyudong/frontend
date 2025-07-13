import React, { useState, useEffect, useRef } from 'react';
import {
  FaSync,
  FaFolder,
  FaBook,
  FaSearch
} from 'react-icons/fa';
import './WebIDE.css';
import './tab-styles.css';

// 导入常量
import { TABS } from './constants';

// 导入自定义钩子
import {
  useFiles,
  useServiceStatus,
  useCompiler,
  useStLink,
  useDebugConsole,
  useDocPanel,
  useWorkspace
} from './hooks';
import type { File } from './hooks/useFiles';

// 导入工具类
import fileService from './utils/fileService';

// 导入组件
import {
  ProjectExplorer,
  CodeEditor,
  BuildPanel,
  DebugConsole,
  DocPanel,
  STLinkSettingsDialog,
  ProjectDialog,
  BuildSettings,
  FileExplorer,
  DebugPanel
} from './components';
import EnhancedToolbar from './components/EnhancedToolbar';
import StatusNotification from './components/StatusNotification';

// 类型定义
interface BuildSettings {
  optimizationLevel: string;
  debugInfo: boolean;
  targetMcu: string;
  outputFormat: string;
  additionalOptions: string;
}

interface ProjectFile {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: ProjectFile[];
}

interface CodeEditorProps {
  files: File[];
  activeFile: number | null;
  editorValue: string;
  onEditorChange: (value: string) => void;
  onEditorDidMount: (editor: any) => void;
  style?: React.CSSProperties;
}

interface ProjectDialogProps {
  show: boolean;
  onClose: () => void;
  onCreateProject: () => Promise<void>;
  onOpenProject: () => Promise<void>;
  projects?: ProjectFile[];
  isCreating?: boolean;
}

interface BuildSettingsProps {
  show: boolean;
  onClose: () => void;
  onSave: (settings: BuildSettings) => void;
  settings?: BuildSettings;
}

interface STLinkSettingsDialogProps {
  show: boolean;
  onClose: () => void;
}

interface StatusNotificationProps {
  type: string;
  title: string;
  message: React.ReactNode;
  show: boolean;
  onClose: () => void;
  actions?: any[];
  dismissible?: boolean;
  autoHideDuration?: number;
}

/**
 * WebIDE - Web集成开发环境组件
 *
 * 提供完整的STM32程序开发环境，包括代码编辑、编译、烧录和调试功能。
 * 集成了文件浏览器、代码编辑器、构建面板、调试控制台和文档面板等功能。
 * 支持连接ST-Link调试器，烧录程序到STM32开发板。
 *
 * @component
 * @example
 * ```tsx
 * <WebIDE />
 * ```
 *
 * @returns {ReactElement} WebIDE组件
 */
const WebIDE: React.FC = () => {
  // 编辑器引用
  const editorRef = useRef<any>(null);

  // MCU 模型
  const [mcuModel, setMcuModel] = useState<string>('STM32F103C8T6');

  // 输出面板状态
  const [activeTab, setActiveTab] = useState<string>(TABS.CONSOLE_OUTPUT);

  // 调试会话ID
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  // 调试面板状态
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);

  // 切换调试面板
  const toggleDebugPanel = (): void => {
    setShowDebugPanel(!showDebugPanel);
  };

  // 项目对话框状态
  const [showProjectDialog, setShowProjectDialog] = useState<boolean>(false);

  // 构建设置状态
  const [showBuildSettings, setShowBuildSettings] = useState<boolean>(false);
  const [buildSettings, setBuildSettings] = useState<BuildSettings>({
    optimizationLevel: 'debug',
    debugInfo: true,
    targetMcu: mcuModel,
    outputFormat: 'hex',
    additionalOptions: ''
  });

  // 构建模式
  const [buildMode, setBuildMode] = useState<string>('debug');

  // 服务状态通知
  const [serviceError, setServiceError] = useState<boolean>(false);
  const [serviceErrorMessage, setServiceErrorMessage] = useState<string>('');

  // 使用自定义钩子
  const {
    debugOutput,
    appendToDebugOutput,
    clearDebugOutput
  } = useDebugConsole();

  const {
    checkServiceStatus
  } = useServiceStatus(appendToDebugOutput, setServiceError, setServiceErrorMessage);

  const {
    files,
    activeFile,
    editorValue,
    setFiles,
    setActiveFile,
    setEditorValue,
    handleEditorChange
  } = useFiles();

  // 处理文件点击 - 从文件浏览器或编辑器标签
  const handleFileClick = async (fileOrIndex: File | number): Promise<void> => {
    try {
      // 如果是数字索引，直接切换到该文件
      if (typeof fileOrIndex === 'number') {
        const index = fileOrIndex;
        if (index >= 0 && index < files.length) {
          const newFiles = files.map((f, i) => ({
            ...f,
            active: i === index
          }));
          setFiles(newFiles);
          setActiveFile(index);
          setEditorValue(files[index].content || '');
          console.log('切换到文件索引:', index, '文件名:', files[index].name);
        }
        return;
      }

      // 处理文件对象
      const file = fileOrIndex;
      console.log('处理文件点击:', file);

      // 如果是从ProjectExplorer点击的文件，需要先获取文件内容
      if (!file.content && file.path) {
        try {
          console.log('获取文件内容:', file.path);
          const fileData = await fileService.getFileContent(file.path);
          console.log('获取到文件内容:', fileData);

          if (!fileData || !fileData.content) {
            console.error('文件内容为空:', file.path);
            appendToDebugOutput(`❌ 文件内容为空: ${file.name || file.path}`);
            return;
          }

          // 更新文件对象，添加内容
          file.content = fileData.content;
          file.size = fileData.size || 0;
          file.updated_at = fileData.updated_at || new Date().toISOString();

          if (file.content) {
            console.log('文件内容获取成功:', file.name, '长度:', file.content.length);
            appendToDebugOutput(`✅ 加载文件: ${file.name}`);
          }
        } catch (error) {
          console.error('获取文件内容失败:', error);
          appendToDebugOutput(`❌ 获取文件内容失败: ${file.path} - ${(error as Error).message || '未知错误'}`);
          return;
        }
      }

      // 检查文件是否已经在编辑器中打开
      const existingIndex = files.findIndex(f =>
        (f.path && file.path && f.path === file.path) ||
        (f.name === file.name)
      );

      if (existingIndex >= 0) {
        // 如果文件已经打开，切换到该文件
        const newFiles = files.map((f, i) => ({
          ...f,
          active: i === existingIndex
        }));
        setFiles(newFiles);
        setActiveFile(existingIndex);
        setEditorValue(files[existingIndex].content || '');
        console.log('切换到已打开的文件:', file.name);
      } else {
        // 如果文件未打开，添加到文件列表
        const newFile: File = {
          name: file.name,
          path: file.path,
          content: file.content,
          active: true
        };

        // 更新文件列表，将新文件设为活动文件
        const newFiles = files.map(f => ({ ...f, active: false }));
        newFiles.push(newFile);

        setFiles(newFiles);
        setActiveFile(newFiles.length - 1);
        setEditorValue(newFile.content || '');
        console.log('添加新文件到编辑器:', file.name);
      }
    } catch (err) {
      console.error('处理文件点击错误:', err);
      appendToDebugOutput(`❌ 处理文件点击错误: ${(err as Error).message || '未知错误'}`);
    }
  };

  // 处理保存文件
  const handleSaveFile = async (): Promise<void> => {
    if (activeFile !== null && files[activeFile]) {
      const currentFile = files[activeFile];
      try {
        await saveFileContent(currentFile.path || currentFile.name, currentFile.content || '');
        appendToDebugOutput(`✅ 文件 ${currentFile.name} 保存成功`);
      } catch (error) {
        console.error('保存文件失败:', error);
        appendToDebugOutput(`❌ 保存文件失败: ${(error as Error).message || '未知错误'}`);
      }
    } else {
      appendToDebugOutput('❌ 没有活动文件可保存');
    }
  };

  // Call useStLink before useCompiler to avoid circular dependency
  const {
    isStLinkConnected,
    isFlashing,
    isErasing,
    showStLinkSettings,
    handleOpenStLinkSettings,
    handleCloseStLinkSettings,
    handleConnectStLink,
    getHexFiles,
    handleEraseDevice,
    handleFlash,
    sessionId
  } = useStLink(mcuModel, setActiveTab, TABS, appendToDebugOutput, setCurrentSessionId);

  // Now we can safely use getHexFiles since it's already defined
  const {
    isBuilding,
    buildOutput,
    buildErrors,
    setBuildOutput,
    setBuildErrors,
    handleBuild
  } = useCompiler(mcuModel, setActiveTab, TABS, getHexFiles, appendToDebugOutput);

  const {
    showDocPanel,
    activeDocTab,
    setActiveDocTab,
    searchQuery,
    setSearchQuery,
    searchResults,
    handleSearchDocs,
    toggleDocPanel
  } = useDocPanel();

  // 使用workspace目录项目管理钩子
  const {
    projectFiles,
    isLoading: isProjectLoading,
    fetchProjectFiles,
    createNewFile,
    createNewFolder,
    saveFileContent
  } = useWorkspace(appendToDebugOutput);

  // 编辑器初始化
  const handleEditorDidMount = (editor: any): void => {
    editorRef.current = editor;
  };

  // 处理MCU型号变更
  const handleMcuModelChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setMcuModel(e.target.value);
  };

  // 加载LED示例项目
  const handleLoadLedExample = (): void => {
    // 直接使用 fetchProjectFiles 获取 workspace 目录下的文件
    fetchProjectFiles();
    // 设置 MCU 型号为 STM32F103C8T6
    setMcuModel('STM32F103C8T6');
    appendToDebugOutput('✅ 加载 STM32F103_LED 示例项目');
  };

  // 处理打开项目对话框
  const handleOpenProjectDialog = (): void => {
    setShowProjectDialog(true);
  };

  // 处理关闭项目对话框
  const handleCloseProjectDialog = (): void => {
    setShowProjectDialog(false);
  };

  // 处理创建项目
  const handleCreateProject = async (): Promise<void> => {
    // 直接关闭对话框，不再需要创建项目
    setShowProjectDialog(false);
    // 刷新文件列表
    fetchProjectFiles();
  };

  // 处理打开项目
  const handleOpenProject = async (): Promise<void> => {
    // 直接关闭对话框，不再需要打开项目
    setShowProjectDialog(false);
    // 刷新文件列表
    fetchProjectFiles();
  };

  // 处理打开构建设置
  const handleOpenBuildSettings = (): void => {
    setShowBuildSettings(true);
  };

  // 处理关闭构建设置
  const handleCloseBuildSettings = (): void => {
    setShowBuildSettings(false);
  };

  // 处理保存构建设置
  const handleSaveBuildSettings = (settings: BuildSettings): void => {
    setBuildSettings(settings);
    setBuildMode(settings.optimizationLevel);
    setMcuModel(settings.targetMcu);
  };

  // 处理新建文件
  const handleCreateNewFile = async (): Promise<void> => {
    const fileName = prompt('请输入文件名:');
    if (fileName) {
      await createNewFile(fileName);
      // 刷新文件列表
      fetchProjectFiles();
    }
  };

  // 处理新建文件夹
  const handleCreateNewFolder = async (): Promise<void> => {
    const folderName = prompt('请输入文件夹名:');
    if (folderName) {
      await createNewFolder(folderName);
      // 刷新文件列表
      fetchProjectFiles();
    }
  };

  // 处理刷新项目文件
  const handleRefreshProjectFiles = (path?: string, callback?: () => void): void => {
    console.log('刷新项目文件，路径:', path);

    // 如果提供了路径，刷新该路径下的文件
    // 否则刷新根目录下的文件
    fetchProjectFiles(true, path || '', callback);

    // 只有在刷新特定路径时才输出日志，避免重复输出
    if (path) {
      appendToDebugOutput(`✅ 刷新目录: ${path}`);
    }
  };

  // 初始化检查服务状态
  useEffect(() => {
    // 添加全局错误处理
    const handleGlobalError = (event: ErrorEvent): void => {
      console.error('全局错误:', event.error || event.message);
      appendToDebugOutput(`❌ 发生错误: ${event.error?.message || event.message || '未知错误'}`);
    };

    // 添加未处理的Promise拒绝处理
    const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
      console.error('未处理的Promise拒绝:', event.reason);
      appendToDebugOutput(`❌ 网络请求失败: ${(event.reason as Error)?.message || '未知错误'}`);
    };

    // 注册错误处理器
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // 检查服务状态
    const checkStatus = async (): Promise<void> => {
      try {
        // 先检查服务状态，但不重复输出状态信息
        const isReady = await checkServiceStatus(false);

        // 如果服务正常，获取项目文件，但不重复输出获取成功信息
        if (isReady) {
          await fetchProjectFiles(false);
        }
      } catch (error) {
        console.error('初始化失败:', error);
        appendToDebugOutput(`❌ 初始化失败: ${(error as Error).message || '未知错误'}`);
      }
    };

    checkStatus();

    // 清理函数
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 清除编译输出
  const clearBuildOutput = (): void => {
    setBuildOutput('');
    // 同时清除编译错误
    setBuildErrors([]);
  };

  // 渲染输出面板内容
  const renderTabContent = (): JSX.Element => {
    return (
      <>
        {activeTab === TABS.ERROR_OUTPUT && (
          <BuildPanel buildOutput={buildOutput} buildErrors={buildErrors} onClear={clearBuildOutput} />
        )}
        {activeTab === TABS.CONSOLE_OUTPUT && (
          <DebugConsole debugOutput={debugOutput} onClear={clearDebugOutput} />
        )}
      </>
    );
  };

  // 活动栏状态
  const [activeView, setActiveView] = useState<string>('explorer');

  // 处理活动栏点击
  const handleActivityBarClick = (view: string): void => {
    setActiveView(view);
  };

  // 处理面板大小调整
  const [panelHeight, setPanelHeight] = useState<number>(300);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startDragY = useRef<number>(0);
  const startHeight = useRef<number>(0);

  const handlePanelResizeStart = (e: React.MouseEvent): void => {
    e.preventDefault();
    setIsDragging(true);
    startDragY.current = e.clientY;
    startHeight.current = panelHeight;

    // 添加全局事件监听
    document.addEventListener('mousemove', handlePanelResizeMove);
    document.addEventListener('mouseup', handlePanelResizeEnd);
  };

  const handlePanelResizeMove = (e: MouseEvent): void => {
    if (isDragging) {
      const deltaY = startDragY.current - e.clientY;
      const newHeight = Math.max(100, Math.min(600, startHeight.current + deltaY));
      setPanelHeight(newHeight);
    }
  };

  const handlePanelResizeEnd = (): void => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handlePanelResizeMove);
    document.removeEventListener('mouseup', handlePanelResizeEnd);
  };

  // 清理拖拽事件监听
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handlePanelResizeMove);
      document.removeEventListener('mouseup', handlePanelResizeEnd);
    };
  }, []);

  return (
    <div className="webide-container">
      <EnhancedToolbar
        isConnected={isStLinkConnected}
        isRunning={false}
        onBuild={handleBuild}
        onRun={() => {
          setActiveTab(TABS.CONSOLE_OUTPUT);
          clearDebugOutput();
          // TODO: 实现运行功能
        }}
        onStop={() => {
          setActiveTab(TABS.CONSOLE_OUTPUT);
          clearDebugOutput();
          // TODO: 实现停止功能
        }}
        onPause={() => {
          setActiveTab(TABS.CONSOLE_OUTPUT);
          clearDebugOutput();
          // TODO: 实现暂停功能
        }}
        onResume={() => {
          setActiveTab(TABS.CONSOLE_OUTPUT);
          clearDebugOutput();
          // TODO: 实现继续功能
        }}
        onStepOver={() => {
          setActiveTab(TABS.CONSOLE_OUTPUT);
          clearDebugOutput();
          // TODO: 实现单步跳过功能
        }}
        onStepInto={() => {
          setActiveTab(TABS.CONSOLE_OUTPUT);
          clearDebugOutput();
          // TODO: 实现单步进入功能
        }}
        onStepOut={() => {
          setActiveTab(TABS.CONSOLE_OUTPUT);
          clearDebugOutput();
          // TODO: 实现单步跳出功能
        }}
        onFlash={handleFlash}
        onVerify={() => {
          setActiveTab(TABS.CONSOLE_OUTPUT);
          clearDebugOutput();
          // TODO: 实现验证功能
        }}
        onErase={handleEraseDevice}
        onSettings={handleOpenStLinkSettings}
        onNewFile={handleCreateNewFile}
        onOpenFile={() => {
          // TODO: 实现打开文件功能
        }}
        onSaveFile={handleSaveFile}
        onDeleteFile={() => {
          // TODO: 实现删除文件功能
        }}
        onUndo={() => {
          // TODO: 实现撤销功能
        }}
        onRedo={() => {
          // TODO: 实现重做功能
        }}
        onSearch={() => {
          // TODO: 实现搜索功能
        }}
        onShowDocs={toggleDocPanel}
      />

      <div className="main-content" style={{ display: 'flex', margin: 0, padding: 0 }}>
        {/* 活动栏和侧边栏容器 */}
        <div style={{ display: 'flex', margin: 0, padding: 0 }}>
          {/* 活动栏 - VSCode风格 - 移除了调试和设置按钮 */}
          <div className="activity-bar" style={{ margin: 0, padding: 0 }}>
            <div
              className={`activity-bar-icon ${activeView === 'explorer' ? 'active' : ''}`}
              onClick={() => handleActivityBarClick('explorer')}
              title="资源管理器"
            >
              <FaFolder />
            </div>
            <div
              className={`activity-bar-icon ${activeView === 'search' ? 'active' : ''}`}
              onClick={() => handleActivityBarClick('search')}
              title="搜索"
            >
              <FaSearch />
            </div>
            <div
              className={`activity-bar-icon ${activeView === 'docs' ? 'active' : ''}`}
              onClick={() => toggleDocPanel()}
              title="文档"
            >
              <FaBook />
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="sidebar" style={{ margin: 0, padding: 0, borderLeft: 'none' }}>
            <div className="sidebar-header">
              {activeView === 'search' && '搜索'}
              {activeView === 'debug' && '调试'}
              {activeView === 'docs' && '文档'}
              {activeView === 'settings' && '设置'}
            </div>

            {/* 根据活动视图显示不同内容 */}
            {activeView === 'explorer' && (
              <>
                <ProjectExplorer
                  projectFiles={projectFiles}
                  activeFilePath={activeFile !== null ? files[activeFile].name : ''}
                  onFileClick={handleFileClick}
                  onNewFile={handleCreateNewFile}
                  onNewFolder={handleCreateNewFolder}
                  onRefresh={handleRefreshProjectFiles}
                />
                <div className="template-files-section">
                  <h3>示例项目文件</h3>
                  <FileExplorer
                    activeFile={activeFile}
                    onFileClick={handleFileClick}
                    onRefresh={handleRefreshProjectFiles}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="editor-output-container" style={{ margin: 0, padding: 0, borderLeft: '1px solid #3c3c3c' }}>
          {/* 编辑器标签栏 */}
          <div className="editor-tabs">
            {files.map((file, index) => (
              <div
                key={index}
                className={`editor-tab ${index === activeFile ? 'active' : ''}`}
                onClick={() => handleFileClick(index)}
              >
                <span className="editor-tab-name">{file.name}</span>
                <span
                  className="editor-tab-close"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    // 关闭标签的逻辑
                    const newFiles = files.filter((_, i) => i !== index);
                    setFiles(newFiles);

                    // 如果关闭的是当前活动文件，则切换到其他文件
                    if (index === activeFile) {
                      if (newFiles.length > 0) {
                        // 如果还有其他文件，切换到前一个或后一个
                        const newActiveIndex = index === 0 ? 0 : index - 1;
                        setActiveFile(newActiveIndex);
                        setEditorValue(newFiles[newActiveIndex].content || '');
                      } else {
                        // 如果没有文件了，清空编辑器
                        setActiveFile(null);
                        setEditorValue('');
                      }
                    } else if (activeFile !== null && index < activeFile) {
                      // 如果关闭的是当前活动文件之前的文件，需要调整activeFile索引
                      setActiveFile(activeFile - 1);
                    }
                  }}
                >
                  ×
                </span>
              </div>
            ))}
          </div>

          {/* 编辑器内容区域 */}
          <div className="editor-content" style={{
            margin: 0,
            padding: 0,
            border: 'none',
            display: 'flex',
            flexDirection: 'row'
          }}>
            {/* 代码编辑器 */}
            <div style={{
              flex: showDebugPanel ? '60%' : '100%',
              transition: 'flex 0.3s ease',
              height: '100%'
            }}>
              <CodeEditor
                files={files}
                activeFile={activeFile}
                editorValue={editorValue}
                onEditorChange={handleEditorChange}
                onEditorDidMount={handleEditorDidMount}
                style={{ margin: 0, padding: 0, border: 'none' }}
              />
            </div>

            {/* 调试面板 */}
            {showDebugPanel && (
              <div style={{
                flex: '40%',
                borderLeft: '1px solid #3c3c3c',
                overflow: 'hidden',
                position: 'relative',
                height: '100%',
                transition: 'flex 0.3s ease'
              }}>
                <DebugPanel
                  sessionId={currentSessionId}
                  appendToDebugOutput={appendToDebugOutput}
                />
              </div>
            )}
          </div>

          {/* 输出面板 */}
          <div className="output-panel" style={{ height: `${panelHeight}px` }}>
            <div className="panel-resize-handle" onMouseDown={handlePanelResizeStart}></div>
            <div className="tab-buttons">
              <button
                className={`tab-button ${activeTab === TABS.ERROR_OUTPUT ? 'active' : ''}`}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  setActiveTab(TABS.ERROR_OUTPUT);
                }}
                onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
              >
                错误信息
              </button>
              <button
                className={`tab-button ${activeTab === TABS.CONSOLE_OUTPUT ? 'active' : ''}`}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  setActiveTab(TABS.CONSOLE_OUTPUT);
                }}
                onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
              >
                控制台
              </button>
              <div className="tab-spacer"></div>
              {activeTab === TABS.ERROR_OUTPUT ? (
                <button
                  className="clear-button"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    clearBuildOutput();
                  }}
                  title="清除错误信息"
                >
                  清除
                </button>
              ) : activeTab === TABS.CONSOLE_OUTPUT ? (
                <button
                  className="clear-button"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    clearDebugOutput();
                  }}
                  title="清除控制台"
                >
                  清除
                </button>
              ) : null}
            </div>
            <div className="tab-content">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {showDocPanel && (
          <DocPanel
            activeDocTab={activeDocTab}
            onTabChange={setActiveDocTab}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            searchResults={searchResults}
            onSearch={handleSearchDocs}
          />
        )}

        {/* 项目对话框 */}
        {showProjectDialog && (
          <ProjectDialog
            show={showProjectDialog}
            onClose={handleCloseProjectDialog}
            onCreateProject={handleCreateProject}
            onOpenProject={handleOpenProject}
          />
        )}

        {/* 构建设置对话框 */}
        {showBuildSettings && (
          <BuildSettings
            show={showBuildSettings}
            onClose={handleCloseBuildSettings}
            onSave={handleSaveBuildSettings}
            settings={buildSettings}
          />
        )}

        {/* ST-Link设置对话框 */}
        {showStLinkSettings && (
          <STLinkSettingsDialog
            show={showStLinkSettings}
            onClose={handleCloseStLinkSettings}
          />
        )}

        {/* 服务状态通知 */}
        {serviceError && (
          <StatusNotification
            type="error"
            title="服务错误"
            message={serviceErrorMessage}
            show={serviceError}
            onClose={() => setServiceError(false)}
            actions={[]}
            dismissible={true}
            autoHideDuration={5000}
          />
        )}
      </div>
    </div>
  );
};

export default WebIDE; 