/**
 * 课程表查看组件
 * 
 * 以表格形式展示课程的详细时间安排
 */

import React from 'react';
import type { Course } from '../../types';

interface CourseScheduleViewProps {
  course: Course;
  onClose: () => void;
}

const CourseScheduleView: React.FC<CourseScheduleViewProps> = ({
  course,
  onClose
}) => {
  // 星期映射
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  
  // 时间段
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ];

  // 构建课程表网格
  const buildScheduleGrid = () => {
    const grid: { [key: string]: any } = {};
    
    course.schedule.forEach(schedule => {
      const dayKey = schedule.dayOfWeek;
      const startHour = parseInt(schedule.startTime.split(':')[0]);
      const endHour = parseInt(schedule.endTime.split(':')[0]);
      
      for (let hour = startHour; hour < endHour; hour++) {
        const key = `${dayKey}-${hour}`;
        grid[key] = {
          ...schedule,
          isStart: hour === startHour,
          isEnd: hour === endHour - 1,
          span: endHour - startHour
        };
      }
    });
    
    return grid;
  };

  const scheduleGrid = buildScheduleGrid();

  // 获取课程表单元格内容
  const getCellContent = (dayOfWeek: number, hour: number) => {
    const key = `${dayOfWeek}-${hour}`;
    return scheduleGrid[key];
  };

  // 计算进度百分比
  const getProgressPercentage = () => {
    if (course.totalHours === 0) return 0;
    return Math.round((course.completedHours / course.totalHours) * 100);
  };

  return (
    <div className="space-y-6">
      {/* 课程基本信息 */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">课程时间</div>
            <div className="font-medium">
              {new Date(course.startDate).toLocaleDateString('zh-CN')} - {' '}
              {new Date(course.endDate).toLocaleDateString('zh-CN')}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">总课时</div>
            <div className="font-medium">{course.totalHours} 小时</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">完成进度</div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <span className="text-sm font-medium">{getProgressPercentage()}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 课程表 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">课程时间表</h4>
        </div>
        
        {course.schedule.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0v-1a4 4 0 014-4h4a4 4 0 014 4v1a4 4 0 11-8 0z" />
            </svg>
            <p className="text-gray-500">暂无课程安排</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    时间
                  </th>
                  {weekDays.slice(1).concat(weekDays.slice(0, 1)).map((day, index) => (
                    <th key={index} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((time, timeIndex) => {
                  const hour = parseInt(time.split(':')[0]);
                  return (
                    <tr key={timeIndex}>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {time}
                      </td>
                      {[1, 2, 3, 4, 5, 6, 0].map((dayOfWeek, dayIndex) => {
                        const cellContent = getCellContent(dayOfWeek, hour);
                        
                        if (cellContent) {
                          if (cellContent.isStart) {
                            return (
                              <td
                                key={dayIndex}
                                rowSpan={cellContent.span}
                                className="px-2 py-1 text-center bg-blue-50 border border-blue-200"
                              >
                                <div className="text-xs font-medium text-blue-800">
                                  {course.name}
                                </div>
                                <div className="text-xs text-blue-600">
                                  {cellContent.startTime} - {cellContent.endTime}
                                </div>
                                {cellContent.room && (
                                  <div className="text-xs text-blue-500">
                                    {cellContent.room}
                                  </div>
                                )}
                              </td>
                            );
                          } else {
                            // 被rowSpan覆盖的单元格不渲染
                            return null;
                          }
                        }
                        
                        return (
                          <td key={dayIndex} className="px-2 py-3 text-center">
                            <div className="h-8"></div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 课程安排列表 */}
      {course.schedule.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">详细安排</h4>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {course.schedule.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {weekDays[schedule.dayOfWeek]}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                      {schedule.room && (
                        <div className="text-sm text-gray-600">
                          教室: {schedule.room}
                        </div>
                      )}
                      {schedule.weeks && schedule.weeks.length > 0 && (
                        <div className="text-sm text-gray-600">
                          周次: {schedule.weeks.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round((parseInt(schedule.endTime.split(':')[0]) - parseInt(schedule.startTime.split(':')[0])) * 60 / 60)} 小时
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="btn btn-secondary"
        >
          关闭
        </button>
      </div>
    </div>
  );
};

export default CourseScheduleView;
