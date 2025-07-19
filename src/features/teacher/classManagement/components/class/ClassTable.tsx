/**
 * 班级表格组件
 * 
 * 展示班级列表，支持排序、筛选、操作等功能
 */

import React from 'react';
import DataTable from '../common/DataTable';
import type { Class, ClassTableProps, TableColumn, ActionButton } from '../../types';
import { 
  formatDateTime, 
  getClassStatusText, 
  getClassStatusColor,
  getNameInitials,
  getAvatarColor
} from '../../utils';

const ClassTable: React.FC<ClassTableProps> = ({
  classes,
  loading = false,
  onEdit,
  onDelete,
  onView,
  pagination
}) => {
  // 定义表格列
  const columns: TableColumn<Class>[] = [
    {
      key: 'name',
      title: '班级名称',
      dataIndex: 'name',
      sortable: true,
      render: (value: string, record: Class) => (
        <div className="flex items-center space-x-3">
          {/* 班级头像 */}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium ${getAvatarColor(record.name)}`}>
            {getNameInitials(record.name)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            {record.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {record.description}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'teacher',
      title: '任课教师',
      dataIndex: 'teacherName',
      render: (value: string) => (
        <span className="text-gray-900">{value || '-'}</span>
      )
    },
    {
      key: 'studentCount',
      title: '学生人数',
      dataIndex: 'studentCount',
      sortable: true,
      align: 'center',
      render: (value: number, record: Class) => (
        <div className="text-center">
          <span className="text-lg font-semibold text-gray-900">{value}</span>
          {record.maxStudents && (
            <div className="text-xs text-gray-500">
              / {record.maxStudents}
            </div>
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
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getClassStatusColor(value)}`}>
          {getClassStatusText(value)}
        </span>
      )
    },
    {
      key: 'semester',
      title: '学期信息',
      dataIndex: 'semester',
      render: (value: string, record: Class) => (
        <div className="text-sm">
          <div className="text-gray-900">{record.academicYear}</div>
          <div className="text-gray-500">{value}</div>
        </div>
      )
    },
    {
      key: 'subject',
      title: '课程/教室',
      dataIndex: 'subject',
      render: (value: string, record: Class) => (
        <div className="text-sm">
          {value && <div className="text-gray-900">{value}</div>}
          {record.room && <div className="text-gray-500">{record.room}</div>}
        </div>
      )
    },
    {
      key: 'createdAt',
      title: '创建时间',
      dataIndex: 'createdAt',
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
      key: 'edit',
      label: '编辑',
      icon: '✏️',
      variant: 'primary',
      onClick: onEdit
    },
    {
      key: 'delete',
      label: '删除',
      icon: '🗑️',
      variant: 'danger',
      onClick: onDelete,
      disabled: (record: Class) => record.studentCount > 0, // 有学生的班级不能删除
      visible: (record: Class) => record.status !== 'archived' // 已归档的班级不显示删除按钮
    }
  ];

  return (
    <DataTable<Class>
      data={classes}
      columns={columns}
      loading={loading}
      rowKey="id"
      actions={actions}
      pagination={pagination}
      emptyText="暂无班级数据"
      onRowClick={(record) => onView(record)}
      className="shadow-sm"
    />
  );
};

export default ClassTable;
