import axios from 'axios';
import { getApiUrl } from '../config';

/**
 * AI调试服务 - 提供STM32代码错误分析和修复建议
 */
const apiUrl = getApiUrl();

/**
 * 使用AI分析代码错误并提供修复建议
 * @param {string} errorMessage - 完整的错误消息
 * @param {string} sourceCode - 导致错误的源代码
 * @param {string} mcuModel - MCU型号，例如"STM32H743ZI"
 * @returns {Promise} - 包含分析结果和修复建议的Promise
 */
export const analyzeError = async (errorMessage, sourceCode, mcuModel = "STM32H743ZI") => {
  try {
    console.log('AI调试请求:', { errorLength: errorMessage?.length, codeLength: sourceCode?.length });
    
    const response = await axios.post(`${apiUrl}/api/debug/analyze`, {
      error_message: errorMessage,
      source_code: sourceCode,
      mcu_model: mcuModel
    });
    
    console.log('AI调试响应状态:', response.status);
    
    if (response.status !== 200) {
      throw new Error(`错误分析失败: ${response.status} ${response.statusText}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('AI调试错误:', error);
    
    // 如果API不可用，返回基本分析
    return generateBasicAnalysis(errorMessage, sourceCode);
  }
};

/**
 * 使用流式API分析错误
 * 支持实时更新分析结果
 * @param {string} errorMessage - 完整的错误消息
 * @param {string} sourceCode - 导致错误的源代码
 * @param {string} mcuModel - MCU型号，例如"STM32H743ZI"
 * @param {object} callbacks - 回调函数对象，用于处理流式响应
 * @returns {Promise} - 包含分析过程的Promise
 */
export const analyzeErrorStream = async (errorMessage, sourceCode, mcuModel = "STM32H743ZI", callbacks = {}) => {
  const { 
    onStart, 
    onUpdate, 
    onComplete, 
    onError 
  } = callbacks;
  
  try {
    if (onStart) onStart();
    
    console.log('流式AI调试请求:', { errorLength: errorMessage?.length, codeLength: sourceCode?.length });
    
    // 设置流式响应
    const response = await fetch(`${apiUrl}/api/debug/analyze-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        error_message: errorMessage,
        source_code: sourceCode,
        mcu_model: mcuModel
      })
    });
    
    if (!response.ok) {
      throw new Error(`错误分析失败: ${response.status} ${response.statusText}`);
    }
    
    // 处理流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let analysisResult = {
      analysis: '',
      error_type: '',
      solutions: [],
      code_fix: ''
    };
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      // 解码收到的数据
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const data = JSON.parse(line.slice(5));
            
            if (data.error) {
              if (onError) onError(data.error);
              throw new Error(data.error);
            }
            
            if (data.analysis) {
              analysisResult.analysis += data.analysis;
            }
            
            if (data.error_type) {
              analysisResult.error_type = data.error_type;
            }
            
            if (data.solutions) {
              analysisResult.solutions = [...data.solutions];
            }
            
            if (data.code_fix) {
              analysisResult.code_fix = data.code_fix;
            }
            
            if (data.completed) {
              if (onComplete) onComplete(analysisResult);
              return analysisResult;
            }
            
            // 更新进度
            if (onUpdate) onUpdate(analysisResult);
          } catch (err) {
            console.error('解析流数据错误:', err, line.slice(5));
          }
        }
      }
    }
    
    if (onComplete) onComplete(analysisResult);
    return analysisResult;
  } catch (error) {
    console.error('流式AI调试错误:', error);
    if (onError) onError(error.message);
    
    // 如果API不可用，返回基本分析
    const fallbackResult = generateBasicAnalysis(errorMessage, sourceCode);
    if (onComplete) onComplete(fallbackResult);
    return fallbackResult;
  }
};

/**
 * 在后端API不可用时生成基本错误分析
 * @param {string} errorMessage - 错误消息
 * @param {string} sourceCode - 源代码
 * @returns {object} - 基本分析结果
 */
function generateBasicAnalysis(errorMessage, sourceCode) {
  let errorType = '未知错误';
  let analysis = '基于提供的错误信息进行基本分析';
  let solutions = ['检查代码语法错误', '验证HAL库函数调用是否正确', '确认外设配置是否正确'];
  let codeFix = '';
  
  // 基于常见错误模式进行简单分析
  if (errorMessage.includes('undefined reference')) {
    errorType = '链接错误';
    analysis = '找不到函数或变量的定义，可能是缺少库文件或未正确配置编译设置';
    solutions = [
      '确认所有函数都有定义',
      '检查链接器设置和库路径',
      '确保HAL库已正确配置'
    ];
  } else if (errorMessage.includes('syntax error')) {
    errorType = '编译错误';
    analysis = '代码存在语法错误，检查括号、分号等标点符号';
    solutions = [
      '检查代码语法',
      '确认C语言关键字使用正确',
      '检查变量声明格式'
    ];
  } else if (errorMessage.includes('hard fault')) {
    errorType = '运行时错误';
    analysis = '处理器硬件故障，可能是访问了无效内存地址';
    solutions = [
      '检查指针初始化',
      '避免数组越界访问',
      '验证中断处理函数实现'
    ];
  }
  
  return {
    error_type: errorType,
    analysis: analysis,
    solutions: solutions,
    code_fix: codeFix
  };
}

export default {
  analyzeError,
  analyzeErrorStream
}; 