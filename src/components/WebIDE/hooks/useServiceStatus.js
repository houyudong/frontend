import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

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

// 服务状态检查相关逻辑
const useServiceStatus = (appendToDebugOutput, setServiceError, setServiceErrorMessage) => {
  const [isServiceReady, setIsServiceReady] = useState(false);
  const [showCliInstallHelp, setShowCliInstallHelp] = useState(false);
  const [cliPath, setCliPath] = useState('');

  // 检查STM32服务是否运行
  const checkServiceStatus = (showOutput = true) => {
    // 只有在需要显示输出时才添加调试信息
    if (showOutput) {
      appendToDebugOutput('检查STM32服务状态...');
    }

    // 添加超时处理
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('请求超时')), 5000);
    });

    // 实际请求
    const statusUrl = `${API_BASE_URL}/status`;
    console.log('发送请求到:', statusUrl);

    // 使用配置的API_BASE_URL
    const requestPromise = axios.get(statusUrl, {
      // 添加错误处理选项
      validateStatus: status => status < 500,
      // 添加重试配置
      retry: 1,
      retryDelay: 1000,
      timeout: 5000
    });

    // 使用Promise.race来处理超时
    return Promise.race([requestPromise, timeoutPromise])
      .then(response => {
        console.log('服务状态响应:', response);
        console.log('响应数据:', response.data);
        console.log('响应状态:', response.status);
        console.log('响应头:', response.headers);

        // 使用通用API响应处理函数
        const success = handleApiResponse(
          response,
          (responseData) => {
            setIsServiceReady(true);

            // 只有在需要显示输出时才添加状态信息
            if (showOutput) {
              appendToDebugOutput(`✅ STM32服务运行正常`);

              // 如果有服务信息，记录到调试输出
              if (responseData.data) {
                const serviceInfo = responseData.data;
                appendToDebugOutput(`服务名称: ${serviceInfo.service || 'stmgdbserver'}`);
                appendToDebugOutput(`状态: ${serviceInfo.status || 'running'}`);
                appendToDebugOutput(`运行时间: ${serviceInfo.uptime || 'N/A'}`);

                // 记录更多详细信息
                if (serviceInfo.go_version) {
                  appendToDebugOutput(`Go版本: ${serviceInfo.go_version}`);
                }
                if (serviceInfo.memory_usage) {
                  appendToDebugOutput(`内存使用: ${serviceInfo.memory_usage}MB`);
                }
              }
            }

            // 清除任何之前的错误状态
            if (setServiceError) {
              setServiceError(false);
            }
          },
          (errorMsg) => {
            throw new Error(errorMsg);
          },
          showOutput ? appendToDebugOutput : null
        );

        return success;
      })
      .catch(error => {
        console.error('服务检测失败:', error);
        setIsServiceReady(false);

        // 只有在需要显示输出时才添加错误信息
        if (showOutput) {
          appendToDebugOutput('❌ STM32服务未运行或无法访问');
          appendToDebugOutput(`请确保STM32服务已启动并运行`);
        }

        // 设置错误状态
        if (setServiceError) {
          setServiceError(true);
        }

        // 使用通用API错误处理函数
        const errorMessage = '无法连接到STM32服务。' + handleApiError(error, null, showOutput ? appendToDebugOutput : null);

        // 设置错误消息
        if (setServiceErrorMessage) {
          setServiceErrorMessage(errorMessage);
        }

        setShowCliInstallHelp(true);
        return false;
      });
  };

  // 显示服务成功运行的消息 - 简化为纯文本输出
  const showServiceSuccessMessage = () => {
    appendToDebugOutput('✓ STM32服务运行正常');
    appendToDebugOutput(`服务地址: ${API_BASE_URL}`);
    appendToDebugOutput('您现在可以连接ST-Link设备并进行烧录操作');
  };

  // 处理服务配置
  const handleSetCliPath = () => {
    // 刷新页面
    appendToDebugOutput('正在刷新页面...');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return {
    isServiceReady,
    setIsServiceReady,
    showCliInstallHelp,
    setShowCliInstallHelp,
    cliPath,
    setCliPath,
    checkServiceStatus,
    showServiceSuccessMessage,
    handleSetCliPath
  };
};

export default useServiceStatus;
