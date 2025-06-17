/**
 * 根据MCU型号获取芯片系列
 * @param model - MCU型号
 * @returns 芯片系列名称
 */
export const getChipFamilyFromModel = (model: string): string => {
  if (!model) return 'stm32f1';

  if (model.includes('F103')) return 'stm32f1';
  if (model.includes('F4')) return 'stm32f4';
  if (model.includes('H7')) return 'stm32h7';

  // 默认返回F1系列
  return 'stm32f1';
};

/**
 * 格式化文件大小
 * @param bytes - 文件大小（字节）
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 格式化日期时间
 * @param dateString - 日期时间字符串
 * @returns 格式化后的日期时间字符串
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleString();
};

/**
 * 编译错误信息接口
 */
interface CompileError {
  file: string;
  line: number;
  column: number;
  message: string;
}

/**
 * 解析编译错误
 * @param output - 编译输出内容
 * @returns 编译错误数组
 */
export const parseCompileErrors = (output: string): CompileError[] => {
  if (!output) return [];

  const lines = output.split('\n');
  const errors: CompileError[] = [];

  lines.forEach(line => {
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

  return errors;
};

/**
 * 获取文件扩展名
 * @param filename - 文件名
 * @returns 文件扩展名
 */
export const getFileExtension = (filename: string): string => {
  if (!filename) return '';
  return filename.substring(filename.lastIndexOf('.')).toLowerCase();
};

/**
 * 检查是否为二进制文件
 * @param filename - 文件名
 * @returns 是否为二进制文件
 */
export const isBinaryFile = (filename: string): boolean => {
  if (!filename) return false;

  const ext = getFileExtension(filename);
  const binaryExtensions = ['.bin', '.hex', '.elf', '.axf', '.out', '.o', '.a', '.so', '.dll', '.exe'];

  return binaryExtensions.includes(ext);
};

/**
 * 检查是否为源代码文件
 * @param filename - 文件名
 * @returns 是否为源代码文件
 */
export const isSourceFile = (filename: string): boolean => {
  if (!filename) return false;

  const ext = getFileExtension(filename);
  const sourceExtensions = ['.c', '.h', '.cpp', '.hpp', '.s', '.asm'];

  return sourceExtensions.includes(ext);
};

/**
 * 生成随机ID
 * @returns 随机ID字符串
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * 保存文件到本地
 * @param fileName - 文件名
 * @param content - 文件内容
 */
export const saveFileToLocal = (fileName: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}; 