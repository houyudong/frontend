import axios from 'axios';
import { STM_SERVICE_URL } from '../constants/api';

// 工作区服务工具类
const workspaceService = {
  // 获取项目列表
  getProjects: async (userId) => {
    try {
      if (!userId) {
        throw new Error('用户ID不能为空');
      }

      console.log('获取项目列表，用户ID:', userId);
      const url = `${STM_SERVICE_URL}/api/workspace/projects?user_id=${encodeURIComponent(userId)}`;
      console.log('请求URL:', url);

      const response = await axios.get(url);
      if (response.data.status === 'success') {
        const projects = Array.isArray(response.data.data) ? response.data.data : [];
        console.log(`获取到 ${projects.length} 个项目`);
        console.log('项目数据:', projects);

        // 确保每个项目对象都有基本属性
        return projects.map(project => {
          if (!project) return null;

          // 构建基本项目对象
          return {
            // 保留原始属性
            ...project,
            // 确保有 name 属性
            name: project.name || '',
            // 确保有 path 属性
            path: project.path || '',
            // 确保有 description 属性
            description: project.description || '',
            // 确保有 chip_id 属性
            chip_id: project.chip_id || '',
            // 确保有 chip_family 属性
            chip_family: project.chip_family || '',
            // 确保有 last_opened 属性
            last_opened: project.last_opened || new Date().toISOString()
          };
        }).filter(Boolean); // 过滤掉无效的项目
      } else {
        throw new Error(response.data.message || '获取项目列表失败');
      }
    } catch (error) {
      console.error('获取项目列表错误:', error);
      throw error;
    }
  },

  // 获取项目文件
  getProjectFiles: async (userId, projectName, path = '') => {
    try {
      if (!userId) {
        throw new Error('用户ID不能为空');
      }

      if (!projectName) {
        throw new Error('项目名称不能为空');
      }

      console.log('获取项目文件，用户ID:', userId, '项目名称:', projectName, '路径:', path);
      let url = `${STM_SERVICE_URL}/api/workspace/files?user_id=${encodeURIComponent(userId)}&project_name=${encodeURIComponent(projectName)}`;
      if (path) {
        url += `&path=${encodeURIComponent(path)}`;
      }
      console.log('请求URL:', url);

      const response = await axios.get(url);
      if (response.data.status === 'success') {
        const files = Array.isArray(response.data.data) ? response.data.data : [];
        console.log(`获取到 ${files.length} 个文件`);
        console.log('文件数据:', files);

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
            isDir: isDirectory,
            // 确保有 size 属性
            size: file.size || 0,
            // 确保有 updated_at 属性
            updated_at: file.updated_at || new Date().toISOString()
          };
        }).filter(Boolean); // 过滤掉无效的文件
      } else {
        throw new Error(response.data.message || '获取项目文件失败');
      }
    } catch (error) {
      console.error('获取项目文件错误:', error);
      throw error;
    }
  },

  // 获取文件内容
  getFileContent: async (userId, projectName, filePath) => {
    try {
      if (!userId) {
        throw new Error('用户ID不能为空');
      }

      if (!projectName) {
        throw new Error('项目名称不能为空');
      }

      if (!filePath) {
        throw new Error('文件路径不能为空');
      }

      // 统一路径分隔符为/
      const cleanPath = filePath.replace(/\\/g, '/');
      console.log('获取文件内容，用户ID:', userId, '项目名称:', projectName, '路径:', cleanPath);

      const url = `${STM_SERVICE_URL}/api/workspace/file?user_id=${encodeURIComponent(userId)}&project_name=${encodeURIComponent(projectName)}&path=${encodeURIComponent(cleanPath)}`;
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
  saveFileContent: async (userId, projectName, filePath, content) => {
    try {
      if (!userId) {
        throw new Error('用户ID不能为空');
      }

      if (!projectName) {
        throw new Error('项目名称不能为空');
      }

      if (!filePath) {
        throw new Error('文件路径不能为空');
      }

      // 统一路径分隔符为/
      const cleanPath = filePath.replace(/\\/g, '/');
      console.log('保存文件内容，用户ID:', userId, '项目名称:', projectName, '路径:', cleanPath);

      const url = `${STM_SERVICE_URL}/api/workspace/file?user_id=${encodeURIComponent(userId)}&project_name=${encodeURIComponent(projectName)}`;
      console.log('请求URL:', url);

      const response = await axios.post(url, {
        path: cleanPath,
        content: content
      });

      if (response.data.status === 'success') {
        console.log('文件内容保存成功');
        return true;
      } else {
        console.error('保存文件内容失败:', response.data.message);
        throw new Error(response.data.message || '保存文件内容失败');
      }
    } catch (error) {
      console.error('保存文件内容错误:', error);
      throw error;
    }
  }
};

export default workspaceService;
