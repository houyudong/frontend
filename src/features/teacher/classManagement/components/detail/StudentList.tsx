/**
 * 学生列表组件
 * 
 * 在班级详情页中展示和管理学生
 */

import React, { useState, useEffect } from 'react';
import { useStudentManagement } from '../../hooks/useStudentManagement';
import Modal, { ConfirmModal } from '../common/Modal';
import StudentForm from '../student/StudentForm';
import type { Student, StudentFormData, ModalState } from '../../types';

interface StudentListProps {
  classId: string;
  className: string;
}

const StudentList: React.FC<StudentListProps> = ({
  classId,
  className
}) => {
  const {
    students,
    loading,
    error,
    pagination,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    setPage,
    setPageSize
  } = useStudentManagement();

  // 模态框状态
  const [formModal, setFormModal] = useState<ModalState>({
    isOpen: false,
    mode: 'create'
  });
  const [deleteModal, setDeleteModal] = useState<ModalState>({
    isOpen: false,
    mode: 'delete'
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 加载学生数据
  useEffect(() => {
    fetchStudents({ classId });
  }, [classId, fetchStudents]);

  // 处理创建学生
  const handleCreate = () => {
    setSelectedStudent(null);
    setFormModal({ isOpen: true, mode: 'create' });
  };

  // 处理编辑学生
  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormModal({ isOpen: true, mode: 'edit' });
  };

  // 处理删除学生
  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setDeleteModal({ isOpen: true, mode: 'delete' });
  };

  // 处理表单提交
  const handleFormSubmit = async (data: StudentFormData) => {
    setFormLoading(true);
    try {
      if (formModal.mode === 'create') {
        await createStudent({ ...data, classId });
      } else if (selectedStudent) {
        await updateStudent(selectedStudent.id, data);
      }
      setFormModal({ isOpen: false, mode: 'create' });
      setSelectedStudent(null);
    } catch (error) {
      console.error('操作失败:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // 处理删除确认
  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;
    
    setDeleteLoading(true);
    try {
      await deleteStudent(selectedStudent.id);
      setDeleteModal({ isOpen: false, mode: 'delete' });
      setSelectedStudent(null);
    } catch (error) {
      console.error('删除失败:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // 获取状态显示文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '正常';
      case 'inactive': return '非活跃';
      case 'suspended': return '暂停';
      case 'graduated': return '已毕业';
      default: return status;
    }
  };

  // 获取状态样式
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'badge-success';
      case 'inactive': return 'badge-warning';
      case 'suspended': return 'badge-danger';
      case 'graduated': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-800 mb-2">加载失败</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchStudents({ classId })}
          className="btn btn-primary"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">学生列表</h3>
          <p className="text-sm text-gray-600 mt-1">
            共 {pagination.total} 名学生
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary"
          disabled={loading}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          添加学生
        </button>
      </div>

      {/* 学生表格 */}
      <div className="card p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner w-8 h-8 mr-3"></div>
            <span className="text-gray-600">加载中...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无学生</h3>
            <p className="text-gray-600 mb-4">该班级还没有学生，点击上方按钮添加学生</p>
            <button
              onClick={handleCreate}
              className="btn btn-primary"
            >
              添加第一个学生
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>学生信息</th>
                  <th>学号</th>
                  <th>联系方式</th>
                  <th>学习统计</th>
                  <th>状态</th>
                  <th>最后登录</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="group">
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {student.fullName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{student.fullName}</div>
                          <div className="text-sm text-gray-500">{student.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-sm">{student.studentId}</span>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>{student.email}</div>
                        {student.phone && (
                          <div className="text-gray-500">{student.phone}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>课程: {student.coursesCompleted}</div>
                        <div>实验: {student.experimentsCompleted}</div>
                        <div>平均分: {student.averageScore.toFixed(1)}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(student.status)}`}>
                        {getStatusText(student.status)}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600">
                        {student.lastLogin ? 
                          new Date(student.lastLogin).toLocaleDateString('zh-CN') : 
                          '从未登录'
                        }
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(student)}
                          className="btn btn-sm btn-ghost text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="编辑"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(student)}
                          className="btn btn-sm btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="删除"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页 */}
        {pagination.total > pagination.pageSize && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              显示 {((pagination.current - 1) * pagination.pageSize) + 1} 到{' '}
              {Math.min(pagination.current * pagination.pageSize, pagination.total)} 条，
              共 {pagination.total} 条
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(pagination.current - 1)}
                disabled={pagination.current <= 1}
                className="btn btn-sm btn-secondary"
              >
                上一页
              </button>
              <button
                onClick={() => setPage(pagination.current + 1)}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                className="btn btn-sm btn-secondary"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 学生表单模态框 */}
      <Modal
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, mode: 'create' })}
        title={formModal.mode === 'create' ? '添加学生' : '编辑学生'}
        size="lg"
      >
        <StudentForm
          initialData={selectedStudent ? {
            username: selectedStudent.username,
            email: selectedStudent.email,
            fullName: selectedStudent.fullName,
            studentId: selectedStudent.studentId,
            classId: selectedStudent.classId,
            phone: selectedStudent.phone,
            grade: selectedStudent.grade,
            major: selectedStudent.major,
            notes: selectedStudent.notes
          } : undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModal({ isOpen: false, mode: 'create' })}
          loading={formLoading}
          mode={formModal.mode}
          className={className}
        />
      </Modal>

      {/* 删除确认模态框 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, mode: 'delete' })}
        onConfirm={handleDeleteConfirm}
        title="删除学生"
        message={`确定要删除学生 "${selectedStudent?.fullName}" 吗？此操作不可撤销。`}
        confirmText="删除"
        confirmButtonClass="btn-danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default StudentList;
