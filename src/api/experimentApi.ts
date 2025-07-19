import { apiClient } from './apiClient';

// 实验模板类型（对应数据库experiment_templates表）
export interface ExperimentTemplate {
  id: string;
  name: string;
  project_name: string;
  category: string;
  difficulty: number;
  duration: number;
  description: string;
  learning_objectives?: string[];
  theory?: string;
  key_functions?: string[];
  verification_points?: string[];
  test_cases?: string[];
  hints?: string[];
  challenges?: string[];
  resources?: string[];
  assessment?: any;
  chip_model: string;
  template_path: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 用户实验记录类型（对应数据库user_experiments表）
export interface UserExperiment {
  id: string;
  user_id: string;
  template_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  progress: number;
  workspace_path: string;
  started_at: string;
  completed_at?: string;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
  // 关联的模板信息
  template?: ExperimentTemplate;
}

// 开始实验请求类型
export interface StartExperimentRequest {
  template_id: string;
}

// 更新实验进度请求类型
export interface UpdateExperimentRequest {
  progress?: number;
  status?: 'not_started' | 'in_progress' | 'completed' | 'paused';
}

// 开始实验响应类型
export interface StartExperimentResponse {
  id: string;
  user_id: string;
  template_id: string;
  status: string;
  progress: number;
  workspace_path: string;
  started_at: string;
  created_at: string;
  updated_at: string;
}

// API响应类型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 实验API类
export class ExperimentApi {
  // 获取所有实验模板
  static async getExperimentTemplates(): Promise<ExperimentTemplate[]> {
    try {
      const response = await apiClient.get<ApiResponse<ExperimentTemplate[]>>('/api/experiments');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch experiment templates');
    } catch (error) {
      // 如果是网络错误或服务器不可用，抛出更具体的错误
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('无法连接到服务器，请检查网络连接或服务器状态');
      }
      throw error;
    }
  }

  // 获取用户实验记录
  static async getUserExperiments(userId: string): Promise<UserExperiment[]> {
    const response = await apiClient.get<ApiResponse<UserExperiment[]>>(`/api/users/${userId}/experiments`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch user experiments');
  }

  // 开始新实验
  static async startExperiment(userId: string, templateId: string): Promise<StartExperimentResponse> {
    const response = await apiClient.post<ApiResponse<StartExperimentResponse>>(
      `/api/users/${userId}/experiments`,
      { template_id: templateId }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to start experiment');
  }

  // 获取特定实验详情
  static async getExperimentDetail(userId: string, experimentId: string): Promise<UserExperiment> {
    const response = await apiClient.get<ApiResponse<UserExperiment>>(
      `/api/users/${userId}/experiments/${experimentId}`
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch experiment detail');
  }

  // 更新实验进度
  static async updateExperiment(
    userId: string,
    experimentId: string,
    updateData: UpdateExperimentRequest
  ): Promise<UserExperiment> {
    const response = await apiClient.put<ApiResponse<UserExperiment>>(
      `/api/users/${userId}/experiments/${experimentId}`,
      updateData
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to update experiment');
  }

  // 删除用户实验
  static async deleteExperiment(userId: string, experimentId: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/users/${userId}/experiments/${experimentId}`
    );
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete experiment');
    }
  }
}

// 实验列表项类型（用于页面显示）
export interface ExperimentListItem {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  progress: number;
  completed: boolean;
  tags: string[];
  isNew?: boolean;
  isPopular?: boolean;
}

// 扩展ExperimentApi类，添加getExperimentsList方法
export class ExtendedExperimentApi extends ExperimentApi {
  // 获取实验列表（转换为列表项格式）
  static async getExperimentsList(): Promise<ExperimentListItem[]> {
    try {
      // 首先尝试从API获取数据
      const templates = await this.getExperimentTemplates();

      // 将模板转换为列表项格式
      return templates.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description || '暂无描述',
        category: template.category || '未分类',
        difficulty: this.mapDifficultyToString(template.difficulty),
        estimatedTime: template.duration || 60,
        progress: 0, // 默认进度为0，实际应该从用户实验记录中获取
        completed: false, // 默认未完成，实际应该从用户实验记录中获取
        tags: this.extractTags(template),
        isNew: this.isNewExperiment(template),
        isPopular: this.isPopularExperiment(template)
      }));
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error);
      // 返回模拟数据作为后备
      return this.getMockExperimentsList();
    }
  }

  // 将数字难度转换为字符串
  private static mapDifficultyToString(difficulty: number): 'beginner' | 'intermediate' | 'advanced' {
    if (difficulty <= 1) return 'beginner';
    if (difficulty <= 2) return 'intermediate';
    return 'advanced';
  }

  // 从模板中提取标签
  private static extractTags(template: ExperimentTemplate): string[] {
    const tags: string[] = [];

    // 从类别中提取标签
    if (template.category) {
      tags.push(template.category);
    }

    // 从关键功能中提取标签
    if (template.key_functions) {
      tags.push(...template.key_functions.slice(0, 3)); // 最多取3个
    }

    // 从芯片型号中提取标签
    if (template.chip_model) {
      tags.push(template.chip_model);
    }

    return tags.filter(Boolean).slice(0, 4); // 最多返回4个标签
  }

  // 判断是否为新实验（创建时间在30天内）
  private static isNewExperiment(template: ExperimentTemplate): boolean {
    if (!template.created_at) return false;

    const createdDate = new Date(template.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return createdDate > thirtyDaysAgo;
  }

  // 判断是否为热门实验（基于order_index）
  private static isPopularExperiment(template: ExperimentTemplate): boolean {
    return template.order_index <= 5; // 前5个实验标记为热门
  }

  // 获取模拟实验列表数据
  private static getMockExperimentsList(): ExperimentListItem[] {
    return [
      // GPIO基础实验
      {
        id: 'led',
        name: 'LED基础控制',
        description: '学习GPIO基本配置，控制LED灯的亮灭，掌握数字输出的基本原理。',
        category: 'GPIO',
        difficulty: 'beginner',
        estimatedTime: 30,
        progress: 100,
        completed: true,
        tags: ['GPIO', 'LED', '数字输出'],
        isNew: false,
        isPopular: true
      },
      {
        id: 'ledblink',
        name: 'LED闪烁控制',
        description: '使用延时函数控制LED闪烁，学习程序延时和循环控制。',
        category: 'GPIO',
        difficulty: 'beginner',
        estimatedTime: 35,
        progress: 100,
        completed: true,
        tags: ['GPIO', 'LED', '延时'],
        isNew: false,
        isPopular: true
      },
      {
        id: 'ledbanner',
        name: 'LED跑马灯',
        description: '控制多个LED实现跑马灯效果，学习数组操作和循环控制。',
        category: 'GPIO',
        difficulty: 'beginner',
        estimatedTime: 40,
        progress: 75,
        completed: false,
        tags: ['GPIO', 'LED', '跑马灯'],
        isNew: false,
        isPopular: false
      },
      {
        id: 'ledbreath',
        name: 'LED呼吸灯',
        description: '使用PWM控制LED亮度变化，实现呼吸灯效果。',
        category: 'PWM',
        difficulty: 'intermediate',
        estimatedTime: 50,
        progress: 0,
        completed: false,
        tags: ['PWM', 'LED', '呼吸灯'],
        isNew: true,
        isPopular: false
      },
      // 按键输入实验
      {
        id: 'keyscan',
        name: '按键扫描',
        description: '学习GPIO输入配置，实现按键状态检测和消抖处理。',
        category: 'GPIO',
        difficulty: 'beginner',
        estimatedTime: 35,
        progress: 85,
        completed: false,
        tags: ['GPIO', '按键', '输入检测'],
        isNew: false,
        isPopular: true
      },
      {
        id: 'keyint',
        name: '按键中断',
        description: '配置外部中断，实现按键中断响应，学习中断处理机制。',
        category: '中断',
        difficulty: 'intermediate',
        estimatedTime: 45,
        progress: 30,
        completed: false,
        tags: ['中断', '按键', 'EXTI'],
        isNew: false,
        isPopular: true
      },
      // 定时器实验
      {
        id: 'timbase',
        name: '定时器基础',
        description: '学习定时器基本配置，实现精确定时和定时中断。',
        category: '定时器',
        difficulty: 'intermediate',
        estimatedTime: 50,
        progress: 0,
        completed: false,
        tags: ['定时器', '中断', 'TIM'],
        isNew: false,
        isPopular: false
      },
      {
        id: 'timpwm',
        name: '定时器PWM',
        description: '使用定时器生成PWM信号，控制舵机和LED亮度。',
        category: 'PWM',
        difficulty: 'intermediate',
        estimatedTime: 60,
        progress: 0,
        completed: false,
        tags: ['定时器', 'PWM', '舵机'],
        isNew: true,
        isPopular: false
      },
      // 串口通信实验
      {
        id: 'uart',
        name: '串口通信',
        description: 'USART基础通信，实现与PC的数据收发，重定向printf函数。',
        category: 'UART',
        difficulty: 'intermediate',
        estimatedTime: 55,
        progress: 60,
        completed: false,
        tags: ['UART', '串口', 'printf'],
        isNew: false,
        isPopular: true
      },
      {
        id: 'uart_transrecvint',
        name: '串口中断收发',
        description: '使用串口中断方式进行数据收发，提高通信效率。',
        category: 'UART',
        difficulty: 'intermediate',
        estimatedTime: 65,
        progress: 0,
        completed: false,
        tags: ['UART', '中断', '数据收发'],
        isNew: false,
        isPopular: false
      },
      // ADC实验
      {
        id: 'adc',
        name: '模数转换',
        description: '学习ADC基本配置，采集模拟信号并转换为数字量。',
        category: 'ADC',
        difficulty: 'intermediate',
        estimatedTime: 70,
        progress: 0,
        completed: false,
        tags: ['ADC', '模拟量', '转换'],
        isNew: false,
        isPopular: false
      },
      {
        id: 'adcmq2',
        name: 'ADC气体传感器',
        description: '使用ADC读取MQ-2气体传感器数据，实现环境监测。',
        category: 'ADC',
        difficulty: 'intermediate',
        estimatedTime: 80,
        progress: 0,
        completed: false,
        tags: ['ADC', 'MQ-2', '传感器'],
        isNew: false,
        isPopular: false
      },
      // DAC实验
      {
        id: 'dacvoltageout',
        name: 'DAC电压输出',
        description: '学习DAC基本配置，输出指定的模拟电压值。',
        category: 'DAC',
        difficulty: 'advanced',
        estimatedTime: 75,
        progress: 0,
        completed: false,
        tags: ['DAC', '电压输出', '模拟量'],
        isNew: false,
        isPopular: false
      },
      {
        id: 'dacwave',
        name: 'DAC波形生成',
        description: '使用DAC生成正弦波、三角波等各种波形信号。',
        category: 'DAC',
        difficulty: 'advanced',
        estimatedTime: 90,
        progress: 0,
        completed: false,
        tags: ['DAC', '波形生成', '信号'],
        isNew: false,
        isPopular: false
      },
      // 显示实验
      {
        id: 'lcd',
        name: 'LCD显示',
        description: '学习LCD显示屏驱动，实现文字和图形显示功能。',
        category: 'LCD',
        difficulty: 'intermediate',
        estimatedTime: 85,
        progress: 0,
        completed: false,
        tags: ['LCD', '显示', '驱动'],
        isNew: false,
        isPopular: false
      },
      // 综合应用实验
      {
        id: 'smartecowatch',
        name: '智能环境监测系统',
        description: '综合运用传感器、显示、通信等技术，构建环境监测系统。',
        category: '综合应用',
        difficulty: 'advanced',
        estimatedTime: 180,
        progress: 0,
        completed: false,
        tags: ['综合应用', '环境监测', '系统集成'],
        isNew: true,
        isPopular: true
      },
      {
        id: 'autopark',
        name: '智能自动泊车系统',
        description: '基于超声波传感器和舵机控制的自动泊车系统设计。',
        category: '综合应用',
        difficulty: 'advanced',
        estimatedTime: 200,
        progress: 0,
        completed: false,
        tags: ['综合应用', '自动泊车', '传感器'],
        isNew: true,
        isPopular: false
      },
      {
        id: 'fitband',
        name: '智能健身手环',
        description: '集成心率监测、计步、显示等功能的智能穿戴设备。',
        category: '综合应用',
        difficulty: 'advanced',
        estimatedTime: 220,
        progress: 0,
        completed: false,
        tags: ['综合应用', '健身手环', '穿戴设备'],
        isNew: true,
        isPopular: false
      },
      {
        id: 'optitracer',
        name: '光学追踪器',
        description: '基于光学传感器的目标追踪系统，实现智能跟踪功能。',
        category: '综合应用',
        difficulty: 'advanced',
        estimatedTime: 240,
        progress: 0,
        completed: false,
        tags: ['综合应用', '光学追踪', '智能控制'],
        isNew: true,
        isPopular: false
      }
    ];
  }
}

// 导出默认实例
export const experimentApi = ExtendedExperimentApi;
