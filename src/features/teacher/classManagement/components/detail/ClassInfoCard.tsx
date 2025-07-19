/**
 * 班级信息卡片组件
 * 
 * 展示和编辑班级的基本信息
 */

import React, { useState } from 'react';
import type { Class } from '../../types';

interface ClassInfoCardProps {
  classData: Class;
  onUpdate: (data: any) => Promise<void>;
  loading?: boolean;
}

const ClassInfoCard: React.FC<ClassInfoCardProps> = ({
  classData,
  onUpdate,
  loading = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: classData.name,
    description: classData.description || '',
    maxStudents: classData.maxStudents,
    semester: classData.semester,
    academicYear: classData.academicYear
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  // 处理编辑
  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: classData.name,
      description: classData.description || '',
      maxStudents: classData.maxStudents,
      semester: classData.semester,
      academicYear: classData.academicYear
    });
  };

  // 处理取消
  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: classData.name,
      description: classData.description || '',
      maxStudents: classData.maxStudents,
      semester: classData.semester,
      academicYear: classData.academicYear
    });
  };

  // 处理保存
  const handleSave = async () => {
    setUpdateLoading(true);
    try {
      await onUpdate(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('更新班级信息失败:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 学期选项
  const semesters = [
    { value: '春季学期', label: '春季学期' },
    { value: '夏季学期', label: '夏季学期' },
    { value: '秋季学期', label: '秋季学期' },
    { value: '冬季学期', label: '冬季学期' }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">班级基本信息</h3>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="btn btn-secondary btn-sm"
            disabled={loading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            编辑
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="btn btn-secondary btn-sm"
              disabled={updateLoading}
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary btn-sm"
              disabled={updateLoading}
            >
              {updateLoading ? (
                <>
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  保存中...
                </>
              ) : (
                '保存'
              )}
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        // 显示模式
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">班级名称</label>
            <p className="text-gray-900">{classData.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">最大学生数</label>
            <p className="text-gray-900">{classData.maxStudents || '无限制'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">学期</label>
            <p className="text-gray-900">{classData.semester}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">学年</label>
            <p className="text-gray-900">{classData.academicYear}</p>
          </div>



          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <span className={`badge ${
              classData.status === 'active' ? 'badge-success' :
              classData.status === 'inactive' ? 'badge-warning' : 'badge-secondary'
            }`}>
              {classData.status === 'active' ? '活跃' :
               classData.status === 'inactive' ? '非活跃' : '已归档'}
            </span>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">班级描述</label>
            <p className="text-gray-900">{classData.description || '暂无描述'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">创建时间</label>
            <p className="text-gray-900">{new Date(classData.createdAt).toLocaleString('zh-CN')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">更新时间</label>
            <p className="text-gray-900">{new Date(classData.updatedAt).toLocaleString('zh-CN')}</p>
          </div>
        </div>
      ) : (
        // 编辑模式
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                班级名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input-primary"
                placeholder="请输入班级名称"
                disabled={updateLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大学生数
              </label>
              <input
                type="number"
                value={editData.maxStudents || ''}
                onChange={(e) => handleInputChange('maxStudents', e.target.value ? Number(e.target.value) : undefined)}
                className="input-primary"
                placeholder="不限制"
                min="1"
                max="200"
                disabled={updateLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                学期 <span className="text-red-500">*</span>
              </label>
              <select
                value={editData.semester}
                onChange={(e) => handleInputChange('semester', e.target.value)}
                className="input-primary"
                disabled={updateLoading}
              >
                {semesters.map(semester => (
                  <option key={semester.value} value={semester.value}>
                    {semester.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                学年 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editData.academicYear}
                onChange={(e) => handleInputChange('academicYear', e.target.value)}
                className="input-primary"
                placeholder="如：2024"
                disabled={updateLoading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                课程
              </label>
              <input
                type="text"
                value={editData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="input-primary"
                placeholder="请输入课程名称"
                disabled={updateLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              班级描述
            </label>
            <textarea
              value={editData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="input-primary resize-none"
              placeholder="请输入班级描述（可选）"
              disabled={updateLoading}
            />
            <p className="mt-1 text-sm text-gray-500">
              {editData.description.length}/500
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassInfoCard;
