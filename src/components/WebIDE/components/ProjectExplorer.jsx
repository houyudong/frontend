import React, { useState, useEffect, useRef } from 'react';
import {
  FaFolder,
  FaFolderOpen,
  FaFile,
  FaChevronRight,
  FaChevronDown,
  FaPlus,
  FaFileAlt,
  FaFolderPlus,
  FaSync,
  FaEllipsisH,
  FaCopy,
  FaCut,
  FaPaste,
  FaTrashAlt,
  FaEdit,
  FaDownload,
  FaSpinner
} from 'react-icons/fa';
import './ProjectExplorer.css';

// 文件类型图标映射 - 扩展更多文件类型
const FILE_ICONS = {
  // C/C++ 文件
  '.c': <FaFile className="file-icon c-file" />,
  '.h': <FaFile className="file-icon h-file" />,
  '.cpp': <FaFile className="file-icon c-file" />,
  '.hpp': <FaFile className="file-icon h-file" />,

  // 汇编文件
  '.s': <FaFile className="file-icon asm-file" />,
  '.asm': <FaFile className="file-icon asm-file" />,

  // 链接器脚本
  '.ld': <FaFile className="file-icon ld-file" />,
  '.scf': <FaFile className="file-icon ld-file" />,

  // 二进制文件
  '.hex': <FaFile className="file-icon hex-file" />,
  '.bin': <FaFile className="file-icon bin-file" />,
  '.elf': <FaFile className="file-icon elf-file" />,
  '.axf': <FaFile className="file-icon elf-file" />,

  // 调试文件
  '.map': <FaFile className="file-icon map-file" />,
  '.lst': <FaFile className="file-icon map-file" />,

  // 文本文件
  '.txt': <FaFile className="file-icon txt-file" />,
  '.md': <FaFile className="file-icon md-file" />,
  '.log': <FaFile className="file-icon txt-file" />,

  // 配置文件
  '.json': <FaFile className="file-icon json-file" />,
  '.xml': <FaFile className="file-icon xml-file" />,
  '.yaml': <FaFile className="file-icon json-file" />,
  '.yml': <FaFile className="file-icon json-file" />,

  // 构建文件
  'makefile': <FaFile className="file-icon makefile" />,
  '.mk': <FaFile className="file-icon makefile" />,

  // 默认图标
  'default': <FaFile className="file-icon" />
};

// 获取文件图标
const getFileIcon = (fileName) => {
  // 如果文件名为空或未定义，返回默认图标
  if (!fileName) {
    return FILE_ICONS.default;
  }

  // 确保文件名是字符串
  const name = String(fileName);

  // 检查是否为Makefile（无扩展名）
  if (name.toLowerCase() === 'makefile') {
    return FILE_ICONS['makefile'];
  }

  // 获取文件扩展名
  const lastDotIndex = name.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return FILE_ICONS.default;
  }

  const ext = name.substring(lastDotIndex).toLowerCase();
  return FILE_ICONS[ext] || FILE_ICONS.default;
};

// 树节点组件
const TreeNode = ({
  node,
  level,
  onFileClick,
  activeFilePath,
  onContextMenu,
  onSubdirContent
}) => {
  const [isOpen, setIsOpen] = useState(node.isExpanded || false);
  const [isLoading, setIsLoading] = useState(false); // 添加加载状态
  const nodeRef = useRef(null);
  const indent = level * 16; // 每级缩进16px

  // 自动展开包含活动文件的目录
  useEffect(() => {
    if (node.isDir && !isOpen && node.children) {
      // 检查是否有子节点匹配活动文件路径
      const hasActiveChild = node.children.some(child => {
        if (!child.isDir && child.path === activeFilePath) {
          return true;
        }
        // 检查活动文件是否在此目录的子路径中
        if (child.isDir && activeFilePath && activeFilePath.startsWith(child.path + '/')) {
          return true;
        }
        return false;
      });

      if (hasActiveChild) {
        setIsOpen(true);
      }
    }
  }, [node, activeFilePath, isOpen]);

  // 不再在组件内部导入 fileService

  // 处理点击事件
  const handleClick = async (e) => {
    e.stopPropagation();
    if (node.isDir) {
      // 如果是目录，切换展开状态
      setIsOpen(!isOpen);

      // 如果是首次展开目录，尝试获取子目录内容
      if (!isOpen && (!node.children || node.children.length === 0)) {
        try {
          console.log('尝试获取子目录内容:', node.path);

          // 设置加载状态
          setIsLoading(true);

          // 如果路径是 '/'，使用空字符串
          const path = node.path === '/' ? '' : node.path;

          // 不再直接调用 fileService，而是通过回调函数
          console.log('请求获取子目录内容:', path);

          // 调用父组件的回调函数
          if (onSubdirContent) {
            // 传递一个回调函数，在加载完成后关闭加载状态
            onSubdirContent(path, () => {
              setIsLoading(false);
            });
          } else {
            // 如果没有回调函数，直接关闭加载状态
            setIsLoading(false);
          }

          // 子目录内容将通过回调函数更新
          console.log('子目录内容将通过回调函数更新到树中');
        } catch (error) {
          console.error('获取子目录内容失败:', error);
          // 出错时也要关闭加载状态
          setIsLoading(false);
        }
      }
    } else {
      onFileClick(node);
    }
  };

  // 处理右键菜单
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContextMenu) {
      const rect = nodeRef.current.getBoundingClientRect();
      onContextMenu(e, node, { x: rect.left, y: rect.bottom });
    }
  };

  // 判断是否为活动文件
  const isActive = !node.isDir && activeFilePath === node.path;

  // 确保节点有名称
  const nodeName = node.name || '';

  return (
    <div className="tree-node" ref={nodeRef}>
      <div
        className={`tree-node-content ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: `${indent}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {node.isDir && (
          <span className="tree-node-icon">
            {isOpen ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
          </span>
        )}
        <span className="tree-node-icon">
          {node.isDir ?
            (isLoading ?
              <FaSpinner className="loading-icon spin" /> :
              (isOpen ? <FaFolderOpen className="folder-open-icon" /> : <FaFolder className="folder-icon" />)
            ) :
            getFileIcon(nodeName)
          }
        </span>
        <span className="tree-node-label">{nodeName}</span>
        {isLoading && <span className="loading-text">加载中...</span>}
      </div>

      {node.isDir && isOpen && node.children && (
        <div className="tree-node-children">
          {node.children.length > 0 ? (
            node.children
              .filter(childNode => childNode) // 过滤掉无效的子节点
              .map((childNode, index) => (
                <TreeNode
                  key={childNode.path || index}
                  node={childNode}
                  level={level + 1}
                  onFileClick={onFileClick}
                  activeFilePath={activeFilePath}
                  onContextMenu={onContextMenu}
                  onSubdirContent={onSubdirContent}
                />
              ))
          ) : (
            <div
              className="tree-node-content"
              style={{ paddingLeft: `${(level + 1) * 16 + 22}px`, fontStyle: 'italic', opacity: 0.6 }}
            >
              空文件夹
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 上下文菜单组件
const ContextMenu = ({ x, y, items, onClose }) => {
  const menuRef = useRef(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="context-menu"
      ref={menuRef}
      style={{
        left: `${x}px`,
        top: `${y}px`
      }}
    >
      {items.map((item, index) => (
        item.separator ? (
          <div key={`sep-${index}`} className="context-menu-separator" />
        ) : (
          <div
            key={item.label || index}
            className="context-menu-item"
            onClick={() => {
              item.action();
              onClose();
            }}
          >
            {item.icon && <span className="context-menu-icon">{item.icon}</span>}
            {item.label}
          </div>
        )
      ))}
    </div>
  );
};

// 项目浏览器组件
const ProjectExplorer = ({
  projectFiles,
  activeFilePath,
  onFileClick,
  onNewFile,
  onNewFolder,
  onRefresh,
  projectName = "STM32 Project"
}) => {
  const [treeData, setTreeData] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // 不再在组件内部导入 fileService

  // 处理子目录内容更新
  const handleSubdirContent = (path, callback) => {
    console.log('处理子目录内容更新:', path);

    // 如果路径是 '/'，使用空字符串
    const apiPath = path === '/' ? '' : path;

    // 直接调用 onRefresh 回调函数，传递路径参数
    if (onRefresh) {
      // 不再获取根目录内容，直接获取子目录内容
      // 这样可以避免闪烁
      onRefresh(apiPath, () => {
        // 加载完成后执行回调
        if (callback && typeof callback === 'function') {
          callback();
        }
      });
    } else {
      console.warn('onRefresh 回调函数未定义，无法刷新树');
      // 如果没有回调函数，直接执行回调
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  };

  // 将平面文件列表转换为树形结构
  useEffect(() => {
    // 打印接收到的文件列表，帮助调试
    console.log('ProjectExplorer 接收到的文件列表:', projectFiles);

    if (projectFiles && projectFiles.length > 0) {
      const root = {
        name: projectName,
        isDir: true,
        children: [],
        isExpanded: true,
        path: '/'
      };

      // 按路径排序，确保父目录在子目录之前处理
      const sortedFiles = [...projectFiles]
        .filter(file => file && file.path) // 过滤掉没有路径的文件
        .sort((a, b) => {
          const pathA = a.path ? a.path.split('/').length : 0;
          const pathB = b.path ? b.path.split('/').length : 0;
          return pathA - pathB;
        });

      // 构建树结构
      sortedFiles.forEach(file => {
        // 跳过没有路径的文件
        if (!file || !file.path) return;

        const pathParts = file.path.split('/').filter(part => part);
        let currentNode = root;

        // 处理目录部分
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          let found = currentNode.children.find(child => child.name === part);

          if (!found) {
            const newDir = {
              name: part,
              isDir: true,
              children: [],
              path: pathParts.slice(0, i + 1).join('/')
            };
            currentNode.children.push(newDir);
            found = newDir;
          }

          currentNode = found;
        }

        // 添加文件或目录
        // 检查文件是否是目录（同时检查 isDir 和 is_dir 属性）
        const isDirectory = file.isDir || file.is_dir || false;
        const fileName = pathParts[pathParts.length - 1];

        // 如果是顶级目录（路径只有一部分）且是目录
        if (pathParts.length === 1 && isDirectory) {
          // 检查根目录中是否已经有这个目录
          const existingDir = root.children.find(child => child.name === fileName);
          if (!existingDir) {
            // 添加顶级目录
            root.children.push({
              name: fileName,
              isDir: true,
              children: [],
              path: file.path,
              size: file.size,
              updatedAt: file.updatedAt || file.updated_at
            });
          }
        }
        // 如果是子目录，添加到当前节点
        else if (isDirectory && pathParts.length > 1) {
          // 检查当前节点中是否已经有这个目录
          const existingDir = currentNode.children.find(child => child.name === fileName && child.isDir);
          if (!existingDir) {
            // 添加子目录
            currentNode.children.push({
              name: fileName,
              isDir: true,
              children: [],
              path: file.path,
              size: file.size,
              updatedAt: file.updatedAt || file.updated_at
            });
          }
        }
        // 如果是文件，添加到当前节点
        else if (!isDirectory) {
          // 检查当前节点中是否已经有这个文件
          const existingFile = currentNode.children.find(child => child.name === fileName && !child.isDir);
          if (!existingFile) {
            // 添加文件
            currentNode.children.push({
              name: fileName,
              isDir: false,
              path: file.path,
              size: file.size,
              updatedAt: file.updatedAt || file.updated_at
            });
          }
        }
      });

      // 对每个节点的子节点进行排序：目录在前，文件在后，按名称字母顺序排序
      const sortNode = (node) => {
        if (node.children) {
          node.children.sort((a, b) => {
            // 首先检查节点是否有效
            if (!a || !b) return 0;

            // 然后按目录/文件类型排序
            if (a.isDir && !b.isDir) return -1;
            if (!a.isDir && b.isDir) return 1;

            // 最后按名称排序，确保名称存在
            const nameA = a.name || '';
            const nameB = b.name || '';
            return nameA.localeCompare(nameB);
          });

          // 递归排序子节点，确保每个子节点都有效
          node.children.forEach(child => {
            if (child) sortNode(child);
          });
        }
        return node;
      };

      const sortedRoot = sortNode(root);
      console.log('构建的文件树:', sortedRoot);
      setTreeData(sortedRoot);
    } else {
      // 如果没有文件，创建一个空项目
      const emptyRoot = {
        name: projectName,
        isDir: true,
        children: [],
        isExpanded: true,
        path: '/'
      };
      console.log('创建空项目:', emptyRoot);
      setTreeData(emptyRoot);
    }
  }, [projectFiles, projectName]);

  // 处理文件点击
  const handleFileClick = (node) => {
    if (onFileClick && !node.isDir) {
      onFileClick(node);
    }
  };

  // 处理右键菜单
  const handleContextMenu = (e, node, position) => {
    e.preventDefault();
    setSelectedNode(node);

    // 根据节点类型创建不同的菜单项
    const menuItems = [];

    if (node.isDir) {
      // 目录菜单项
      menuItems.push(
        { label: '新建文件', icon: <FaFileAlt />, action: () => handleNewFile(node) },
        { label: '新建文件夹', icon: <FaFolderPlus />, action: () => handleNewFolder(node) },
        { separator: true },
        { label: '复制', icon: <FaCopy />, action: () => console.log('复制', node) },
        { label: '粘贴', icon: <FaPaste />, action: () => console.log('粘贴', node) },
        { separator: true },
        { label: '重命名', icon: <FaEdit />, action: () => console.log('重命名', node) },
        { label: '删除', icon: <FaTrashAlt />, action: () => console.log('删除', node) }
      );
    } else {
      // 文件菜单项
      menuItems.push(
        { label: '打开', icon: <FaFileAlt />, action: () => handleFileClick(node) },
        { separator: true },
        { label: '复制', icon: <FaCopy />, action: () => console.log('复制', node) },
        { label: '剪切', icon: <FaCut />, action: () => console.log('剪切', node) },
        { separator: true },
        { label: '重命名', icon: <FaEdit />, action: () => console.log('重命名', node) },
        { label: '删除', icon: <FaTrashAlt />, action: () => console.log('删除', node) }
      );

      // 如果是二进制文件，添加下载选项
      if (node.name && ['.hex', '.bin', '.elf'].some(ext => node.name.toLowerCase().endsWith(ext))) {
        menuItems.push(
          { separator: true },
          { label: '下载到设备', icon: <FaDownload />, action: () => console.log('下载', node) }
        );
      }
    }

    setContextMenu({
      x: position.x,
      y: position.y,
      items: menuItems
    });
  };

  // 关闭上下文菜单
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // 处理新建文件
  const handleNewFile = (parentNode) => {
    if (onNewFile) {
      onNewFile(parentNode ? parentNode.path : '/');
    }
  };

  // 处理新建文件夹
  const handleNewFolder = (parentNode) => {
    if (onNewFolder) {
      onNewFolder(parentNode ? parentNode.path : '/');
    }
  };

  return (
    <div className="project-explorer">
      <div className="project-explorer-header">
        <div className="project-explorer-actions">
          <button className="icon-button" onClick={() => handleNewFile(null)} title="新建文件">
            <FaFileAlt />
          </button>
          <button className="icon-button" onClick={() => handleNewFolder(null)} title="新建文件夹">
            <FaFolderPlus />
          </button>
          <button className="icon-button" onClick={onRefresh} title="刷新">
            <FaSync />
          </button>
        </div>
      </div>
      <div className="project-explorer-content">
        {treeData ? (
          <TreeNode
            node={treeData}
            level={0}
            onFileClick={handleFileClick}
            activeFilePath={activeFilePath}
            onContextMenu={handleContextMenu}
            onSubdirContent={handleSubdirContent}
          />
        ) : (
          <div className="loading-message">加载项目文件...</div>
        )}

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            items={contextMenu.items}
            onClose={closeContextMenu}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectExplorer;
