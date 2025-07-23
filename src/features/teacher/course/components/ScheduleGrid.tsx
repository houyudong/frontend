/**
 * 课程表网格组件
 * 
 * 显示课程时间表的网格视图
 */

import React from 'react';
import { CourseSchedule, TimeSlot } from '../types/Course';

interface ScheduleGridProps {
  schedules: CourseSchedule[];
  timeSlots: TimeSlot[];
  onEditSchedule: (scheduleId: string, scheduleData: any) => void;
  onDeleteSchedule: (scheduleId: string) => void;
  viewMode: 'week' | 'semester';
  selectedWeek: number;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  schedules,
  timeSlots,
  onEditSchedule,
  onDeleteSchedule,
  viewMode,
  selectedWeek
}) => {
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  // 创建时间表网格数据
  const createScheduleGrid = () => {
    const grid: (CourseSchedule | null)[][] = [];
    
    // 初始化网格
    for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
      grid[timeIndex] = new Array(7).fill(null);
    }

    // 填充课程数据
    schedules.forEach(schedule => {
      const timeSlotIndex = timeSlots.findIndex(slot => 
        slot.startTime === schedule.startTime
      );
      const dayIndex = schedule.dayOfWeek - 1; // 转换为0-6的索引

      if (timeSlotIndex !== -1 && dayIndex >= 0 && dayIndex < 7) {
        grid[timeSlotIndex][dayIndex] = schedule;
      }
    });

    return grid;
  };

  const scheduleGrid = createScheduleGrid();

  // 获取课程类型颜色
  const getCourseTypeColor = (schedule: CourseSchedule) => {
    if (schedule.notes?.includes('实验')) {
      return 'bg-green-100 border-green-300 text-green-800';
    } else if (schedule.notes?.includes('上机')) {
      return 'bg-purple-100 border-purple-300 text-purple-800';
    } else {
      return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  // 获取课程状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        {/* 表头 */}
        <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
          <div className="p-4 text-center font-medium text-gray-700 border-r border-gray-200">
            时间
          </div>
          {weekDays.map((day, index) => (
            <div key={index} className="p-4 text-center font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* 时间表网格 */}
        <div className="divide-y divide-gray-200">
          {timeSlots.map((timeSlot, timeIndex) => (
            <div key={timeSlot.id} className="grid grid-cols-8 min-h-[80px]">
              {/* 时间列 */}
              <div className="p-4 bg-gray-50 border-r border-gray-200 flex flex-col justify-center items-center">
                <div className="text-sm font-medium text-gray-900">{timeSlot.name}</div>
                <div className="text-xs text-gray-500">
                  {timeSlot.startTime}-{timeSlot.endTime}
                </div>
              </div>

              {/* 课程列 */}
              {weekDays.map((_, dayIndex) => {
                const schedule = scheduleGrid[timeIndex][dayIndex];
                
                return (
                  <div key={dayIndex} className="p-2 border-r border-gray-200 last:border-r-0 relative group">
                    {schedule ? (
                      <div className={`h-full rounded-lg border-2 p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${getCourseTypeColor(schedule)}`}>
                        {/* 状态指示器 */}
                        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${getStatusColor(schedule.status)}`}></div>
                        
                        {/* 课程信息 */}
                        <div className="space-y-1">
                          <div className="text-sm font-medium line-clamp-2">
                            {schedule.courseName}
                          </div>
                          <div className="text-xs text-gray-600">
                            {schedule.className}
                          </div>
                          <div className="text-xs text-gray-600">
                            {schedule.classroom}
                          </div>
                          {schedule.notes && (
                            <div className="text-xs text-gray-500">
                              {schedule.notes}
                            </div>
                          )}
                        </div>

                        {/* 悬停操作按钮 */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // 这里应该打开编辑模态框
                              console.log('编辑课程:', schedule.id);
                            }}
                            className="p-1 bg-white rounded text-blue-600 hover:bg-blue-50"
                            title="编辑"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSchedule(schedule.id);
                            }}
                            className="p-1 bg-white rounded text-red-600 hover:bg-red-50"
                            title="删除"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 图例 */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
                <span className="text-sm text-gray-600">理论课</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                <span className="text-sm text-gray-600">实验课</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded"></div>
                <span className="text-sm text-gray-600">上机课</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">进行中</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">已取消</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-600">已完成</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGrid;
