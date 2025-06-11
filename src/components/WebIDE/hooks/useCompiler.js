import { useState } from 'react';
import axios from 'axios';
import { COMPILER_API } from '../constants/api';
import { getChipFamilyFromModel } from '../utils';

// 编译相关逻辑
const useCompiler = (mcuModel, setActiveTab, TABS, getHexFiles, appendToDebugOutput) => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildOutput, setBuildOutput] = useState('');
  const [buildErrors, setBuildErrors] = useState([]);

  // 构建函数 - 使用后端API编译STM32代码
  const handleBuild = async () => {
    setIsBuilding(true);
    setBuildOutput('');
    setBuildErrors([]);
    setActiveTab(TABS.ERROR_OUTPUT);

    const buildStartMessage = '正在编译...\n';
    setBuildOutput(buildStartMessage);
    appendToDebugOutput(buildStartMessage);

    try {
      // 获取当前选择的MCU型号对应的芯片系列
      const chipFamily = getChipFamilyFromModel(mcuModel);

      // 构建编译请求数据
      const buildData = {
        project_id: "STM32F103_LED", // 使用指定的LED示例项目
        debug: true, // 使用debug模式
        optimization_level: "0", // 使用O0优化级别
        defines: [`STM32${chipFamily}x`] // 添加芯片系列定义
      };

      // 构建编译信息
      const buildInfoMessages = [
        `正在编译 ${buildData.project_id} 项目...\n`,
        `芯片系列: ${chipFamily}\n`,
        `MCU型号: ${mcuModel}\n`,
        `编译选项: debug模式\n\n`
      ];

      // 同时更新错误信息面板和控制台
      buildInfoMessages.forEach(msg => {
        setBuildOutput(prev => prev + msg);
        appendToDebugOutput(msg);
      });

      // 调用后端API进行编译
      console.log('发送编译请求:', COMPILER_API.COMPILE, buildData);
      const response = await axios.post(COMPILER_API.COMPILE, buildData);
      console.log('编译响应:', response.data);

      if (response.data && response.data.status === "success") {
        const successMsg = '✅ 编译成功！\n';
        setBuildOutput(prev => prev + successMsg);
        appendToDebugOutput(successMsg);

        // 显示编译输出
        if (response.data.data && response.data.data.compile_output) {
          const compileOutput = '编译输出:\n' + response.data.data.compile_output + '\n';
          setBuildOutput(prev => prev + compileOutput);
          appendToDebugOutput(compileOutput);
        }

        // 显示生成的文件信息
        const filesHeader = '\n生成的文件：\n';
        setBuildOutput(prev => prev + filesHeader);
        appendToDebugOutput(filesHeader);

        // 如果响应中包含生成的文件信息，则显示
        if (response.data.data && response.data.data.output_files) {
          response.data.data.output_files.forEach(file => {
            const fileInfo = `- ${file}\n`;
            setBuildOutput(prev => prev + fileInfo);
            appendToDebugOutput(fileInfo);
          });
        } else {
          // 否则显示默认文件
          const defaultFiles = [
            '- myproj/STM32F103_LED/build/STM32F103_LED.bin\n',
            '- myproj/STM32F103_LED/build/STM32F103_LED.hex\n'
          ];
          defaultFiles.forEach(fileInfo => {
            setBuildOutput(prev => prev + fileInfo);
            appendToDebugOutput(fileInfo);
          });
        }

        // 显示内存使用情况
        if (response.data.data && response.data.data.memory_usage) {
          const memUsage = response.data.data.memory_usage;
          const memoryInfo = [
            `\n内存使用情况:\n`,
            `- Flash: ${memUsage.flash_used}/${memUsage.flash_total} (${memUsage.flash_percent}%)\n`,
            `- RAM: ${memUsage.ram_used}/${memUsage.ram_total} (${memUsage.ram_percent}%)\n`
          ];

          memoryInfo.forEach(info => {
            setBuildOutput(prev => prev + info);
            appendToDebugOutput(info);
          });
        }

        // 更新可用的HEX文件列表
        getHexFiles();
      } else {
        throw new Error(response.data.message || '编译失败');
      }
    } catch (error) {
      console.error('编译失败:', error);
      const errorMsg = '❌ 编译失败: ' + (error.response?.data?.message || error.message || '未知错误') + '\n';
      setBuildOutput(prev => prev + errorMsg);
      appendToDebugOutput(errorMsg);

      // 如果有编译错误信息，解析并显示
      if (error.response?.data?.data?.compile_output) {
        const compileErrorOutput = '\n编译错误输出:\n' + error.response.data.data.compile_output;
        setBuildOutput(prev => prev + compileErrorOutput);
        appendToDebugOutput(compileErrorOutput);

        // 尝试从编译输出中提取错误信息
        const errorLines = error.response.data.data.compile_output.split('\n');
        const errors = [];

        errorLines.forEach(line => {
          // 匹配常见的GCC错误格式: file:line:col: error: message
          const match = line.match(/(.+):(\d+):(\d+):\s+error:\s+(.+)/);
          if (match) {
            errors.push({
              file: match[1],
              line: parseInt(match[2]),
              column: parseInt(match[3]),
              message: match[4]
            });
          }
        });

        if (errors.length > 0) {
          setBuildErrors(errors);
        }
      }

      // 提供可能的解决方案
      const solutions = [
        '\n可能的解决方案:\n',
        '1. 检查代码中的语法错误\n',
        '2. 确保所有必要的头文件都已包含\n',
        '3. 检查项目结构是否完整\n',
        '4. 确认选择了正确的MCU型号\n'
      ];

      solutions.forEach(solution => {
        setBuildOutput(prev => prev + solution);
        appendToDebugOutput(solution);
      });
    } finally {
      setIsBuilding(false);
    }
  };

  return {
    isBuilding,
    setIsBuilding,
    buildOutput,
    setBuildOutput,
    buildErrors,
    setBuildErrors,
    handleBuild
  };
};

export default useCompiler;
