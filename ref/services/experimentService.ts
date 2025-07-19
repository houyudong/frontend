/**
 * 实验服务层
 * 
 * 参考STMIde的服务层架构
 * 处理实验相关的业务逻辑和API调用
 */

import {
  ExperimentTemplate,
  UserExperiment,
  EXPERIMENT_URL_TO_ID
} from '../types/experiment';
import { experimentConfig, API_ENDPOINTS } from '../config';

/**
 * 实验服务类
 */
export class ExperimentService {
  private baseUrl: string;
  private cache: Map<string, any> = new Map();
  private cacheTimestamps: Map<string, number> = new Map();

  constructor() {
    this.baseUrl = experimentConfig.apiBaseUrl;
  }

  /**
   * 通用HTTP请求方法
   */
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'X-Bypass-Auth': 'true',
        'Authorization': 'Bearer dev-token',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // 检查业务逻辑错误
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error(`API请求失败 [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * 缓存管理
   */
  private getCacheKey(key: string): string {
    return `experiment_${key}`;
  }

  private isValidCache(key: string): boolean {
    const cacheKey = this.getCacheKey(key);
    const timestamp = this.cacheTimestamps.get(cacheKey);
    
    if (!timestamp) return false;
    
    return Date.now() - timestamp < experimentConfig.cacheTimeout;
  }

  private setCache<T>(key: string, data: T): void {
    const cacheKey = this.getCacheKey(key);
    this.cache.set(cacheKey, data);
    this.cacheTimestamps.set(cacheKey, Date.now());
  }

  private getCache<T>(key: string): T | null {
    if (!this.isValidCache(key)) return null;
    
    const cacheKey = this.getCacheKey(key);
    return this.cache.get(cacheKey) || null;
  }

  /**
   * 获取所有实验模板
   */
  async getExperimentTemplates(): Promise<ExperimentTemplate[]> {
    const cacheKey = 'templates';
    const cached = this.getCache<ExperimentTemplate[]>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await this.request<{
        success: boolean;
        data: ExperimentTemplate[];
        count: number;
      }>(API_ENDPOINTS.TEMPLATES);

      const templates = response.data || [];
      if (templates.length > 0) {
        this.setCache(cacheKey, templates);
        return templates;
      }
    } catch (error) {
      console.warn('API获取实验模板失败，使用默认数据:', error);
    }

    // API失败或返回空数据时，返回默认的19个实验模板
    const defaultTemplates = this.getDefaultTemplates();
    this.setCache(cacheKey, defaultTemplates);
    return defaultTemplates;
  }

  /**
   * 根据ID获取实验模板
   */
  async getExperimentTemplate(id: string): Promise<ExperimentTemplate | null> {
    const cacheKey = `template_${id}`;
    const cached = this.getCache<ExperimentTemplate>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await this.request<{
        success: boolean;
        data: ExperimentTemplate;
      }>(API_ENDPOINTS.TEMPLATE_BY_ID(id));

      const template = response.data;
      this.setCache(cacheKey, template);

      return template;
    } catch (error) {
      console.warn(`API获取实验模板失败，使用默认数据 [${id}]:`, error);

      // API失败时，从默认数据中查找
      const defaultTemplates = this.getDefaultTemplates();
      const defaultTemplate = defaultTemplates.find(t => t.id === id);

      if (defaultTemplate) {
        this.setCache(cacheKey, defaultTemplate);
        return defaultTemplate;
      }

      return null;
    }
  }

  /**
   * 根据URL名称获取实验模板
   */
  async getExperimentTemplateByUrl(urlName: string): Promise<ExperimentTemplate | null> {
    const templateId = EXPERIMENT_URL_TO_ID[urlName];
    if (!templateId) {
      console.warn(`未找到URL名称对应的实验ID: ${urlName}`);
      return null;
    }

    try {
      // 先尝试从API获取
      const template = await this.getExperimentTemplate(templateId);
      if (template) {
        return template;
      }
    } catch (error) {
      console.warn(`API获取实验模板失败，使用默认数据: ${templateId}`, error);
    }

    // API失败时，从默认数据中查找
    const defaultTemplates = this.getDefaultTemplates();
    const defaultTemplate = defaultTemplates.find(t => t.id === templateId);

    if (defaultTemplate) {
      console.log(`使用默认实验模板: ${templateId}`);
      return defaultTemplate;
    }

    console.error(`未找到实验模板: ${templateId}`);
    return null;
  }

  /**
   * 获取用户实验列表
   */
  async getUserExperiments(userId: string): Promise<UserExperiment[]> {
    const cacheKey = `user_experiments_${userId}`;
    const cached = this.getCache<UserExperiment[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await this.request<{
        success: boolean;
        data: UserExperiment[];
        count: number;
      }>(API_ENDPOINTS.USER_EXPERIMENTS(userId));

      const experiments = response.data || [];
      this.setCache(cacheKey, experiments);
      
      return experiments;
    } catch (error) {
      console.error('获取用户实验失败:', error);
      return [];
    }
  }

  /**
   * 开始实验
   */
  async startExperiment(userId: string, templateId: string): Promise<any> {
    try {
      const response = await this.request<{
        success: boolean;
        message: string;
        data: any;
      }>(API_ENDPOINTS.START_EXPERIMENT(userId), {
        method: 'POST',
        body: JSON.stringify({
          template_id: templateId
        })
      });

      // 清除相关缓存
      this.clearUserCache(userId);
      
      return response.data;
    } catch (error) {
      console.error('开始实验失败:', error);
      throw error;
    }
  }

  /**
   * 删除实验
   */
  async deleteExperiment(userId: string, experimentId: number): Promise<void> {
    try {
      await this.request<{
        success: boolean;
        message: string;
      }>(API_ENDPOINTS.DELETE_EXPERIMENT(userId, experimentId), {
        method: 'DELETE'
      });

      // 清除相关缓存
      this.clearUserCache(userId);
    } catch (error) {
      console.error('删除实验失败:', error);
      throw error;
    }
  }

  /**
   * 清除用户相关缓存
   */
  private clearUserCache(userId: string): void {
    const userCacheKeys = [
      `user_experiments_${userId}`,
      `user_progress_${userId}`
    ];

    userCacheKeys.forEach(key => {
      const cacheKey = this.getCacheKey(key);
      this.cache.delete(cacheKey);
      this.cacheTimestamps.delete(cacheKey);
    });
  }

  /**
   * 清除所有缓存
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }

  /**
   * 获取默认实验模板（离线模式）
   */
  private getDefaultTemplates(): ExperimentTemplate[] {
    return [
      // GPIO类实验 (4个)
      {
        id: '2',
        name: 'STM32F103 LED基础控制',
        project_name: '03-1 STM32F103_LED',
        category: 'basic',
        difficulty: 1,
        duration: 45,
        description: '学习STM32 GPIO的基本配置和LED控制',
        learning_objectives: ['掌握GPIO配置', '理解LED驱动原理', '学习基础控制'],
        is_active: true,
        order_index: 1
      },
      {
        id: '3',
        name: 'STM32F103 LED闪烁控制',
        project_name: '03-2 STM32F103_LEDBlink',
        category: 'basic',
        difficulty: 1,
        duration: 50,
        description: '实现LED的周期性闪烁效果',
        learning_objectives: ['掌握延时控制', '理解状态切换', '学习循环程序'],
        is_active: true,
        order_index: 2
      },
      {
        id: '4',
        name: 'STM32F103 LED跑马灯',
        project_name: '03-3 STM32F103_LEDBanner',
        category: 'basic',
        difficulty: 1,
        duration: 55,
        description: '实现多个LED的跑马灯效果',
        learning_objectives: ['掌握多GPIO控制', '理解数组算法', '学习时序控制'],
        is_active: true,
        order_index: 3
      },
      {
        id: '5',
        name: 'STM32F103 LED呼吸灯',
        project_name: '03-4 STM32F103_LEDBreath',
        category: 'basic',
        difficulty: 2,
        duration: 65,
        description: '使用PWM实现LED呼吸灯效果',
        learning_objectives: ['掌握PWM生成', '理解占空比控制', '学习模拟输出'],
        is_active: true,
        order_index: 4
      },
      // 输入处理类实验 (2个)
      {
        id: '7',
        name: 'STM32F103 按键扫描',
        project_name: '03-5 STM32F103_KEYScan',
        category: 'basic',
        difficulty: 1,
        duration: 50,
        description: '学习按键输入检测和软件消抖',
        learning_objectives: ['掌握输入检测', '理解软件消抖', '学习轮询扫描'],
        is_active: true,
        order_index: 5
      },
      {
        id: '6',
        name: 'STM32F103 按键中断',
        project_name: '03-6 STM32F103_KEYInt',
        category: 'basic',
        difficulty: 1,
        duration: 60,
        description: '使用外部中断处理按键输入',
        learning_objectives: ['掌握外部中断', '理解中断服务', '学习实时响应'],
        is_active: true,
        order_index: 6
      },
      // 定时器类实验 (2个)
      {
        id: '8',
        name: 'STM32F103 定时器基础',
        project_name: '04-1 STM32F103_TIMBase',
        category: 'intermediate',
        difficulty: 2,
        duration: 60,
        description: '学习定时器的基本配置和使用',
        learning_objectives: ['掌握定时器配置', '理解精确定时', '学习中断处理'],
        is_active: true,
        order_index: 7
      },
      {
        id: '11',
        name: 'STM32F103 定时器PWM',
        project_name: '05-1 STM32F103_TIMPWM',
        category: 'intermediate',
        difficulty: 2,
        duration: 75,
        description: '使用定时器生成PWM信号',
        learning_objectives: ['掌握PWM模式', '理解频率控制', '学习占空比调节'],
        is_active: true,
        order_index: 8
      },
      // 通信类实验 (2个)
      {
        id: '9',
        name: 'STM32F103 串口通信',
        project_name: '06-1 STM32F103_UART',
        category: 'intermediate',
        difficulty: 2,
        duration: 80,
        description: '学习UART串口通信的基本使用',
        learning_objectives: ['掌握UART配置', '理解数据收发', '学习通信调试'],
        is_active: true,
        order_index: 9
      },
      {
        id: '10',
        name: 'STM32F103 串口中断收发',
        project_name: '06-2 STM32F103_UART_TransRecvInt',
        category: 'intermediate',
        difficulty: 2,
        duration: 85,
        description: '使用中断方式进行串口数据收发',
        learning_objectives: ['掌握中断收发', '理解缓冲管理', '学习高效通信'],
        is_active: true,
        order_index: 10
      },
      // 模拟信号类实验 (4个)
      {
        id: '12',
        name: 'STM32F103 模数转换',
        project_name: '07-1 STM32F103_ADC',
        category: 'advanced',
        difficulty: 3,
        duration: 90,
        description: '学习ADC模数转换的基本使用',
        learning_objectives: ['掌握ADC配置', '理解模拟采集', '学习数据转换'],
        is_active: true,
        order_index: 11
      },
      {
        id: '13',
        name: 'STM32F103 ADC气体传感器',
        project_name: '07-2 STM32F103_ADCMQ2',
        category: 'advanced',
        difficulty: 3,
        duration: 95,
        description: '使用ADC读取MQ2气体传感器数据',
        learning_objectives: ['掌握传感器接口', '理解信号调理', '学习数据处理'],
        is_active: true,
        order_index: 12
      },
      {
        id: '14',
        name: 'STM32F103 DAC电压输出',
        project_name: '08-1 STM32F103_DACVoltageOut',
        category: 'advanced',
        difficulty: 3,
        duration: 80,
        description: '学习DAC数模转换的基本使用',
        learning_objectives: ['掌握DAC配置', '理解电压输出', '学习精度控制'],
        is_active: true,
        order_index: 13
      },
      {
        id: '15',
        name: 'STM32F103 DAC波形生成',
        project_name: '08-2 STM32F103_DACWave',
        category: 'advanced',
        difficulty: 3,
        duration: 90,
        description: '使用DAC和DMA生成各种波形',
        learning_objectives: ['掌握波形生成', '理解DMA应用', '学习信号合成'],
        is_active: true,
        order_index: 14
      },
      // 显示类实验 (1个)
      {
        id: '16',
        name: 'STM32F103 LCD显示',
        project_name: '13-1 STM32F103_LCD',
        category: 'intermediate',
        difficulty: 2,
        duration: 70,
        description: '学习LCD1602字符显示屏的驱动',
        learning_objectives: ['掌握LCD驱动', '理解字符显示', '学习接口时序'],
        is_active: true,
        order_index: 15
      },
      // 综合项目类实验 (4个)
      {
        id: '17',
        name: '智能环境监测系统',
        project_name: '09-1 STM32F103_SmartEcoWatch',
        category: 'project',
        difficulty: 3,
        duration: 120,
        description: '综合多种传感器实现智能环境监测',
        learning_objectives: ['掌握系统集成', '理解多传感器', '学习智能控制'],
        is_active: true,
        order_index: 16
      },
      {
        id: '18',
        name: '智能自动泊车系统',
        project_name: '10-1 STM32F103_AutoPark',
        category: 'project',
        difficulty: 3,
        duration: 150,
        description: '实现智能小车的自动泊车功能',
        learning_objectives: ['掌握自动控制', '理解路径规划', '学习传感器融合'],
        is_active: true,
        order_index: 17
      },
      {
        id: '19',
        name: '智能健身手环',
        project_name: '11-1 STM32F103_FitBand',
        category: 'project',
        difficulty: 3,
        duration: 140,
        description: '开发智能健身手环的核心功能',
        learning_objectives: ['掌握生物信号', '理解数据分析', '学习健康监测'],
        is_active: true,
        order_index: 18
      },
      {
        id: '20',
        name: '光学追踪器',
        project_name: '12-1 STM32F103_OptiTracer',
        category: 'project',
        difficulty: 3,
        duration: 130,
        description: '实现光学目标追踪系统',
        learning_objectives: ['掌握光学检测', '理解轨迹跟踪', '学习实时处理'],
        is_active: true,
        order_index: 19
      }
    ];
  }
}

// 导出单例实例
export const experimentService = new ExperimentService();
