import { useState, useEffect } from 'react';
import workspaceService from '../utils/workspaceService';

// 工作区管理相关逻辑
const useWorkspace = (appendToDebugOutput) => {
  // 项目列表
  const [projects, setProjects] = useState([]);
  // 当前选中的项目
  const [currentProject, setCurrentProject] = useState(null);
  // 项目文件列表
  const [projectFiles, setProjectFiles] = useState([]);
  // 当前选中的文件
  const [currentFile, setCurrentFile] = useState(null);
  // 文件内容
  const [fileContent, setFileContent] = useState('');
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  // 错误信息
  const [error, setError] = useState(null);
  // 展开的目录
  const [expandedDirs, setExpandedDirs] = useState({});

  // 获取项目列表
  const fetchProjects = async (userId) => {
    if (!userId) {
      setError('用户ID不能为空');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const projectsList = await workspaceService.getProjects(userId);
      setProjects(projectsList);

      if (appendToDebugOutput) {
        appendToDebugOutput(`✅ 获取到 ${projectsList.length} 个项目`);
      }
    } catch (error) {
      console.error('获取项目列表失败:', error);
      setError(error.message || '获取项目列表失败');

      if (appendToDebugOutput) {
        appendToDebugOutput(`❌ 获取项目列表失败: ${error.message || '未知错误'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 获取项目文件
  const fetchProjectFiles = async (userId, projectName, path = '') => {
    if (!userId || !projectName) {
      setError('用户ID和项目名称不能为空');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const files = await workspaceService.getProjectFiles(userId, projectName, path);
      
      // 如果是获取子目录内容，不要替换现有文件列表，而是合并
      if (path && projectFiles.length > 0) {
        // 保留现有文件列表
        const allFiles = [...projectFiles];

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

        setProjectFiles(allFiles);
      } else {
        // 如果是获取根目录内容，直接使用新获取的文件列表
        setProjectFiles(files);
      }

      if (appendToDebugOutput) {
        appendToDebugOutput(`✅ 获取到 ${files.length} 个文件`);
      }
    } catch (error) {
      console.error('获取项目文件失败:', error);
      setError(error.message || '获取项目文件失败');

      if (appendToDebugOutput) {
        appendToDebugOutput(`❌ 获取项目文件失败: ${error.message || '未知错误'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 获取文件内容
  const fetchFileContent = async (userId, projectName, filePath) => {
    if (!userId || !projectName || !filePath) {
      setError('用户ID、项目名称和文件路径不能为空');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fileData = await workspaceService.getFileContent(userId, projectName, filePath);
      setFileContent(fileData.content);

      // 更新当前文件
      setCurrentFile({
        name: fileData.name,
        path: fileData.path,
        content: fileData.content,
        size: fileData.size,
        updated_at: fileData.updated_at
      });

      if (appendToDebugOutput) {
        appendToDebugOutput(`✅ 获取文件 "${filePath}" 内容成功`);
      }

      return fileData;
    } catch (error) {
      console.error('获取文件内容失败:', error);
      setError(error.message || '获取文件内容失败');

      if (appendToDebugOutput) {
        appendToDebugOutput(`❌ 获取文件内容失败: ${error.message || '未知错误'}`);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 保存文件内容
  const saveFileContent = async (userId, projectName, filePath, content) => {
    if (!userId || !projectName || !filePath) {
      setError('用户ID、项目名称和文件路径不能为空');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await workspaceService.saveFileContent(userId, projectName, filePath, content);

      if (appendToDebugOutput) {
        appendToDebugOutput(`✅ 保存文件 "${filePath}" 内容成功`);
      }

      return true;
    } catch (error) {
      console.error('保存文件内容失败:', error);
      setError(error.message || '保存文件内容失败');

      if (appendToDebugOutput) {
        appendToDebugOutput(`❌ 保存文件内容失败: ${error.message || '未知错误'}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 选择项目
  const selectProject = async (userId, project) => {
    setCurrentProject(project);
    await fetchProjectFiles(userId, project.name);
  };

  // 选择文件
  const selectFile = async (userId, projectName, file) => {
    if (file.isDir) {
      // 如果是目录，切换展开状态
      const newExpandedDirs = { ...expandedDirs };
      newExpandedDirs[file.path] = !newExpandedDirs[file.path];
      setExpandedDirs(newExpandedDirs);

      // 如果目录被展开，获取子目录内容
      if (newExpandedDirs[file.path]) {
        await fetchProjectFiles(userId, projectName, file.path);
      }
    } else {
      // 如果是文件，获取文件内容
      await fetchFileContent(userId, projectName, file.path);
    }
  };

  // 更新文件内容
  const updateFileContent = (content) => {
    setFileContent(content);
    if (currentFile) {
      setCurrentFile({
        ...currentFile,
        content: content
      });
    }
  };

  // 创建新文件
  const createNewFile = async (userId, projectName, fileName, content = '', directory = '') => {
    const filePath = directory ? `${directory}/${fileName}` : fileName;

    try {
      // 保存文件内容
      const success = await saveFileContent(userId, projectName, filePath, content);
      if (success) {
        // 刷新文件列表
        await fetchProjectFiles(userId, projectName, directory);
        return true;
      }
      return false;
    } catch (error) {
      console.error('创建文件失败:', error);
      if (appendToDebugOutput) {
        appendToDebugOutput(`❌ 创建文件失败: ${error.message || '未知错误'}`);
      }
      return false;
    }
  };

  return {
    projects,
    currentProject,
    projectFiles,
    currentFile,
    fileContent,
    isLoading,
    error,
    expandedDirs,
    fetchProjects,
    fetchProjectFiles,
    fetchFileContent,
    saveFileContent,
    selectProject,
    selectFile,
    updateFileContent,
    createNewFile
  };
};

export default useWorkspace;
