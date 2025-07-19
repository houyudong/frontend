/**
 * 实验系统类型定义
 * 
 * 定义实验模块所需的所有接口
 * 支持知识点融合、SVG流程图动画和真实实验数据
 */

// 知识点分类
export type KnowledgeCategory = 
  | 'gpio' 
  | 'timer' 
  | 'uart' 
  | 'adc' 
  | 'dac' 
  | 'interrupt' 
  | 'sensor' 
  | 'lcd' 
  | 'architecture';

// 知识点等级
export type KnowledgeLevel = 'basic' | 'intermediate' | 'advanced';

// 知识点接口
export interface KnowledgePoint {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  level: KnowledgeLevel;
  relatedConcepts?: string[];
  examples?: string[];
  references?: string[];
}

// SVG流程图步骤
export interface FlowStep {
  id: string;
  title: string;
  description: string;
  svgElement: string;                  // SVG图形定义
  animationDelay: number;              // 动画延迟（毫秒）
  duration: number;                    // 动画持续时间（毫秒）
  interactionType: 'click' | 'hover' | 'auto';
  position: {
    x: number;
    y: number;
  };
}

// 实验原理
export interface ExperimentPrinciple {
  theory: string;                      // 理论原理
  hardwareDiagram?: string;            // 硬件原理图URL
  softwareArchitecture: string;        // 软件架构说明
  workingMechanism: string;            // 工作机制
}

// 实验步骤
export interface ExperimentStep {
  id: string;
  title: string;
  content: string;
  code?: string;
  expectedResult?: string;
  tips?: string[];
  completed: boolean;
  order: number;
}

// 实验资源
export interface ExperimentResource {
  title: string;
  url: string;
  type: 'documentation' | 'video' | 'example' | 'download' | 'reference';
  description?: string;
}

// 增强的实验详情接口
export interface EnhancedExperimentDetail {
  // 基础信息
  id: string;
  name: string;
  description: string;
  
  // 实验目的和原理
  purpose: string[];                    // 实验目的
  principle: ExperimentPrinciple;       // 实验原理
  
  // 知识点融合
  knowledgePoints: {
    prerequisites: KnowledgePoint[];    // 前置知识点
    core: KnowledgePoint[];            // 核心知识点
    extended?: KnowledgePoint[];        // 扩展知识点
  };
  
  // 实验流程
  flowchart?: FlowStep[];              // SVG动画流程图
  instructions?: ExperimentStep[];      // 详细步骤
  steps?: string[];                    // 简化版步骤
  
  // 实验配置（对应backend数据）
  directory: string;                   // 对应backend实验目录
  estimatedTime: number;               // 预计时间（分钟）
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  chipFamily?: string;                  // 芯片系列
  chipModel: string;                   // 芯片型号
  userFiles?: string[];                 // 用户可编辑文件
  
  // 实验状态
  status?: 'not_started' | 'in_progress' | 'completed';
  progress?: number;                    // 进度百分比
  
  // 资源和关联
  resources?: ExperimentResource[];     // 参考资料
  relatedExperiments?: string[];        // 相关实验ID
  tags?: string[];                      // 标签
  
  // 元数据
  createdAt?: string;
  updatedAt?: string;
  
  // 理论知识
  theory?: string;                      // 简化版理论
}

// 实验列表项（简化版）
export interface ExperimentListItem {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  status?: 'not_started' | 'in_progress' | 'completed';
  progress?: number;
  tags?: string[];
  category?: string;
  isNew?: boolean;
  isPopular?: boolean;
  chipModel?: string;
}

// SVG动画配置
export interface FlowchartConfig {
  width: number;
  height: number;
  autoPlay: boolean;
  showControls: boolean;
  stepDelay: number;
  theme: 'light' | 'dark';
}

// 实验启动配置
export interface ExperimentStartConfig {
  experimentId: string;
  userId: string;
  workspacePath?: string;
  autoLoadFiles?: boolean;
  enableAIAssistant?: boolean;
}

// API响应类型
export interface ExperimentDetailResponse {
  success: boolean;
  data?: EnhancedExperimentDetail;
  error?: string;
}

export interface ExperimentListResponse {
  success: boolean;
  data?: ExperimentListItem[];
  total?: number;
  error?: string;
}

// 实验搜索和筛选
export interface ExperimentFilter {
  search?: string;
  category?: string | 'all';
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  status?: 'not_started' | 'in_progress' | 'completed' | 'all';
  tags?: string[];
}

// 学习进度统计
export interface LearningStats {
  totalExperiments: number;
  completedExperiments: number;
  inProgressExperiments: number;
  totalStudyTime: number;              // 分钟
  averageScore: number;
  knowledgePointsCovered: number;
  currentStreak: number;               // 连续学习天数
}

// 项目文件类型
export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  isDirectory: boolean;
  children?: ProjectFile[];
  language?: string;
  readOnly?: boolean;
}

// 项目结构类型
export interface ProjectStructure {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  rootDirectory: string;
}

// 项目类型
export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  experimentId?: string;
  chipModel: string;
  language: string;
  platform: string;
  directoryName?: string;
  projectPath?: string;
  createdAt: string;
  updatedAt: string;
}
