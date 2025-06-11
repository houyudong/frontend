/**
 * API 工具函数
 * 用于处理API请求和响应
 */

/**
 * 处理API响应
 * @param {Object} response - Axios响应对象
 * @param {Function} onSuccess - 成功回调函数
 * @param {Function} onError - 错误回调函数
 * @param {Function} appendToDebugOutput - 调试输出函数
 * @returns {boolean} - 是否成功处理
 */
export const handleApiResponse = (response, onSuccess, onError, appendToDebugOutput) => {
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

/**
 * 处理API错误
 * @param {Error} error - 错误对象
 * @param {Function} onError - 错误回调函数
 * @param {Function} appendToDebugOutput - 调试输出函数
 * @returns {string} - 错误消息
 */
export const handleApiError = (error, onError, appendToDebugOutput) => {
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
