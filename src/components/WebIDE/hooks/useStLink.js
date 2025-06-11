import { useState } from 'react';
import axios from 'axios';
import { STLINK_API, FIRMWARE_API } from '../constants/api';
import { getChipFamilyFromModel, formatFileSize } from '../utils';

// 处理API响应
const handleApiResponse = (response, onSuccess, onError, appendToDebugOutput) => {
  // 检查响应格式
  if (!response || !response.data) {
    const errorMsg = '无效的API响应格式';
    if (appendToDebugOutput) appendToDebugOutput(`❌ ${errorMsg}`);
    if (onError) onError(errorMsg);
    return false;
  }

  // 检查响应状态
  if (response.data.status === 'success') {
    if (onSuccess) onSuccess(response.data);
    return true;
  } else {
    const errorMsg = response.data.message || '操作失败';
    if (appendToDebugOutput) appendToDebugOutput(`❌ ${errorMsg}`);
    if (onError) onError(errorMsg, response.data);
    return false;
  }
};

// 处理API错误
const handleApiError = (error, onError, appendToDebugOutput) => {
  let errorMsg = '操作失败';

  // 检查是否是API返回的错误
  if (error.response && error.response.data) {
    const errorData = error.response.data;
    if (errorData.status === 'error' && errorData.message) {
      errorMsg = errorData.message;
    } else {
      errorMsg = `服务返回错误: ${error.response.status} ${error.response.statusText}`;
    }
  } else if (error.code === 'ECONNREFUSED') {
    errorMsg = '连接被拒绝，服务可能未启动';
  } else if (error.message) {
    errorMsg = error.message;
  }

  // 输出调试信息
  if (appendToDebugOutput) {
    appendToDebugOutput(`❌ ${errorMsg}`);
  }

  // 调用错误回调
  if (onError) {
    onError(errorMsg, error);
  }

  return errorMsg;
};

// ST-Link相关逻辑
const useStLink = (mcuModel, setActiveTab, TABS, appendToDebugOutput, setCurrentSessionId) => {
  const [isStLinkConnected, setIsStLinkConnected] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [hexFiles, setHexFiles] = useState([]);
  const [selectedHexFile, setSelectedHexFile] = useState('');
  const [hexDirectory, setHexDirectory] = useState('');
  const [showStLinkSettings, setShowStLinkSettings] = useState(false);
  const [flashOutput, setFlashOutput] = useState('');
  const [sessionId, setSessionId] = useState('');

  // 打开ST-Link设置对话框
  const handleOpenStLinkSettings = () => {
    setShowStLinkSettings(true);
  };

  // 关闭ST-Link设置对话框
  const handleCloseStLinkSettings = () => {
    setShowStLinkSettings(false);
  };

  // 连接 ST-Link
  const handleConnectStLink = () => {
    if (isStLinkConnected) {
      // 如果已连接，则断开连接
      setActiveTab(TABS.CONSOLE_OUTPUT);
      appendToDebugOutput('正在断开 ST-Link 连接...');

      // 调用断开连接API
      axios.post(STLINK_API.DISCONNECT)
        .then(response => {
          handleApiResponse(
            response,
            () => {
              setIsStLinkConnected(false);
              setDeviceInfo(null);
              appendToDebugOutput('✅ 已断开 ST-Link 连接');
            },
            (errorMsg) => {
              throw new Error(errorMsg);
            },
            appendToDebugOutput
          );
        })
        .catch(error => {
          console.error('断开ST-Link连接失败:', error);
          handleApiError(error, null, appendToDebugOutput);
          // 强制重置连接状态
          setIsStLinkConnected(false);
          setDeviceInfo(null);
        });
      return;
    }

    setActiveTab(TABS.CONSOLE_OUTPUT);
    appendToDebugOutput('正在连接 ST-Link...');

    // 获取芯片系列
    const chipFamily = getChipFamilyFromModel(mcuModel);

    // 构建连接请求数据 - 匹配后端API格式
    const connectData = {
      chip_family: chipFamily,
      transport: "swd" // 使用SWD传输模式
    };

    // 使用stmgdbserver的API连接
    axios.post(STLINK_API.CONNECT, connectData)
      .then(response => {
        // 详细记录响应内容，用于调试 (只在控制台显示，不在界面显示)
        console.log('ST-Link 连接响应:', response.data);

        handleApiResponse(
          response,
          (responseData) => {
            setIsStLinkConnected(true);

            // 从响应中获取ST-Link信息
            const stLinkInfo = responseData.data || {};

            // 获取会话ID
            const newSessionId = stLinkInfo.session_id || '';
            setSessionId(newSessionId);

            // 如果提供了setCurrentSessionId函数，则更新父组件中的会话ID
            if (setCurrentSessionId) {
              setCurrentSessionId(newSessionId);
            }

            // 获取标准化的设备信息
            const deviceInfo = {
              type: stLinkInfo.chip_info?.model || mcuModel,
              interface: stLinkInfo.transport || 'SWD',
              speed: stLinkInfo.speed || '4000 kHz',
              serialNumber: stLinkInfo.serial_number || '未知',
              firmwareVersion: stLinkInfo.firmware || '未知',
              targetVoltage: stLinkInfo.target_voltage || '未知'
            };

            setDeviceInfo(deviceInfo);

            // 显示格式化的连接信息
            appendToDebugOutput('===== ST-Link 连接成功 =====');
            appendToDebugOutput(`会话ID: ${newSessionId}`);
            appendToDebugOutput(`接口类型: ${deviceInfo.interface}`);
            appendToDebugOutput(`接口速度: ${deviceInfo.speed}`);
            appendToDebugOutput(`ST-LINK SN: ${deviceInfo.serialNumber}`);
            appendToDebugOutput(`ST-LINK FW: ${deviceInfo.firmwareVersion}`);
            appendToDebugOutput(`目标电压: ${deviceInfo.targetVoltage}`);
            appendToDebugOutput(`目标设备: ${deviceInfo.type}`);
            appendToDebugOutput('=============================');

            // 获取可用的HEX文件
            getHexFiles();
          },
          (errorMsg) => {
            throw new Error(errorMsg);
          },
          appendToDebugOutput
        );
      })
      .catch(error => {
        console.error('连接ST-Link设备失败:', error);
        handleApiError(error, null, appendToDebugOutput);

        // 添加常见问题解决建议
        appendToDebugOutput('请确认设备已正确连接到USB端口，且STM32服务运行正常');
        appendToDebugOutput('\n可能的解决方案:');
        appendToDebugOutput('1. 检查USB连接是否牢固');
        appendToDebugOutput('2. 确认ST-Link驱动已正确安装');
        appendToDebugOutput('3. 尝试使用不同的USB端口');
        appendToDebugOutput('4. 重启STM32服务');
      });
  };

  // 获取固件文件列表
  const getHexFiles = () => {
    setActiveTab(TABS.CONSOLE_OUTPUT);
    appendToDebugOutput('正在获取固件文件列表...');

    // 使用stmgdbserver的固件文件API
    axios.get(FIRMWARE_API.GET_FILES)
      .then(response => {
        handleApiResponse(
          response,
          (responseData) => {
            const firmwareFiles = responseData.data || [];

            if (firmwareFiles.length > 0) {
              appendToDebugOutput(`找到 ${firmwareFiles.length} 个固件文件:`);

              // 转换为前端使用的格式
              let hexFilesList = [];

              // 检查返回的数据类型
              if (Array.isArray(firmwareFiles)) {
                if (firmwareFiles.length > 0) {
                  // 如果是字符串数组
                  if (typeof firmwareFiles[0] === 'string') {
                    hexFilesList = firmwareFiles.map(filePath => {
                      const fileName = filePath.split('/').pop() || filePath;
                      return {
                        name: fileName,
                        path: filePath,
                        size: 0,
                        modified: new Date().toISOString()
                      };
                    });
                  }
                  // 如果是对象数组
                  else if (typeof firmwareFiles[0] === 'object') {
                    hexFilesList = firmwareFiles.map(file => ({
                      name: file.name || file.path.split('/').pop() || 'unknown',
                      path: file.path || '',
                      size: file.size || 0,
                      modified: file.modified || new Date().toISOString()
                    }));
                  }
                }
              }

              setHexFiles(hexFilesList);

              // 查找STM32F103_LED项目的固件文件
              const ledFirmware = hexFilesList.find(file => {
                const filePath = file.path || '';
                const fileName = file.name || '';
                return (
                  (filePath.includes && filePath.includes('STM32F103_LED')) &&
                  (fileName.endsWith && (fileName.endsWith('.hex') || fileName.endsWith('.bin')))
                );
              });

              if (ledFirmware) {
                setSelectedHexFile(ledFirmware.path);
                appendToDebugOutput(`已选择LED示例固件: ${ledFirmware.name}`);
              } else {
                // 查找任何STM32F103固件文件
                const f103Firmware = hexFilesList.find(file => {
                  const filePath = file.path || '';
                  const fileName = file.name || '';
                  return (
                    (filePath.includes && filePath.includes('STM32F103')) &&
                    (fileName.endsWith && (fileName.endsWith('.hex') || fileName.endsWith('.bin')))
                  );
                });

                if (f103Firmware) {
                  setSelectedHexFile(f103Firmware.path);
                  appendToDebugOutput(`已选择F103固件: ${f103Firmware.name}`);
                } else if (hexFilesList.length > 0) {
                  // 如果没有找到特定固件，选择第一个
                  setSelectedHexFile(hexFilesList[0].path);
                  appendToDebugOutput(`已选择固件: ${hexFilesList[0].name}`);
                }
              }

              // 显示文件列表
              hexFilesList.forEach(file => {
                const fileName = file.name || '';
                const fileSize = file.size || 0;

                // 添加文件类型图标
                let fileIcon = '🔧';
                if (fileName.endsWith && fileName.endsWith('.hex')) {
                  fileIcon = '📄';
                } else if (fileName.endsWith && fileName.endsWith('.bin')) {
                  fileIcon = '📦';
                }

                appendToDebugOutput(`${fileIcon} ${fileName} (${formatFileSize(fileSize)})`);
              });
            } else {
              appendToDebugOutput('未找到可用的固件文件');
              appendToDebugOutput('请先编译项目生成固件文件');

              // 设置默认的LED示例固件路径
              const defaultPath = "./build/STM32F103_LED.hex";
              setSelectedHexFile(defaultPath);
              appendToDebugOutput(`已设置默认固件路径: ${defaultPath}`);
            }

            appendToDebugOutput(`✅ 固件文件列表获取完成`);
          },
          (errorMsg) => {
            throw new Error(errorMsg);
          },
          appendToDebugOutput
        );
      })
      .catch(error => {
        console.error('获取固件文件列表失败:', error);
        handleApiError(error, null, appendToDebugOutput);

        // 设置默认的LED示例固件路径
        const defaultPath = "./build/STM32F103_LED.hex";
        setSelectedHexFile(defaultPath);
        appendToDebugOutput(`已设置默认固件路径: ${defaultPath}`);
      });
  };

  // 擦除设备 - 更新为使用新的API端点
  const handleEraseDevice = () => {
    if (!isStLinkConnected) {
      appendToDebugOutput('错误：请先连接 ST-Link！');
      return;
    }

    // 确认擦除操作
    if (!window.confirm('确定要擦除设备吗？此操作将清除设备上的所有数据！')) {
      return;
    }

    setIsErasing(true);
    setActiveTab(TABS.CONSOLE_OUTPUT);
    appendToDebugOutput('正在擦除设备...');

    // 使用固件API擦除设备 - 匹配后端API格式
    const data = {
      chip_family: getChipFamilyFromModel(mcuModel),
      erase_all: true
    };

    axios.post(FIRMWARE_API.FLASH, {
      ...data,
      file_path: "",  // 空文件路径表示只擦除不烧录
      address: "0x08000000",
      verify: false,
      reset: true
    })
      .then(response => {
        handleApiResponse(
          response,
          (responseData) => {
            appendToDebugOutput(`✅ 设备擦除成功`);

            // 显示输出信息
            if (responseData.data && responseData.data.output) {
              appendToDebugOutput(responseData.data.output);
            }
          },
          (errorMsg) => {
            throw new Error(errorMsg);
          },
          appendToDebugOutput
        );
      })
      .catch(error => {
        console.error('设备擦除失败:', error);
        handleApiError(error, null, appendToDebugOutput);
      })
      .finally(() => {
        setIsErasing(false);
      });
  };

  // 烧录函数 - 使用stmgdbserver的固件API
  const handleFlash = async () => {
    if (!isStLinkConnected) {
      appendToDebugOutput('错误：请先连接 ST-Link！');
      return;
    }

    // 获取芯片系列
    const chipFamily = getChipFamilyFromModel(mcuModel);

    // 使用编译后的固件文件路径
    const firmwarePath = selectedHexFile || "./build/STM32F103_LED.hex";

    setIsFlashing(true);
    setActiveTab(TABS.CONSOLE_OUTPUT);
    appendToDebugOutput('正在准备烧录固件...');

    setFlashOutput('正在准备烧录固件...\n');
    setFlashOutput(prev => prev + `正在烧录固件: ${firmwarePath}...\n`);
    setFlashOutput(prev => prev + `目标设备: ${mcuModel}\n`);
    setFlashOutput(prev => prev + `芯片系列: ${chipFamily}\n`);

    // 构建烧录请求数据 - 匹配后端API格式
    const flashData = {
      file_path: firmwarePath,
      address: "0x08000000",
      verify: true,
      reset: true,
      chip_family: chipFamily,
      erase_all: true,
      // 为STM32F103ZE添加特定配置
      config: {
        transport: "swd",  // 使用SWD传输模式
        target_config: mcuModel.includes('F103') ? "stm32f1x.cfg" :
                      mcuModel.includes('F4') ? "stm32f4x.cfg" :
                      mcuModel.includes('H7') ? "stm32h7x.cfg" : "stm32f1x.cfg",
        reset_mode: "halt"  // 烧录后停止执行
      }
    };

    try {
      // 调用固件烧录API
      const response = await axios.post(FIRMWARE_API.FLASH, flashData);

      const success = handleApiResponse(
        response,
        (responseData) => {
          setFlashOutput(prev => prev + `✅ 固件烧录成功\n`);

          // 显示烧录输出信息
          if (responseData.data) {
            setFlashOutput(prev => prev + '\n烧录详情:\n');
            setFlashOutput(prev => prev + `文件: ${responseData.data.file || firmwarePath}\n`);

            // 显示烧录地址
            if (responseData.data.address) {
              setFlashOutput(prev => prev + `地址: ${responseData.data.address}\n`);
            }

            // 显示烧录大小
            if (responseData.data.size) {
              setFlashOutput(prev => prev + `大小: ${responseData.data.size} 字节\n`);
            }

            // 显示校验结果
            if (responseData.data.verified !== undefined) {
              setFlashOutput(prev => prev + `校验: ${responseData.data.verified ? '通过' : '未验证'}\n`);
            }

            if (responseData.data.flash_output) {
              setFlashOutput(prev => prev + '\n烧录输出:\n');
              setFlashOutput(prev => prev + responseData.data.flash_output + '\n');
            }

            // 显示烧录时间
            if (responseData.data.time_ms) {
              setFlashOutput(prev => prev + `烧录时间: ${responseData.data.time_ms}ms\n`);
            }
          }

          setFlashOutput(prev => prev + '\n设备已重置并开始运行程序\n');
          return true;
        },
        (errorMsg) => {
          throw new Error(errorMsg);
        },
        (msg) => setFlashOutput(prev => prev + msg + '\n')
      );

      if (!success) {
        throw new Error('烧录失败');
      }
    } catch (error) {
      console.error('烧录失败:', error);

      // 使用自定义错误处理函数
      const errorMsg = handleApiError(
        error,
        null,
        (msg) => setFlashOutput(prev => prev + msg + '\n')
      );

      setFlashOutput(prev => prev + '❌ 烧录失败: ' + errorMsg + '\n');

      // 显示详细错误信息
      if (error.response?.data?.details) {
        setFlashOutput(prev => prev + '\n错误详情:\n');
        setFlashOutput(prev => prev + error.response.data.details + '\n');
      }

      // 显示烧录输出（如果有）
      if (error.response?.data?.flash_output) {
        setFlashOutput(prev => prev + '\n烧录输出:\n');
        setFlashOutput(prev => prev + error.response.data.flash_output + '\n');
      }

      // 提供可能的解决方案
      setFlashOutput(prev => prev + '\n可能的解决方案:\n');
      setFlashOutput(prev => prev + '1. 确保设备连接稳定\n');
      setFlashOutput(prev => prev + '2. 检查固件文件是否存在且有效\n');
      setFlashOutput(prev => prev + '3. 尝试先擦除设备再烧录\n');
      setFlashOutput(prev => prev + '4. 检查选择的芯片系列是否正确\n');
      setFlashOutput(prev => prev + '5. 尝试使用不同的传输模式（SWD/JTAG）\n');
      setFlashOutput(prev => prev + '6. 确保目标板供电正常\n');
    } finally {
      setIsFlashing(false);
    }
  };

  return {
    isStLinkConnected,
    setIsStLinkConnected,
    isFlashing,
    setIsFlashing,
    isErasing,
    setIsErasing,
    deviceInfo,
    setDeviceInfo,
    hexFiles,
    setHexFiles,
    selectedHexFile,
    setSelectedHexFile,
    hexDirectory,
    setHexDirectory,
    showStLinkSettings,
    setShowStLinkSettings,
    flashOutput,
    setFlashOutput,
    handleOpenStLinkSettings,
    handleCloseStLinkSettings,
    handleConnectStLink,
    getHexFiles,
    handleEraseDevice,
    handleFlash,
    sessionId
  };
};

export default useStLink;
