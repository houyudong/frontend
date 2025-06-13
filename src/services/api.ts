import apiClient from './apiClient';
import endpoints from './apiEndpoints';

/**
 * 获取课程数据
 * @param {string} id - 课程ID
 * @returns {Promise<any>} - 课程数据
 */
export const getCourseById = async (id: string): Promise<any> => {
  const response = await apiClient.get(endpoints.CONTENT.COURSE_DETAIL(id));
  return response.data;
}; 