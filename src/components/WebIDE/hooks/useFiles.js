import { useState } from 'react';
import { DEFAULT_CODE } from '../constants';
import { saveFileToLocal } from '../utils';
import axios from 'axios';
import { PROJECT_API } from '../constants/api';

// 文件管理相关逻辑
const useFiles = () => {
  // 文件状态 - 初始化为空数组
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [editorValue, setEditorValue] = useState('');

  // 处理编辑器内容变化
  const handleEditorChange = (value) => {
    setEditorValue(value);

    // 如果有活动文件，更新其内容
    if (activeFile !== null && files[activeFile]) {
      const newFiles = [...files];
      newFiles[activeFile].content = value;
      setFiles(newFiles);
    }
  };

  // 创建新文件
  const handleNewFile = () => {
    const fileName = prompt('请输入文件名：', 'new_file.c');
    if (fileName) {
      const newIndex = files.length;
      setFiles([...files, { name: fileName, content: '', active: false }]);
      handleFileClick(newIndex);
    }
  };

  // 保存文件
  const handleSaveFile = () => {
    // 检查是否有活动文件
    if (activeFile !== null && files[activeFile]) {
      const currentFile = files[activeFile];
      saveFileToLocal(currentFile.name, currentFile.content);
    }
  };

  // 点击文件
  const handleFileClick = (index) => {
    // 检查索引是否有效
    if (index >= 0 && index < files.length) {
      const newFiles = files.map((file, i) => ({
        ...file,
        active: i === index,
      }));
      setFiles(newFiles);
      setActiveFile(index);
      setEditorValue(files[index].content);
    }
  };

  // 获取文件内容
  const fetchFileContent = async (filePath) => {
    const response = await axios.get(`${PROJECT_API.GET_FILE_CONTENT}?path=${filePath}`);

    if (response.data && response.data.status === "success") {
      return response.data.data.content || '';
    } else {
      throw new Error(response.data.message || '获取文件内容失败');
    }
  };

  // 加载STM32F103ZE_LED示例项目
  const loadLedExampleProject = async (appendToDebugOutput, setActiveTab, TABS, setMcuModel) => {
    setActiveTab(TABS.DEBUG_CONSOLE);
    appendToDebugOutput('正在加载STM32F103ZE_LED示例项目...');

    try {
      // 获取项目文件列表 - 使用03-1 STM32F103ZE_LED项目路径
      const projectPath = "03-1 STM32F103ZE_LED";
      const response = await axios.get(`${PROJECT_API.GET_FILES}?path=${encodeURIComponent(projectPath)}`);

      if (response.data && response.data.status === "success") {
        const projectFiles = response.data.data || [];

        if (projectFiles.length > 0) {
          appendToDebugOutput(`找到 ${projectFiles.length} 个项目文件`);

          // 清空当前文件列表
          setFiles([]);

          // 创建新的文件列表
          const newFiles = [];

          // 首先查找并加载Core/Src/main.c文件
          const mainFile = projectFiles.find(file =>
            file.path.includes('Core/Src/main.c') || file.path.includes('Core\\Src\\main.c')
          );

          if (mainFile) {
            try {
              const mainContent = await fetchFileContent(mainFile.path);
              newFiles.push({
                name: 'main.c',
                content: mainContent,
                active: true,
                path: mainFile.path,
                fullPath: mainFile.path
              });
              appendToDebugOutput(`已加载: Core/Src/main.c`);
            } catch (error) {
              console.error(`加载main.c失败:`, error);
              appendToDebugOutput(`❌ 加载main.c失败`);
            }
          } else {
            appendToDebugOutput(`⚠️ 未找到main.c文件`);
          }

          // 查找并加载gpio.c文件
          const gpioFile = projectFiles.find(file =>
            file.path.includes('Core/Src/gpio.c') || file.path.includes('Core\\Src\\gpio.c')
          );

          if (gpioFile) {
            try {
              const gpioContent = await fetchFileContent(gpioFile.path);
              newFiles.push({
                name: 'gpio.c',
                content: gpioContent,
                active: false,
                path: gpioFile.path,
                fullPath: gpioFile.path
              });
              appendToDebugOutput(`已加载: Core/Src/gpio.c`);
            } catch (error) {
              console.error(`加载gpio.c失败:`, error);
              appendToDebugOutput(`❌ 加载gpio.c失败`);
            }
          }

          // 查找并加载main.h文件
          const mainHFile = projectFiles.find(file =>
            file.path.includes('Core/Inc/main.h') || file.path.includes('Core\\Inc\\main.h')
          );

          if (mainHFile) {
            try {
              const mainHContent = await fetchFileContent(mainHFile.path);
              newFiles.push({
                name: 'main.h',
                content: mainHContent,
                active: false,
                path: mainHFile.path,
                fullPath: mainHFile.path
              });
              appendToDebugOutput(`已加载: Core/Inc/main.h`);
            } catch (error) {
              console.error(`加载main.h失败:`, error);
              appendToDebugOutput(`❌ 加载main.h失败`);
            }
          }

          // 查找并加载gpio.h文件
          const gpioHFile = projectFiles.find(file =>
            file.path.includes('Core/Inc/gpio.h') || file.path.includes('Core\\Inc\\gpio.h')
          );

          if (gpioHFile) {
            try {
              const gpioHContent = await fetchFileContent(gpioHFile.path);
              newFiles.push({
                name: 'gpio.h',
                content: gpioHContent,
                active: false,
                path: gpioHFile.path,
                fullPath: gpioHFile.path
              });
              appendToDebugOutput(`已加载: Core/Inc/gpio.h`);
            } catch (error) {
              console.error(`加载gpio.h失败:`, error);
              appendToDebugOutput(`❌ 加载gpio.h失败`);
            }
          }

          // 查找并加载链接脚本文件
          const ldFile = projectFiles.find(file => file.name.endsWith('.ld'));
          if (ldFile) {
            try {
              const ldContent = await fetchFileContent(ldFile.path);
              newFiles.push({
                name: ldFile.name,
                content: ldContent,
                active: false,
                path: ldFile.path,
                fullPath: ldFile.path
              });
              appendToDebugOutput(`已加载: ${ldFile.name}`);
            } catch (error) {
              console.error(`加载${ldFile.name}失败:`, error);
              appendToDebugOutput(`❌ 加载${ldFile.name}失败`);
            }
          }

          // 更新文件列表
          setFiles(newFiles);

          // 设置活动文件为main.c
          if (newFiles.length > 0) {
            setActiveFile(0);
            setEditorValue(newFiles[0].content);
          }

          appendToDebugOutput('✅ 示例项目加载完成');

          // 自动设置MCU型号为STM32F103ZET6
          setMcuModel('STM32F103ZET6');
        } else {
          appendToDebugOutput('❌ 未找到项目文件');
        }
      } else {
        throw new Error(response.data.message || '获取项目文件列表失败');
      }
    } catch (error) {
      console.error('加载示例项目失败:', error);
      appendToDebugOutput('❌ 加载示例项目失败: ' + (error.response?.data?.message || error.message || '未知错误'));
    }
  };

  return {
    files,
    setFiles,
    activeFile,
    setActiveFile,
    editorValue,
    setEditorValue,
    handleEditorChange,
    handleNewFile,
    handleSaveFile,
    handleFileClick,
    fetchFileContent,
    loadLedExampleProject
  };
};

export default useFiles;
