import axios from 'axios';
import { STM_SERVICE_URL, API_BASE_URL } from '../constants/api';

// 文件服务工具类
const fileService = {
  // 获取所有工程文件
  getAllFiles: async (path = '') => {
    try {
      // 添加 path 参数
      const url = path
        ? `${STM_SERVICE_URL}${API_BASE_URL}/workspace/files?path=${encodeURIComponent(path)}&user_id=user123`
        : `${STM_SERVICE_URL}${API_BASE_URL}/workspace/projects?user_id=user123`;

      console.log('请求文件列表URL:', url);

      const response = await axios.get(url);
      if (response.data.status === 'success') {
        // 确保返回的数据是数组
        const files = Array.isArray(response.data.data) ? response.data.data : [];

        // 打印原始数据，帮助调试
        console.log(`获取到 ${path ? path + ' 目录' : '根目录'} 的文件数量:`, files.length);
        console.log('原始文件数据:', files);

        // 确保每个文件对象都有基本属性
        return files.map(file => {
          if (!file) return null;

          // 构建基本文件对象
          // 确保同时有 is_dir 和 isDir 属性，以兼容不同的代码
          const isDirectory = file.is_dir || file.isDir || false;

          return {
            // 保留原始属性
            ...file,
            // 确保有 path 属性
            path: file.path || file.name || '',
            // 确保有 name 属性
            name: file.name || (file.path ? file.path.split('/').pop() : ''),
            // 同时设置 is_dir 和 isDir 属性
            is_dir: isDirectory,
            isDir: isDirectory
          };
        }).filter(Boolean); // 过滤掉无效的文件
      } else {
        throw new Error(response.data.message || '获取文件列表失败');
      }
    } catch (error) {
      console.error('获取文件列表错误:', error);
      throw error;
    }
  },

  // 获取文件内容
  getFileContent: async (filePath) => {
    try {
      // 统一路径分隔符为/
      const cleanPath = filePath.replace(/\\/g, '/');
      console.log('获取文件内容，路径:', cleanPath);

      const url = `${STM_SERVICE_URL}${API_BASE_URL}/workspace/file?path=${encodeURIComponent(cleanPath)}&user_id=user123`;
      console.log('请求URL:', url);

      const response = await axios.get(url);
      console.log('获取文件内容响应:', response.data);

      if (response.data.status === 'success') {
        const fileData = response.data.data;

        // 确保返回的数据包含必要的字段
        if (!fileData) {
          console.error('文件数据为空');
          throw new Error('文件数据为空');
        }

        // 确保有文件名
        if (!fileData.name) {
          fileData.name = cleanPath.split('/').pop();
        }

        // 确保有内容字段
        if (fileData.content === undefined) {
          console.error('文件内容字段缺失');
          throw new Error('文件内容字段缺失');
        }

        console.log('文件内容获取成功:', fileData.name, '长度:', fileData.content.length);
        return fileData;
      } else {
        console.error('获取文件内容失败:', response.data.message);
        throw new Error(response.data.message || '获取文件内容失败');
      }
    } catch (error) {
      console.error('获取文件内容错误:', error);
      throw error;
    }
  },

  // 保存文件内容
  saveFileContent: async (filePath, content) => {
    try {
      // 统一路径分隔符为/
      const cleanPath = filePath.replace(/\\/g, '/');

      const response = await axios.post(`${STM_SERVICE_URL}${API_BASE_URL}/workspace/file?user_id=user123`, {
        path: cleanPath,
        content: content
      });

      if (response.data.status === 'success') {
        return true;
      } else {
        throw new Error(response.data.message || '保存文件失败');
      }
    } catch (error) {
      console.error('保存文件错误:', error);
      throw error;
    }
  }
};

export default fileService;
