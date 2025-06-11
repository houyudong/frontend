import React, { useState, useEffect } from 'react';
import { FaFile, FaFolder, FaFolderOpen, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import './FileExplorer.css';
import fileService from '../utils/fileService';

// 递归渲染文件树
const FileTreeItem = ({ item, level, onFileClick, expandedFolders, toggleFolder }) => {
  const isFolder = item.is_dir || item.isDir || false;
  const isExpanded = expandedFolders.includes(item.path);
  const indent = level * 16; // 每级缩进16px

  const handleClick = () => {
    if (isFolder) {
      toggleFolder(item.path);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div>
      <div
        className={`file-tree-item ${isFolder ? 'folder' : 'file'} ${item.active ? 'active' : ''}`}
        style={{ paddingLeft: `${indent}px` }}
        onClick={handleClick}
      >
        {isFolder ? (
          <>
            <span className="folder-icon">
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </span>
            {isExpanded ? <FaFolderOpen className="icon" /> : <FaFolder className="icon" />}
          </>
        ) : (
          <FaFile className="icon" />
        )}
        <span className="name">{item.name}</span>
      </div>

      {isFolder && isExpanded && item.children && item.children.length > 0 && (
        <div className="folder-children">
          {item.children.map((child, index) => (
            <FileTreeItem
              key={child.path || index}
              item={child}
              level={level + 1}
              onFileClick={onFileClick}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer = ({ activeFile, onFileClick, onRefresh }) => {
  const [files, setFiles] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取项目文件
  useEffect(() => {
    const fetchProjectFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        // 使用fileService获取所有工程文件
        console.log('获取所有工程文件...');
        const allFiles = await fileService.getAllFiles();

        console.log('获取到文件列表:', allFiles.length);
        // 将文件列表转换为树形结构
        const fileTree = buildFileTree(allFiles);
        setFiles(fileTree);

        // 默认展开根目录和常用目录
        const defaultExpanded = ['', 'Core', 'Core/Inc', 'Core/Src', 'BSP', 'BSP/Inc', 'BSP/Src'];
        setExpandedFolders(defaultExpanded);
      } catch (err) {
        console.error('获取文件列表错误:', err);
        setError(`获取文件列表错误: ${err.message || '未知错误'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectFiles();
  }, []);

  // 构建文件树
  const buildFileTree = (fileList) => {
    // 创建文件树结构
    const fileTree = [];
    const dirMap = {}; // 用于存储目录节点的引用

    // 确保根目录存在 - 使用空名称，让服务端返回的根目录名称显示
    dirMap[''] = {
      name: '',  // 空名称，将显示服务端返回的根目录
      path: '',
      is_dir: true,
      children: []
    };
    fileTree.push(dirMap['']);

    // 按路径排序，确保父目录在前
    fileList.sort((a, b) => {
      // 确保 path 存在
      const pathA = a.path ? a.path.split('/').length : 0;
      const pathB = b.path ? b.path.split('/').length : 0;
      return pathA - pathB;
    });

    // 将文件添加到树中
    fileList.forEach(file => {
      // 跳过无效文件或根目录
      if (!file || !file.path) return;

      // 确保 path 是字符串
      const filePath = String(file.path);
      const pathParts = filePath.split('/');
      let parentPath = '';

      // 确保所有父目录都存在
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        const currentPath = parentPath ? `${parentPath}/${part}` : part;

        if (!dirMap[currentPath]) {
          // 创建新目录节点
          dirMap[currentPath] = {
            name: part,
            path: currentPath,
            is_dir: true,
            children: []
          };

          // 将新目录添加到父目录的子节点中
          if (parentPath === '') {
            // 如果父路径为空，则添加到根目录
            dirMap[''].children.push(dirMap[currentPath]);
          } else {
            // 否则添加到父目录
            dirMap[parentPath].children.push(dirMap[currentPath]);
          }
        }

        parentPath = currentPath;
      }

      // 添加文件或目录节点
      const fileName = pathParts[pathParts.length - 1];
      // 使用上面已经声明的 filePath 变量，不需要重新声明

      // 检查节点是否已存在
      const parentDir = parentPath === '' ? dirMap[''] : dirMap[parentPath];
      const existingNode = parentDir.children.find(child => child.name === fileName);

      if (!existingNode) {
        const newNode = {
          name: fileName,
          path: filePath,
          is_dir: file.is_dir || file.isDir || false,
          size: file.size,
          updated_at: file.updated_at || file.updatedAt
        };

        if (file.is_dir || file.isDir) {
          newNode.children = [];
          dirMap[filePath] = newNode;
        }

        parentDir.children.push(newNode);
      }
    });

    return fileTree;
  };

  // 切换文件夹展开/折叠状态
  const toggleFolder = (path) => {
    setExpandedFolders(prev => {
      if (prev.includes(path)) {
        return prev.filter(p => p !== path);
      } else {
        return [...prev, path];
      }
    });
  };

  // 处理文件点击
  const handleFileClick = async (file) => {
    // 如果是文件夹，获取子目录内容
    if (file.is_dir || file.isDir) {
      console.log('点击文件夹:', file.path);

      // 展开该文件夹
      toggleFolder(file.path);

      // 通过回调函数获取子目录内容
      if (onRefresh) {
        // 直接获取子目录内容，不再获取根目录内容
        // 这样可以避免闪烁
        onRefresh(file.path);
      }

      return;
    }

    try {
      console.log('处理文件点击:', file.name, '路径:', file.path);

      // 检查文件扩展名，只处理代码文件
      const fileExt = file.name.split('.').pop().toLowerCase();
      const isCodeFile = ['c', 'h', 'cpp', 'hpp', 'asm', 's', 'ld'].includes(fileExt);

      if (!isCodeFile) {
        console.log('非代码文件，跳过:', file.name);
        setError(`不支持的文件类型: ${fileExt}`);
        return;
      }

      // 使用fileService获取文件内容
      try {
        console.log('开始获取文件内容:', file.path);
        const fileData = await fileService.getFileContent(file.path);
        console.log('获取到文件内容:', fileData);

        // 检查文件内容是否为空
        if (!fileData || !fileData.content || fileData.content.trim() === '') {
          console.warn('文件内容为空:', file.name);
          setError(`文件内容为空: ${file.name}`);
          return;
        }

        console.log(`成功加载文件: ${fileData.name}, 内容长度: ${fileData.content.length}`);

        // 将文件内容传递给父组件
        onFileClick({
          name: fileData.name || file.name,
          path: file.path, // 使用原始路径，保持一致性
          content: fileData.content,
          size: fileData.size || file.size || 0,
          updated_at: fileData.updated_at || file.updated_at || new Date().toISOString()
        });
        setError(null); // 清除错误
      } catch (error) {
        console.error(`获取文件内容失败: ${file.name}`, error);
        setError(`获取文件内容失败: ${file.name} - ${error.message || '未知错误'}`);
      }
    } catch (err) {
      console.error('处理文件点击错误:', err);
      setError(`处理文件点击错误: ${err.message || '未知错误'}`);
    }
  };

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <h3>项目文件</h3>
      </div>
      <div className="file-tree">
        {loading && <div className="loading">加载中...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && files.map((item, index) => {
          // 如果是根节点且名称为空，使用默认名称
          if (item.path === '' && (!item.name || item.name === '')) {
            const rootItem = { ...item, name: 'STM32F103_LED' };
            return (
              <FileTreeItem
                key={rootItem.path || index}
                item={rootItem}
                level={0}
                onFileClick={handleFileClick}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
              />
            );
          }

          return (
            <FileTreeItem
              key={item.path || index}
              item={item}
              level={0}
              onFileClick={handleFileClick}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FileExplorer;
