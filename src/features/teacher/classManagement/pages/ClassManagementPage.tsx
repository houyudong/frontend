/**
 * 班级管理页面
 *
 * 教师班级管理的主页面，提供班级的增删改查功能
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../../../pages/layout/MainLayout';
import { useClassManagement } from '../hooks/useClassManagement';
import ClassTable from '../components/class/ClassTable';
import ClassForm from '../components/class/ClassForm';
import SearchFilter from '../components/common/SearchFilter';
import Modal, { ConfirmModal } from '../components/common/Modal';
import Button from '../../../../components/ui/Button';
import { PlusIcon, RefreshIcon } from '../../../../components/ui/icons';
import type {
  Class,
  ClassFormData,
  ModalState,
  FilterConfig,
  ClassQueryParams
} from '../types';
import { getClassStatusText } from '../utils';

const ClassManagementPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    classes,
    loading,
    error,
    pagination,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,
    setPage,
    setPageSize,
    setFilters
  } = useClassManagement();

  // 模态框状态
  const [formModal, setFormModal] = useState<ModalState>({
    isOpen: false,
    mode: 'create'
  });
  const [deleteModal, setDeleteModal] = useState<ModalState>({
    isOpen: false,
    mode: 'delete'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 搜索和过滤状态
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  // 过滤器配置
  const filterConfigs: FilterConfig[] = [
    {
      key: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '活跃', value: 'active' },
        { label: '不活跃', value: 'inactive' },
        { label: '已归档', value: 'archived' }
      ]
    },
    {
      key: 'semester',
      label: '学期',
      type: 'select',
      options: [
        { label: '春季学期', value: '春季学期' },
        { label: '夏季学期', value: '夏季学期' },
        { label: '秋季学期', value: '秋季学期' },
        { label: '冬季学期', value: '冬季学期' }
      ]
    },
    {
      key: 'academicYear',
      label: '学年',
      type: 'input',
      placeholder: '请输入学年'
    }
  ];

  // 处理搜索
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setFilters({ search: value });
  };

  // 处理过滤器变化
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);

    // 构建查询参数
    const queryParams: Partial<ClassQueryParams> = {
      search: searchValue,
      ...newFilters
    };

    setFilters(queryParams);
  };

  // 打开创建班级模态框
  const handleCreate = () => {
    setFormModal({
      isOpen: true,
      mode: 'create',
      data: null
    });
  };

  // 打开编辑班级模态框
  const handleEdit = (classItem: Class) => {
    setFormModal({
      isOpen: true,
      mode: 'edit',
      data: classItem
    });
  };

  // 导航到班级详情页面
  const handleView = (classItem: Class) => {
    navigate(`/teacher/management/classes/${classItem.id}`);
  };

  // 打开删除确认模态框
  const handleDelete = (classItem: Class) => {
    setDeleteModal({
      isOpen: true,
      mode: 'delete',
      data: classItem
    });
  };

  // 关闭表单模态框
  const handleCloseFormModal = () => {
    setFormModal({
      isOpen: false,
      mode: 'create',
      data: null
    });
  };

  // 关闭删除模态框
  const handleCloseDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      mode: 'delete',
      data: null
    });
  };

  // 提交表单
  const handleFormSubmit = async (formData: ClassFormData) => {
    try {
      setFormLoading(true);

      if (formModal.mode === 'create') {
        // 创建班级并获取新班级信息
        const newClass = await createClass(formData);
        handleCloseFormModal();

        // 短暂延迟后跳转到班级详情页，让用户看到成功状态
        setTimeout(() => {
          navigate(`/teacher/management/classes/${newClass.id}`);
        }, 300);
      } else if (formModal.mode === 'edit' && formModal.data) {
        await updateClass(formModal.data.id, formData);
        handleCloseFormModal();
      }
    } catch (error) {
      console.error('操作失败:', error);
      // 这里可以添加错误提示
    } finally {
      setFormLoading(false);
    }
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    if (!deleteModal.data) return;

    try {
      setDeleteLoading(true);
      await deleteClass(deleteModal.data.id);
      handleCloseDeleteModal();
    } catch (error) {
      console.error('删除失败:', error);
      // 这里可以添加错误提示
    } finally {
      setDeleteLoading(false);
    }
  };

  // 处理分页变化
  const handlePaginationChange = (page: number, pageSize: number) => {
    if (pageSize !== pagination.pageSize) {
      setPageSize(pageSize);
    } else {
      setPage(page);
    }
  };

  // 刷新数据
  const handleRefresh = () => {
    fetchClasses();
  };

  return (
    <MainLayout>
        {/* 面包屑导航 - 现代化设计 */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 mb-8">
          <div className="page-container py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/teacher/dashboard" className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                教师工作台
              </Link>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="text-gray-600">教学管理</span>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="text-green-700 font-medium">班级管理</span>
            </nav>
          </div>
        </div>

        <div className="page-container">
          {/* 页面标题 - 现代化英雄区域 */}
          <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-green-800 rounded-2xl mb-8 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

            <div className="relative px-8 py-12">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-3">班级管理</h1>
                  <p className="text-green-100 text-lg mb-6 max-w-2xl">
                    管理您的班级信息，包括班级创建、编辑、删除等操作
                  </p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-white/90">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">管理状态：活跃</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/90">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-sm">管理 {classes.length} 个班级</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:flex items-center space-x-4">
                  <Link to="/teacher/management/students">
                    <button className="group bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <span>学生管理</span>
                    </button>
                  </Link>
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-6xl">🏫</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 错误提示 - 现代化设计 */}
          {error && (
            <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    操作失败
                  </h3>
                  <div className="text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 搜索和操作区域 - 现代化设计 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">班级列表</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* 搜索区域 */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="搜索班级名称、教师姓名..."
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="group px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
                >
                  <svg className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-300 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>刷新</span>
                </button>
                <button
                  onClick={handleCreate}
                  className="group px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>创建班级</span>
                </button>
              </div>
            </div>

            {/* 筛选器 */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <SearchFilter
                searchPlaceholder="搜索班级名称、教师姓名..."
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                filters={filterConfigs}
                filterValues={filterValues}
                onFilterChange={handleFilterChange}
                actions={null}
              />
            </div>
          </div>

          {/* 班级表格 - 现代化容器 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <ClassTable
              classes={classes}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50, 100],
                onChange: handlePaginationChange
              }}
            />
          </div>

        {/* 表单模态框 */}
        <Modal
          isOpen={formModal.isOpen}
          onClose={handleCloseFormModal}
          title={
            formModal.mode === 'create' ? '创建班级' :
            formModal.mode === 'edit' ? '编辑班级' : '班级详情'
          }
          size="large"
          loading={formLoading}
        >
          {formModal.mode === 'view' && formModal.data ? (
            // 查看模式 - 显示班级详情
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">班级名称</label>
                  <p className="mt-1 text-sm text-gray-900">{formModal.data.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">状态</label>
                  <p className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getClassStatusColor(formModal.data.status)}`}>
                      {getClassStatusText(formModal.data.status)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">学生人数</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formModal.data.studentCount}
                    {formModal.data.maxStudents && ` / ${formModal.data.maxStudents}`}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">任课教师</label>
                  <p className="mt-1 text-sm text-gray-900">{formModal.data.teacherName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">学年学期</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formModal.data.academicYear} {formModal.data.semester}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">课程</label>
                  <p className="mt-1 text-sm text-gray-900">{formModal.data.subject || '-'}</p>
                </div>
              </div>
              {formModal.data.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">描述</label>
                  <p className="mt-1 text-sm text-gray-900">{formModal.data.description}</p>
                </div>
              )}
            </div>
          ) : (
            // 创建/编辑模式 - 显示表单
            <ClassForm
              initialData={formModal.data}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseFormModal}
              loading={formLoading}
              mode={formModal.mode as 'create' | 'edit'}
            />
          )}
        </Modal>

        {/* 删除确认模态框 */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="删除班级"
          message={`确定要删除班级"${deleteModal.data?.name}"吗？此操作不可撤销。`}
          type="danger"
          confirmText="删除"
          cancelText="取消"
          loading={deleteLoading}
        />
        </div>
    </MainLayout>
  );
};

export default ClassManagementPage;
