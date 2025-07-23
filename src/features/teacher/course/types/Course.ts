/**
 * 课程相关类型定义
 */

// 课程基础信息
export interface Course {
  id: string;
  name: string;
  code: string;                    // 课程代码
  description: string;
  department: string;              // 所属院系
  category: string;                // 课程类别
  credits: number;                 // 学分
  hours: number;                   // 学时
  teacherId: string;               // 主讲教师ID
  teacherName: string;             // 主讲教师姓名
  assistants: string[];            // 助教ID列表
  status: 'draft' | 'published' | 'archived';  // 课程状态
  semester: string;                // 学期
  academicYear: string;            // 学年
  maxStudents: number;             // 最大学生数
  currentStudents: number;         // 当前学生数
  prerequisites: string[];         // 先修课程
  objectives: string[];            // 课程目标
  outline: string;                 // 课程大纲
  materials: CourseMaterial[];     // 课程资料
  assessments: Assessment[];       // 考核方式
  tags: string[];                  // 标签
  coverImage?: string;             // 封面图片
  createdAt: string;
  updatedAt: string;
}

// 课程资料
export interface CourseMaterial {
  id: string;
  name: string;
  type: 'document' | 'video' | 'audio' | 'image' | 'link';
  url: string;
  size?: number;
  description?: string;
  uploadedAt: string;
}

// 考核方式
export interface Assessment {
  id: string;
  name: string;
  type: 'exam' | 'assignment' | 'project' | 'quiz' | 'participation';
  weight: number;                  // 权重百分比
  description: string;
  dueDate?: string;
}

// 课程表
export interface CourseSchedule {
  id: string;
  courseId: string;
  courseName: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  dayOfWeek: number;               // 星期几 (1-7)
  startTime: string;               // 开始时间 HH:mm
  endTime: string;                 // 结束时间 HH:mm
  classroom: string;               // 教室
  weeks: number[];                 // 上课周次
  semester: string;
  academicYear: string;
  status: 'active' | 'cancelled' | 'completed';
  notes?: string;
}

// 班级课程关联
export interface ClassCourse {
  id: string;
  classId: string;
  className: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  semester: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  schedules: CourseSchedule[];
  enrolledStudents: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

// 课程创建/编辑表单数据
export interface CourseFormData {
  name: string;
  code: string;
  description: string;
  department: string;
  category: string;
  credits: number;
  hours: number;
  maxStudents: number;
  prerequisites: string[];
  objectives: string[];
  outline: string;
  semester: string;
  academicYear: string;
  tags: string[];
  coverImage?: string;
}

// 课程搜索筛选条件
export interface CourseFilter {
  keyword?: string;
  department?: string;
  category?: string;
  semester?: string;
  status?: string;
  teacherId?: string;
}

// 课程统计信息
export interface CourseStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  averageRating: number;
  completionRate: number;
}

// 时间段定义
export interface TimeSlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  order: number;
}

// 教室信息
export interface Classroom {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  equipment: string[];
  type: 'lecture' | 'lab' | 'seminar' | 'computer';
  status: 'available' | 'occupied' | 'maintenance';
}

// 课程表视图数据
export interface ScheduleView {
  timeSlots: TimeSlot[];
  weekDays: string[];
  schedules: CourseSchedule[][];    // [day][timeSlot]
}

// 班级信息（简化版）
export interface ClassInfo {
  id: string;
  name: string;
  department: string;
  grade: string;
  studentCount: number;
  major: string;
}

// 班级课程关联
export interface ClassCourse {
  id: string;
  classId: string;
  className: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  semester: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  schedules: CourseSchedule[];
  enrolledStudents: number;
  status: 'active' | 'completed' | 'suspended';
  createdAt: string;
}

// 课程导入数据
export interface CourseImportData {
  name: string;
  code: string;
  department: string;
  credits: number;
  hours: number;
  teacherName: string;
  semester: string;
  academicYear: string;
}

// 课程导出数据
export interface CourseExportData extends Course {
  enrolledClasses: string[];
  totalSchedules: number;
  lastActivity: string;
}
