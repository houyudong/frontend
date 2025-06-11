// 支持的文件类型映射
export const languageMap = {
  '.c': 'c',
  '.h': 'c',
  '.cpp': 'cpp',
  '.hpp': 'cpp',
  '.java': 'java',
  '.py': 'python',
  '.js': 'javascript',
  '.html': 'html',
  '.css': 'css',
  '.json': 'json',
  '.txt': 'plaintext',
  '.md': 'markdown',
};

// 获取文件扩展名的语言类型
export const getLanguageByExtension = (filename) => {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return languageMap[ext] || 'plaintext';
};

export default { languageMap, getLanguageByExtension };
