import { useState, useEffect } from 'react';
import fileService from '../utils/fileService';

// myproj 目录项目管理相关逻辑
const useMyProject = (appendToDebugOutput) => {
  const [projectFiles, setProjectFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取项目文件
  const fetchProjectFiles = async (showOutput = true, path = '', callback) => {
    setIsLoading(true);
    setError(null);

    try {
      // 使用 fileService 获取所有工程文件
      console.log('获取项目文件，路径:', path);
      const files = await fileService.getAllFiles(path);
      console.log('获取到文件数量:', files.length);

      // 如果是获取子目录内容，不要替换现有文件列表，而是合并
      let allFiles = [];
      if (path && projectFiles.length > 0) {
        // 保留现有文件列表
        allFiles = [...projectFiles];

        // 添加新获取的文件，避免重复
        files.forEach(newFile => {
          // 检查文件是否已存在
          const existingIndex = allFiles.findIndex(f => f.path === newFile.path);
          if (existingIndex >= 0) {
            // 更新现有文件
            allFiles[existingIndex] = newFile;
          } else {
            // 添加新文件
            allFiles.push(newFile);
          }
        });

        console.log('合并后的文件数量:', allFiles.length);
      } else {
        // 如果是获取根目录内容，直接使用新获取的文件列表
        allFiles = files;
      }

      // 处理文件路径，确保路径格式一致
      const processedFiles = allFiles.map(file => {
        if (!file) return null; // 跳过无效的文件

        // 确保 file.path 存在，并且路径使用正斜杠
        const normalizedPath = file.path ? file.path.replace(/\\/g, '/') : '';

        // 如果没有路径但有名称，使用名称作为路径
        const finalPath = normalizedPath || (file.name ? file.name : '');

        // 确保同时有 is_dir 和 isDir 属性
        const isDirectory = file.is_dir || file.isDir || false;

        return {
          ...file,
          path: finalPath,
          name: file.name || (finalPath.split('/').pop() || ''),
          // 添加文件类型标识，同时设置 is_dir 和 isDir
          is_dir: isDirectory,
          isDir: isDirectory,
          // 添加文件大小和更新时间的格式化
          size: file.size || 0,
          updatedAt: file.updated_at || new Date().toISOString(),
          updated_at: file.updated_at || new Date().toISOString()
        };
      }).filter(Boolean); // 过滤掉无效的文件

      setProjectFiles(processedFiles);

      // 只有在需要显示输出时才添加成功信息
      if (showOutput && appendToDebugOutput) {
        appendToDebugOutput(`✅ 获取项目文件成功，共 ${processedFiles.length} 个文件`);
      }

      return processedFiles;
    } catch (error) {
      console.error('获取项目文件失败:', error);
      setError('获取项目文件失败: ' + (error.message || '未知错误'));

      // 只有在需要显示输出时才添加错误信息
      if (showOutput && appendToDebugOutput) {
        appendToDebugOutput('❌ 获取项目文件失败: ' + (error.message || '未知错误'));
      }
      return [];
    } finally {
      setIsLoading(false);

      // 执行回调函数
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  };

  // 获取文件内容
  const fetchFileContent = async (filePath) => {
    try {
      // 使用 fileService 获取文件内容
      const fileData = await fileService.getFileContent(filePath);

      if (appendToDebugOutput) {
        appendToDebugOutput(`✅ 获取文件 "${filePath}" 内容成功`);
      }

      return fileData;
    } catch (error) {
      console.error('获取文件内容失败:', error);
      if (appendToDebugOutput) {
        appendToDebugOutput('❌ 获取文件内容失败: ' + (error.message || '未知错误'));
      }
      throw error;
    }
  };

  // 保存文件内容
  const saveFileContent = async (filePath, content) => {
    try {
      // 使用 fileService 保存文件内容
      await fileService.saveFileContent(filePath, content);

      if (appendToDebugOutput) {
        appendToDebugOutput(`✅ 文件 "${filePath}" 保存成功`);
      }

      return true;
    } catch (error) {
      console.error('保存文件失败:', error);
      if (appendToDebugOutput) {
        appendToDebugOutput('❌ 保存文件失败: ' + (error.message || '未知错误'));
      }
      return false;
    }
  };

  // 创建新文件
  const createNewFile = async (fileName, content = '', directory = '') => {
    const filePath = directory ? `${directory}/${fileName}` : fileName;

    try {
      // 使用 fileService 保存文件内容
      await fileService.saveFileContent(filePath, content);

      // 刷新文件列表
      await fetchProjectFiles();

      if (appendToDebugOutput) {
        appendToDebugOutput(`✅ 文件 "${filePath}" 创建成功`);
      }

      return true;
    } catch (error) {
      console.error('创建文件失败:', error);
      if (appendToDebugOutput) {
        appendToDebugOutput('❌ 创建文件失败: ' + (error.message || '未知错误'));
      }
      return false;
    }
  };

  // 创建新文件夹
  const createNewFolder = async (folderName, parentDirectory = '') => {
    const folderPath = parentDirectory ? `${parentDirectory}/${folderName}` : folderName;

    try {
      // 创建一个空的 .gitkeep 文件来创建文件夹
      await fileService.saveFileContent(`${folderPath}/.gitkeep`, '');

      // 刷新文件列表
      await fetchProjectFiles();

      if (appendToDebugOutput) {
        appendToDebugOutput(`✅ 文件夹 "${folderPath}" 创建成功`);
      }

      return true;
    } catch (error) {
      console.error('创建文件夹失败:', error);
      if (appendToDebugOutput) {
        appendToDebugOutput('❌ 创建文件夹失败: ' + (error.message || '未知错误'));
      }
      return false;
    }
  };

  // 初始化时获取项目文件
  useEffect(() => {
    fetchProjectFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    projectFiles,
    currentFile,
    setCurrentFile,
    isLoading,
    error,
    fetchProjectFiles,
    fetchFileContent,
    saveFileContent,
    createNewFile,
    createNewFolder
  };
};

export default useMyProject;
