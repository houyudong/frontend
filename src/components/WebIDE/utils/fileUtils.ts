/**
 * 获取文件扩展名
 * @param {string} filename - 文件名
 * @returns {string} 文件扩展名
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * 获取文件类型
 * @param {string} filename - 文件名
 * @returns {string} 文件类型
 */
export const getFileType = (filename: string): string => {
  const ext = getFileExtension(filename).toLowerCase();
  const typeMap: Record<string, string> = {
    c: 'c',
    h: 'c',
    cpp: 'cpp',
    hpp: 'cpp',
    s: 'assembly',
    asm: 'assembly',
    ld: 'linker',
    makefile: 'makefile',
    txt: 'text',
    md: 'markdown',
    json: 'json'
  };
  return typeMap[ext] || 'text';
}; 