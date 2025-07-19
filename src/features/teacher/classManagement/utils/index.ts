/**
 * 班级管理工具函数
 * 
 * 提供通用的工具函数，遵循项目代码规范
 */

import type { ClassStatus, StudentStatus, SortDirection } from '../types';

/**
 * 格式化日期时间
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '-';
  }
};

/**
 * 格式化日期
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  } catch {
    return '-';
  }
};

/**
 * 格式化时间
 */
export const formatTime = (minutes: number): string => {
  if (!minutes || minutes < 0) return '0分钟';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  }
  
  return `${mins}分钟`;
};

/**
 * 获取班级状态显示文本
 */
export const getClassStatusText = (status: ClassStatus): string => {
  const statusMap: Record<ClassStatus, string> = {
    active: '活跃',
    inactive: '不活跃',
    archived: '已归档'
  };
  
  return statusMap[status] || '未知';
};

/**
 * 获取班级状态样式类名
 */
export const getClassStatusColor = (status: ClassStatus): string => {
  const colorMap: Record<ClassStatus, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800'
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

/**
 * 获取学生状态显示文本
 */
export const getStudentStatusText = (status: StudentStatus): string => {
  const statusMap: Record<StudentStatus, string> = {
    active: '活跃',
    inactive: '不活跃',
    suspended: '暂停',
    graduated: '已毕业'
  };
  
  return statusMap[status] || '未知';
};

/**
 * 获取学生状态样式类名
 */
export const getStudentStatusColor = (status: StudentStatus): string => {
  const colorMap: Record<StudentStatus, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800',
    graduated: 'bg-blue-100 text-blue-800'
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

/**
 * 生成随机ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 深拷贝对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
};

/**
 * 验证邮箱格式
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证手机号格式
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证学号格式（示例：支持数字和字母组合）
 */
export const validateStudentId = (studentId: string): boolean => {
  const studentIdRegex = /^[A-Za-z0-9]{6,20}$/;
  return studentIdRegex.test(studentId);
};

/**
 * 验证用户名格式
 */
export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * 计算分页信息
 */
export const calculatePagination = (
  total: number,
  current: number,
  pageSize: number
) => {
  const totalPages = Math.ceil(total / pageSize);
  const hasNext = current < totalPages;
  const hasPrev = current > 1;
  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);
  
  return {
    totalPages,
    hasNext,
    hasPrev,
    start,
    end,
    showingText: total > 0 ? `显示 ${start}-${end} 条，共 ${total} 条` : '暂无数据'
  };
};

/**
 * 排序数组
 */
export const sortArray = <T>(
  array: T[],
  key: keyof T,
  direction: SortDirection = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (aValue === bValue) return 0;
    
    let result = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      result = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      result = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      result = aValue.getTime() - bValue.getTime();
    } else {
      result = String(aValue).localeCompare(String(bValue));
    }
    
    return direction === 'asc' ? result : -result;
  });
};

/**
 * 过滤数组
 */
export const filterArray = <T>(
  array: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return array;
  
  const term = searchTerm.toLowerCase();
  
  return array.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      return String(value).toLowerCase().includes(term);
    })
  );
};

/**
 * 导出数据为CSV
 */
export const exportToCSV = <T>(
  data: T[],
  filename: string,
  headers: { key: keyof T; label: string }[]
): void => {
  if (!data.length) return;
  
  // 创建CSV内容
  const csvContent = [
    // 表头
    headers.map(h => h.label).join(','),
    // 数据行
    ...data.map(row =>
      headers.map(h => {
        const value = row[h.key];
        // 处理包含逗号的值
        const stringValue = String(value || '');
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',')
    )
  ].join('\n');
  
  // 创建并下载文件
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * 获取文件扩展名
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 生成颜色
 */
export const generateColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

/**
 * 获取头像背景色
 */
export const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * 获取姓名首字母
 */
export const getNameInitials = (name: string): string => {
  if (!name) return '';
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
