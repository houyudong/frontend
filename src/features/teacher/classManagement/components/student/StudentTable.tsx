/**
 * 学生表格组件
 * 
 * 展示学生列表，支持排序、筛选、批量操作等功能
 */

import React from 'react';
import DataTable from '../common/DataTable';
import type { Student, StudentTableProps, TableColumn, ActionButton } from '../../types';
import {
  formatDateTime,
  formatTime,
  getStudentStatusText,
  getStudentStatusColor,
  getNameInitials,
  getAvatarColor
} from '../../utils';

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onBatchOperation,
  selectedStudents,
  onSelectionChange,
  pagination
}) => {
  // 定义表格列
  const columns: TableColumn<Student>[] = [
    {
      key: 'student',
      title: '学生信息',
      dataIndex: 'fullName',
      sortable: true,
      render: (value: string, record: Student) => (
        <div className="flex items-center space-x-3">
          {/* 学生头像 */}
          {record.avatar ? (
            <img
              src={record.avatar}
              alt={record.fullName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(record.fullName)}`}>
              {getNameInitials(record.fullName)}
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">
              学号: {record.studentId}
            </div>
            <div className="text-sm text-gray-500">
              用户名: {record.username}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      title: '联系方式',
      dataIndex: 'email',
      render: (value: string, record: Student) => (
        <div className="text-sm">
          <div className="text-gray-900">{value}</div>
          {record.phone && (
            <div className="text-gray-500">{record.phone}</div>
          )}
        </div>
      )
    },
    {
      key: 'class',
      title: '班级信息',
      dataIndex: 'className',
      render: (value: string, record: Student) => (
        <div className="text-sm">
          <div className="text-gray-900">{value}</div>
          {record.grade && (
            <div className="text-gray-500">年级: {record.grade}</div>
          )}
          {record.major && (
            <div className="text-gray-500">专业: {record.major}</div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStudentStatusColor(value)}`}>
          {getStudentStatusText(value)}
        </span>
      )
    },
    {
      key: 'progress',
      title: '学习进度',
      dataIndex: 'coursesCompleted',
      align: 'center',
      render: (value: number, record: Student) => (
        <div className="text-center text-sm">
          <div className="text-gray-900">
            课程: {value}
          </div>
          <div className="text-gray-500">
            实验: {record.experimentsCompleted}
          </div>
          <div className="text-gray-500">
            平均分: {record.averageScore.toFixed(1)}
          </div>
        </div>
      )
    },
    {
      key: 'studyTime',
      title: '学习时长',
      dataIndex: 'totalStudyTime',
      sortable: true,
      align: 'center',
      render: (value: number) => (
        <span className="text-sm text-gray-900">
          {formatTime(value)}
        </span>
      )
    },
    {
      key: 'lastLogin',
      title: '最后登录',
      dataIndex: 'lastLogin',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {value ? formatDateTime(value) : '从未登录'}
        </span>
      )
    },
    {
      key: 'enrollmentDate',
      title: '入学时间',
      dataIndex: 'enrollmentDate',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {formatDateTime(value)}
        </span>
      )
    }
  ];

  // 定义操作按钮
  const actions: ActionButton[] = [
    {
      key: 'view',
      label: '查看',
      icon: '👁️',
      variant: 'secondary',
      onClick: onView
    },
    {
      key: 'edit',
      label: '编辑',
      icon: '✏️',
      variant: 'primary',
      onClick: onEdit
    },
    {
      key: 'delete',
      label: '移除',
      icon: '🗑️',
      variant: 'danger',
      onClick: onDelete,
      visible: (record: Student) => record.status !== 'graduated' // 已毕业学生不显示移除按钮
    }
  ];

  // 处理选择变化
  const handleSelectionChange = (selectedRows: Student[], selectedRowKeys: string[]) => {
    onSelectionChange(selectedRowKeys);
  };

  // 获取选中的学生对象
  const selectedStudentObjects = students.filter(student => 
    selectedStudents.includes(student.id)
  );

  return (
    <div>
      {/* 批量操作工具栏 */}
      {selectedStudents.length > 0 && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-800">
                已选择 {selectedStudents.length} 个学生
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onBatchOperation({
                  studentIds: selectedStudents,
                  operation: 'activate'
                })}
                className="btn-primary text-xs"
              >
                激活
              </button>
              <button
                onClick={() => onBatchOperation({
                  studentIds: selectedStudents,
                  operation: 'deactivate'
                })}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs transition-colors"
              >
                停用
              </button>
              <button
                onClick={() => onBatchOperation({
                  studentIds: selectedStudents,
                  operation: 'suspend'
                })}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
              >
                暂停
              </button>
              <button
                onClick={() => onBatchOperation({
                  studentIds: selectedStudents,
                  operation: 'graduate'
                })}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
              >
                毕业
              </button>
              <button
                onClick={() => onBatchOperation({
                  studentIds: selectedStudents,
                  operation: 'delete'
                })}
                className="btn-danger text-xs"
              >
                批量删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 学生表格 */}
      <DataTable<Student>
        data={students}
        columns={columns}
        loading={loading}
        rowKey="id"
        selectable={true}
        selectedRows={selectedStudentObjects}
        onSelectionChange={handleSelectionChange}
        actions={actions}
        pagination={pagination}
        emptyText="暂无学生数据"
        onRowClick={(record) => onView(record)}
        className="shadow-sm"
      />
    </div>
  );
};

export default StudentTable;
