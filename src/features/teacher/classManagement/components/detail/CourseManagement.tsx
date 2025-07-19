/**
 * 课程管理组件
 * 
 * 在班级详情页中管理课程和课程表
 */

import React, { useState } from 'react';
import Modal, { ConfirmModal } from '../common/Modal';
import CourseForm from '../course/CourseForm';
import CourseSelector from '../course/CourseSelector';
import CourseScheduleView from '../course/CourseScheduleView';
import Button from '../../../../../components/ui/Button';
import { PlusIcon, ViewIcon, EditIcon, DeleteIcon } from '../../../../../components/ui/icons';
import type { Course, CreateCourseRequest, ModalState } from '../../types';

interface CourseManagementProps {
  classId: string;
  courses: Course[];
  loading?: boolean;
  onCreate: (data: CreateCourseRequest) => Promise<void>;
  onUpdate: (courseId: string, data: any) => Promise<void>;
  onDelete: (courseId: string) => Promise<void>;
}

const CourseManagement: React.FC<CourseManagementProps> = ({
  classId,
  courses,
  loading = false,
  onCreate,
  onUpdate,
  onDelete
}) => {
  // 模态框状态
  const [selectorModal, setSelectorModal] = useState({ isOpen: false });
  const [formModal, setFormModal] = useState<ModalState>({
    isOpen: false,
    mode: 'create'
  });
  const [deleteModal, setDeleteModal] = useState<ModalState>({
    isOpen: false,
    mode: 'delete'
  });
  const [scheduleModal, setScheduleModal] = useState<ModalState>({
    isOpen: false,
    mode: 'view'
  });

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 处理添加课程（打开课程选择器）
  const handleCreate = () => {
    setSelectorModal({ isOpen: true });
  };

  // 处理课程选择
  const handleCourseSelect = async (selectedCourses: any[]) => {
    try {
      setFormLoading(true);

      // 这里应该调用API将选中的课程添加到班级
      // 暂时使用模拟数据
      for (const globalCourse of selectedCourses) {
        const courseData: CreateCourseRequest = {
          name: globalCourse.name,
          description: globalCourse.description || '',
          classId: classId,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3个月后
          totalHours: globalCourse.duration,
          schedule: []
        };

        await onCreate(courseData);
      }

      setSelectorModal({ isOpen: false });
    } catch (error) {
      console.error('添加课程失败:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // 处理编辑课程
  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormModal({ isOpen: true, mode: 'edit' });
  };

  // 处理删除课程
  const handleDelete = (course: Course) => {
    setSelectedCourse(course);
    setDeleteModal({ isOpen: true, mode: 'delete' });
  };

  // 处理查看课程表
  const handleViewSchedule = (course: Course) => {
    setSelectedCourse(course);
    setScheduleModal({ isOpen: true, mode: 'view' });
  };

  // 处理表单提交
  const handleFormSubmit = async (data: CreateCourseRequest) => {
    setFormLoading(true);
    try {
      if (formModal.mode === 'create') {
        await onCreate(data);
      } else if (selectedCourse) {
        await onUpdate(selectedCourse.id, data);
      }
      setFormModal({ isOpen: false, mode: 'create' });
      setSelectedCourse(null);
    } catch (error) {
      console.error('操作失败:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // 处理删除确认
  const handleDeleteConfirm = async () => {
    if (!selectedCourse) return;
    
    setDeleteLoading(true);
    try {
      await onDelete(selectedCourse.id);
      setDeleteModal({ isOpen: false, mode: 'delete' });
      setSelectedCourse(null);
    } catch (error) {
      console.error('删除失败:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // 获取状态显示文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '进行中';
      case 'inactive': return '未开始';
      case 'completed': return '已完成';
      default: return status;
    }
  };

  // 获取状态样式
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'badge-success';
      case 'inactive': return 'badge-warning';
      case 'completed': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  };

  // 计算进度百分比
  const getProgressPercentage = (course: Course) => {
    if (course.totalHours === 0) return 0;
    return Math.round((course.completedHours / course.totalHours) * 100);
  };

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">课程管理</h3>
          <p className="text-sm text-gray-600 mt-1">
            共 {courses.length} 门课程
          </p>
        </div>
        <Button
          onClick={handleCreate}
          variant="primary"
          size="md"
          disabled={loading}
          icon={<PlusIcon />}
        >
          添加课程
        </Button>
      </div>

      {/* 课程列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner w-8 h-8 mr-3"></div>
          <span className="text-gray-600">加载中...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无课程</h3>
          <p className="text-gray-600 mb-4">该班级还没有开设课程，点击上方按钮添加课程</p>
          <Button
            onClick={handleCreate}
            variant="primary"
            size="md"
            icon={<PlusIcon />}
          >
            添加第一门课程
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="card group hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h4>
                  {course.description && (
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                  )}
                </div>
                <span className={`badge ${getStatusBadge(course.status)} ml-3`}>
                  {getStatusText(course.status)}
                </span>
              </div>

              {/* 课程信息 */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">开始时间:</span>
                  <div className="font-medium">{new Date(course.startDate).toLocaleDateString('zh-CN')}</div>
                </div>
                <div>
                  <span className="text-gray-600">结束时间:</span>
                  <div className="font-medium">{new Date(course.endDate).toLocaleDateString('zh-CN')}</div>
                </div>
                <div>
                  <span className="text-gray-600">总课时:</span>
                  <div className="font-medium">{course.totalHours} 小时</div>
                </div>
                <div>
                  <span className="text-gray-600">已完成:</span>
                  <div className="font-medium">{course.completedHours} 小时</div>
                </div>
              </div>

              {/* 进度条 */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">课程进度</span>
                  <span className="font-medium">{getProgressPercentage(course)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(course)}%` }}
                  />
                </div>
              </div>

              {/* 课程表信息 */}
              {course.schedule.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">课程安排:</div>
                  <div className="space-y-1">
                    {course.schedule.slice(0, 2).map((schedule, index) => (
                      <div key={index} className="text-sm bg-gray-50 rounded px-2 py-1">
                        {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][schedule.dayOfWeek]} {' '}
                        {schedule.startTime} - {schedule.endTime}
                        {schedule.room && ` @ ${schedule.room}`}
                      </div>
                    ))}
                    {course.schedule.length > 2 && (
                      <div className="text-xs text-gray-500">
                        还有 {course.schedule.length - 2} 个时间段...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex space-x-2 pt-4 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={() => handleViewSchedule(course)}
                  variant="ghost"
                  size="sm"
                  icon={<ViewIcon />}
                  title="查看课程表"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  课程表
                </Button>
                <Button
                  onClick={() => handleEdit(course)}
                  variant="ghost"
                  size="sm"
                  icon={<EditIcon />}
                  title="编辑课程"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  编辑
                </Button>
                <Button
                  onClick={() => handleDelete(course)}
                  variant="ghost"
                  size="sm"
                  icon={<DeleteIcon />}
                  title="删除课程"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 课程选择器模态框 */}
      <Modal
        isOpen={selectorModal.isOpen}
        onClose={() => setSelectorModal({ isOpen: false })}
        title="选择课程"
        size="xl"
      >
        <CourseSelector
          classId={classId}
          existingCourseIds={courses.map(c => c.id)}
          onSelect={handleCourseSelect}
          onCancel={() => setSelectorModal({ isOpen: false })}
          loading={formLoading}
        />
      </Modal>

      {/* 课程表单模态框 */}
      <Modal
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, mode: 'create' })}
        title={formModal.mode === 'create' ? '添加课程' : '编辑课程'}
        size="xl"
      >
        <CourseForm
          initialData={selectedCourse}
          classId={classId}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModal({ isOpen: false, mode: 'create' })}
          loading={formLoading}
          mode={formModal.mode}
        />
      </Modal>

      {/* 课程表查看模态框 */}
      <Modal
        isOpen={scheduleModal.isOpen}
        onClose={() => setScheduleModal({ isOpen: false, mode: 'view' })}
        title={`${selectedCourse?.name} - 课程表`}
        size="lg"
      >
        {selectedCourse && (
          <CourseScheduleView
            course={selectedCourse}
            onClose={() => setScheduleModal({ isOpen: false, mode: 'view' })}
          />
        )}
      </Modal>

      {/* 删除确认模态框 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, mode: 'delete' })}
        onConfirm={handleDeleteConfirm}
        title="删除课程"
        message={`确定要删除课程 "${selectedCourse?.name}" 吗？此操作不可撤销。`}
        confirmText="删除"
        confirmButtonClass="btn-danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default CourseManagement;
