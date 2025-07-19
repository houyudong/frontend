/**
 * 班级管理模块类型定义
 * 
 * 遵循项目架构规范，提供完整的类型安全支持
 */

// 基础类型
export type ClassStatus = 'active' | 'inactive' | 'archived';
export type StudentStatus = 'active' | 'inactive' | 'suspended' | 'graduated';
export type SortDirection = 'asc' | 'desc';

// 班级接口定义
export interface Class {
  id: string;
  name: string;
  description?: string;
  teacherId: string;
  teacherName: string;
  status: ClassStatus;
  studentCount: number;
  maxStudents?: number;
  createdAt: string;
  updatedAt: string;
  semester: string;
  academicYear: string;
  subject?: string;
  room?: string;
  schedule?: ClassSchedule[];
}

// 班级创建/更新请求
export interface CreateClassRequest {
  name: string;
  description?: string;
  maxStudents?: number;
  semester: string;
  academicYear: string;
}

export interface UpdateClassRequest extends Partial<CreateClassRequest> {
  status?: ClassStatus;
}

// 课程定义
export interface Course {
  id: string;
  name: string;
  description?: string;
  classId: string;
  teacherId: string;
  status: 'active' | 'inactive' | 'completed';
  startDate: string;
  endDate: string;
  totalHours: number;
  completedHours: number;
  schedule: CourseSchedule[];
  createdAt: string;
  updatedAt: string;
}

// 课程表定义
export interface CourseSchedule {
  id?: string;
  courseId: string;
  dayOfWeek: number; // 0-6, 0为周日
  startTime: string; // HH:mm格式
  endTime: string;   // HH:mm格式
  room?: string;
  weeks?: number[]; // 上课周次，如 [1,2,3,4,5]
}

// 课程创建/更新请求
export interface CreateCourseRequest {
  name: string;
  description?: string;
  classId: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  schedule: Omit<CourseSchedule, 'id' | 'courseId'>[];
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  status?: 'active' | 'inactive' | 'completed';
}

// 学生接口定义
export interface Student {
  id: string;
  username: string;
  email: string;
  fullName: string;
  studentId: string; // 学号
  status: StudentStatus;
  classId: string;
  className: string;
  enrollmentDate: string;
  lastLogin?: string;
  avatar?: string;
  phone?: string;
  
  // 学习统计
  coursesCompleted: number;
  experimentsCompleted: number;
  totalStudyTime: number; // 分钟
  averageScore: number;
  
  // 扩展信息
  grade?: string;
  major?: string;
  notes?: string;
}

// 学生创建/更新请求
export interface CreateStudentRequest {
  username: string;
  email: string;
  fullName: string;
  studentId: string;
  classId: string;
  phone?: string;
  grade?: string;
  major?: string;
  notes?: string;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {
  status?: StudentStatus;
}

// 批量操作
export interface BatchStudentOperation {
  studentIds: string[];
  operation: 'activate' | 'deactivate' | 'suspend' | 'graduate' | 'delete' | 'move';
  targetClassId?: string; // 用于移动操作
}

// 查询参数
export interface ClassQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ClassStatus;
  semester?: string;
  academicYear?: string;
  sortBy?: 'name' | 'createdAt' | 'studentCount';
  sortDirection?: SortDirection;
}

export interface StudentQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: StudentStatus;
  classId?: string;
  grade?: string;
  major?: string;
  sortBy?: 'fullName' | 'studentId' | 'enrollmentDate' | 'lastLogin' | 'averageScore';
  sortDirection?: SortDirection;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 统计信息
export interface ClassStatistics {
  totalClasses: number;
  activeClasses: number;
  totalStudents: number;
  activeStudents: number;
  averageClassSize: number;
  completionRate: number;
}

export interface StudentStatistics {
  totalStudents: number;
  activeStudents: number;
  suspendedStudents: number;
  graduatedStudents: number;
  averageScore: number;
  averageStudyTime: number;
}

// 表单状态
export interface ClassFormData extends CreateClassRequest {
  id?: string;
}

export interface StudentFormData extends CreateStudentRequest {
  id?: string;
}

// 模态框状态
export interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view' | 'delete';
  data?: any;
}

// 表格列配置
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex: keyof T;
  width?: string;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

// 操作按钮配置
export interface ActionButton {
  key: string;
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  onClick: (record: any) => void;
  disabled?: (record: any) => boolean;
  visible?: (record: any) => boolean;
}

// 筛选器配置
export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'input' | 'date' | 'dateRange';
  options?: { label: string; value: any }[];
  placeholder?: string;
}

// 导入/导出
export interface ImportResult {
  success: number;
  failed: number;
  errors: ImportError[];
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  data: any;
}

export interface ExportOptions {
  format: 'csv' | 'excel';
  fields: string[];
  filters?: any;
}

// 通知类型
export interface NotificationConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Hook返回类型
export interface UseClassManagementReturn {
  classes: Class[];
  loading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  
  // 操作方法
  fetchClasses: (params?: ClassQueryParams) => Promise<void>;
  createClass: (data: CreateClassRequest) => Promise<Class>;
  updateClass: (id: string, data: UpdateClassRequest) => Promise<Class>;
  deleteClass: (id: string) => Promise<void>;
  
  // 状态管理
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setFilters: (filters: Partial<ClassQueryParams>) => void;
}

export interface UseStudentManagementReturn {
  students: Student[];
  loading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  
  // 操作方法
  fetchStudents: (params?: StudentQueryParams) => Promise<void>;
  createStudent: (data: CreateStudentRequest) => Promise<Student>;
  updateStudent: (id: string, data: UpdateStudentRequest) => Promise<Student>;
  deleteStudent: (id: string) => Promise<void>;
  batchOperation: (operation: BatchStudentOperation) => Promise<void>;
  
  // 状态管理
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setFilters: (filters: Partial<StudentQueryParams>) => void;
}

// 组件Props类型
export interface ClassTableProps {
  classes: Class[];
  loading?: boolean;
  onEdit: (classItem: Class) => void;
  onDelete: (classItem: Class) => void;
  onView: (classItem: Class) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

export interface StudentTableProps {
  students: Student[];
  loading?: boolean;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onView: (student: Student) => void;
  onBatchOperation: (operation: BatchStudentOperation) => void;
  selectedStudents: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

export interface ClassFormProps {
  initialData?: ClassFormData;
  onSubmit: (data: ClassFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

export interface StudentFormProps {
  initialData?: StudentFormData;
  onSubmit: (data: StudentFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  mode: 'create' | 'edit';
  availableClasses: Class[];
}
