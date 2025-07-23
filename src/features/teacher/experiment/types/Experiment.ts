/**
 * 实验管理相关类型定义
 */

// 实验材料
export interface ExperimentMaterial {
  id: string;
  name: string;
  type: 'document' | 'video' | 'code' | 'image' | 'other';
  url: string;
  size: number;
  description: string;
  uploadedAt: string;
}

// 实验步骤
export interface ExperimentStep {
  id: string;
  order: number;
  title: string;
  description: string;
  code?: string;
  expectedOutput?: string;
  tips?: string[];
  duration: number; // 预计完成时间（分钟）
}

// 实验评分标准
export interface ExperimentCriteria {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number; // 权重百分比
}

// 实验设备要求
export interface ExperimentEquipment {
  id: string;
  name: string;
  type: 'hardware' | 'software' | 'tool';
  required: boolean;
  description: string;
  specifications?: string;
}

// 实验基础信息
export interface Experiment {
  id: string;
  name: string;
  code: string;
  description: string;
  courseId: string;
  courseName: string;
  category: '基础实验' | '综合实验' | '设计实验' | '创新实验';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'individual' | 'group';
  duration: number; // 实验时长（分钟）
  maxScore: number;
  
  // 教学信息
  objectives: string[];
  prerequisites: string[];
  steps: ExperimentStep[];
  materials: ExperimentMaterial[];
  equipment: ExperimentEquipment[];
  criteria: ExperimentCriteria[];
  
  // 管理信息
  teacherId: string;
  teacherName: string;
  assistants: string[];
  status: 'draft' | 'published' | 'archived';
  semester: string;
  academicYear: string;
  
  // 统计信息
  totalSubmissions: number;
  completedSubmissions: number;
  averageScore: number;
  averageTime: number; // 平均完成时间
  
  // 标签和分类
  tags: string[];
  coverImage?: string;
  
  // 时间信息
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// 实验安排
export interface ExperimentSchedule {
  id: string;
  experimentId: string;
  experimentName: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  
  // 时间安排
  startDate: string;
  endDate: string;
  dueDate: string;
  
  // 地点安排
  laboratory: string;
  building: string;
  capacity: number;
  
  // 分组信息
  groupSize?: number;
  totalGroups?: number;
  
  // 状态信息
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  enrolledStudents: number;
  submittedCount: number;
  
  // 其他信息
  notes?: string;
  createdAt: string;
}

// 学生实验提交
export interface ExperimentSubmission {
  id: string;
  experimentId: string;
  experimentName: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  
  // 提交内容
  files: ExperimentMaterial[];
  report?: string;
  code?: string;
  screenshots?: string[];
  
  // 评分信息
  score?: number;
  maxScore: number;
  criteriaScores: { [criteriaId: string]: number };
  feedback?: string;
  
  // 时间信息
  submittedAt: string;
  gradedAt?: string;
  
  // 状态信息
  status: 'submitted' | 'graded' | 'returned' | 'late';
  isLate: boolean;
  
  // 统计信息
  timeSpent: number; // 实际花费时间（分钟）
  attempts: number;
}

// 实验室信息
export interface Laboratory {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  equipment: string[];
  type: 'hardware' | 'software' | 'mixed';
  status: 'available' | 'occupied' | 'maintenance';
  description?: string;
}

// 实验筛选条件
export interface ExperimentFilter {
  search: string;
  status: string;
  category: string;
  difficulty: string;
  courseId: string;
  semester: string;
}

// 实验统计信息
export interface ExperimentStats {
  totalExperiments: number;
  publishedExperiments: number;
  draftExperiments: number;
  archivedExperiments: number;
  totalSubmissions: number;
  averageScore: number;
  completionRate: number;
  onTimeRate: number;
}

// 实验表单数据
export interface ExperimentFormData {
  name: string;
  code: string;
  description: string;
  courseId: string;
  category: '基础实验' | '综合实验' | '设计实验' | '创新实验';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'individual' | 'group';
  duration: number;
  maxScore: number;
  objectives: string[];
  prerequisites: string[];
  steps: Omit<ExperimentStep, 'id'>[];
  equipment: Omit<ExperimentEquipment, 'id'>[];
  criteria: Omit<ExperimentCriteria, 'id'>[];
  tags: string[];
  coverImage?: string;
}

// 班级实验关联
export interface ClassExperiment {
  id: string;
  classId: string;
  className: string;
  experimentId: string;
  experimentName: string;
  teacherId: string;
  teacherName: string;
  semester: string;
  academicYear: string;
  
  // 时间安排
  startDate: string;
  endDate: string;
  dueDate: string;
  
  // 实验室安排
  laboratory: string;
  schedules: ExperimentSchedule[];
  
  // 统计信息
  enrolledStudents: number;
  submittedCount: number;
  gradedCount: number;
  averageScore: number;
  
  // 状态信息
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

// 实验报告模板
export interface ExperimentReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: {
    id: string;
    title: string;
    description: string;
    required: boolean;
    order: number;
  }[];
  createdAt: string;
  updatedAt: string;
}
