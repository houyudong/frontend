import React, { useState } from 'react';
import { FaFolder, FaFile, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import './FileExplorer.css';

interface File {
  name: string;
  path?: string;
  content?: string;
  active: boolean;
  size?: number;
  updated_at?: string;
}

interface FileExplorerProps {
  activeFile: number | null;
  onFileClick: (fileOrIndex: File | number) => Promise<void>;
  onRefresh: (path?: string, callback?: () => void) => void;
}

/**
 * FileExplorer - 文件浏览器组件
 * 
 * 用于显示和管理项目文件的树形结构。
 * 
 * @param {FileExplorerProps} props - 组件属性
 * @returns {React.ReactElement} 文件浏览器组件
 */
const FileExplorer: React.FC<FileExplorerProps> = ({
  activeFile,
  onFileClick,
  onRefresh
}) => {
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({});

  const toggleDirectory = (path: string): void => {
    setExpandedDirs(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleFileClick = async (file: File): Promise<void> => {
    if (file.path) {
      toggleDirectory(file.path);
    }
    await onFileClick(file);
  };

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <h3>文件浏览器</h3>
        <button onClick={() => onRefresh()}>刷新</button>
      </div>
      <div className="file-tree">
        {/* 这里需要实现文件树的渲染逻辑 */}
      </div>
    </div>
  );
};

export default FileExplorer; 