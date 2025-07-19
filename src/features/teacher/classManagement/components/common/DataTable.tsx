/**
 * 通用数据表格组件
 * 
 * 提供统一的表格展示功能，支持排序、分页、选择等功能
 */

import React, { useState } from 'react';
import type { TableColumn, ActionButton } from '../../types';
import { sortArray, calculatePagination } from '../../utils';
import Button from '../../../../../components/ui/Button';
import { ViewIcon, EditIcon, DeleteIcon, ArrowLeftIcon, ArrowRightIcon } from '../../../../../components/ui/icons';

interface DataTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  rowKey: keyof T;
  
  // 选择功能
  selectable?: boolean;
  selectedRows?: any[];
  onSelectionChange?: (selectedRows: any[], selectedRowKeys: any[]) => void;
  
  // 分页功能
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
    onChange: (page: number, pageSize: number) => void;
  };
  
  // 操作按钮
  actions?: ActionButton[];
  
  // 样式
  className?: string;
  size?: 'small' | 'middle' | 'large';
  
  // 空状态
  emptyText?: string;
  
  // 行点击事件
  onRowClick?: (record: T, index: number) => void;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  rowKey,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  pagination,
  actions = [],
  className = '',
  size = 'middle',
  emptyText = '暂无数据',
  onRowClick
}: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // 处理排序
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;
    
    const key = column.dataIndex;
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    
    if (checked) {
      const allKeys = data.map(item => item[rowKey]);
      onSelectionChange(data, allKeys);
    } else {
      onSelectionChange([], []);
    }
  };

  // 处理单行选择
  const handleRowSelect = (record: T, checked: boolean) => {
    if (!onSelectionChange) return;
    
    const key = record[rowKey];
    let newSelectedRows = [...selectedRows];
    let newSelectedKeys = selectedRows.map(item => item[rowKey]);
    
    if (checked) {
      if (!newSelectedKeys.includes(key)) {
        newSelectedRows.push(record);
        newSelectedKeys.push(key);
      }
    } else {
      newSelectedRows = newSelectedRows.filter(item => item[rowKey] !== key);
      newSelectedKeys = newSelectedKeys.filter(k => k !== key);
    }
    
    onSelectionChange(newSelectedRows, newSelectedKeys);
  };

  // 排序数据
  const sortedData = sortConfig.key 
    ? sortArray(data, sortConfig.key, sortConfig.direction)
    : data;

  // 获取表格尺寸样式
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'text-xs';
      case 'large': return 'text-base';
      default: return 'text-sm';
    }
  };

  // 获取单元格内边距
  const getCellPadding = () => {
    switch (size) {
      case 'small': return 'px-2 py-1';
      case 'large': return 'px-6 py-4';
      default: return 'px-4 py-3';
    }
  };

  // 检查是否全选
  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* 表格容器 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* 表头 */}
          <thead className="bg-gray-50">
            <tr>
              {/* 选择列 */}
              {selectable && (
                <th className={`${getCellPadding()} text-left`}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={input => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              
              {/* 数据列 */}
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`${getCellPadding()} text-left ${getSizeClass()} font-medium text-gray-900 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <svg
                          className={`w-3 h-3 ${
                            sortConfig.key === column.dataIndex && sortConfig.direction === 'asc'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              ))}
              
              {/* 操作列 */}
              {actions.length > 0 && (
                <th className={`${getCellPadding()} text-left ${getSizeClass()} font-medium text-gray-900 uppercase tracking-wider`}>
                  操作
                </th>
              )}
            </tr>
          </thead>
          
          {/* 表体 */}
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className={`${getCellPadding()} text-center text-gray-500`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>加载中...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className={`${getCellPadding()} text-center text-gray-500`}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => {
                const key = record[rowKey];
                const isSelected = selectedRows.some(item => item[rowKey] === key);
                
                return (
                  <tr
                    key={String(key)}
                    className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''} ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => onRowClick?.(record, index)}
                  >
                    {/* 选择列 */}
                    {selectable && (
                      <td className={getCellPadding()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleRowSelect(record, e.target.checked);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    
                    {/* 数据列 */}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`${getCellPadding()} ${getSizeClass()} text-gray-900`}
                        style={{ textAlign: column.align || 'left' }}
                      >
                        {column.render
                          ? column.render(record[column.dataIndex], record, index)
                          : String(record[column.dataIndex] || '-')
                        }
                      </td>
                    ))}
                    
                    {/* 操作列 */}
                    {actions.length > 0 && (
                      <td className={getCellPadding()}>
                        <div className="flex items-center space-x-1">
                          {actions
                            .filter(action => !action.visible || action.visible(record))
                            .map((action) => {
                              // 根据action.key选择对应的图标
                              const getActionIcon = () => {
                                switch (action.key) {
                                  case 'view':
                                    return <ViewIcon />;
                                  case 'edit':
                                    return <EditIcon />;
                                  case 'delete':
                                    return <DeleteIcon />;
                                  default:
                                    return null;
                                }
                              };

                              return (
                                <Button
                                  key={action.key}
                                  variant={action.variant === 'danger' ? 'danger' :
                                          action.variant === 'success' ? 'success' :
                                          action.variant === 'primary' ? 'primary' : 'secondary'}
                                  size="xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(record);
                                  }}
                                  disabled={action.disabled?.(record)}
                                  icon={getActionIcon()}
                                  title={action.label}
                                >
                                  {action.label}
                                </Button>
                              );
                            })}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* 分页 */}
      {pagination && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              {calculatePagination(pagination.total, pagination.current, pagination.pageSize).showingText}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* 页面大小选择器 */}
              {pagination.showSizeChanger && (
                <select
                  value={pagination.pageSize}
                  onChange={(e) => pagination.onChange(1, Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded px-2 py-1 pr-8 appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  {(pagination.pageSizeOptions || [10, 20, 50, 100]).map(size => (
                    <option key={size} value={size}>
                      {size} 条/页
                    </option>
                  ))}
                </select>
              )}
              
              {/* 分页按钮 */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
                  disabled={pagination.current <= 1}
                  icon={<ArrowLeftIcon />}
                >
                  上一页
                </Button>

                <span className="px-3 py-1 text-sm text-gray-600">
                  第 {pagination.current} 页，共 {Math.ceil(pagination.total / pagination.pageSize)} 页
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
                  disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                  icon={<ArrowRightIcon />}
                  iconPosition="right"
                >
                  下一页
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
