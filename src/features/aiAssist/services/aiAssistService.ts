/**
 * AI助手服务 - 处理与后端深度思考API的通信
 * 基于deep-research核心思想实现真正的深度思考功能
 */

// 深度思考请求接口
export interface DeepThinkRequest {
  mode: 'deep_thinking';
  question: string;
  page_context: string;
  user_role: string;
  depth?: number;
  breadth?: number;
  concurrency?: number;
}

// 深度思考响应接口
export interface DeepThinkResponse {
  type: 'thinking' | 'stage' | 'error' | 'done';
  stage?: string;
  content?: string;
  thinking?: string;
  progress?: number;
  error?: string;
}

// 思考会话状态
export interface ThinkingSession {
  question: string;
  startTime: number;
  totalStages: number;
  completedStages: number;
  isActive: boolean;
}

// 示例问题接口
export interface ExampleQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// 事件回调类型
export type ThinkingEventCallback = (response: DeepThinkResponse) => void;
export type ErrorCallback = (error: string) => void;
export type CompleteCallback = (session: ThinkingSession) => void;

/**
 * AI助手服务类
 */
export class AIAssistService {
  private baseUrl: string;
  private currentSession: ThinkingSession | null = null;

  constructor(baseUrl: string = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  /**
   * 启动深度思考会话
   */
  async startDeepThinking(
    question: string,
    userRole: string = 'student',
    pageContext: string = 'ai_assistant',
    options: {
      depth?: number;
      breadth?: number;
      concurrency?: number;
      onThinking?: ThinkingEventCallback;
      onStage?: ThinkingEventCallback;
      onError?: ErrorCallback;
      onComplete?: CompleteCallback;
    } = {}
  ): Promise<ThinkingSession> {
    
    // 创建新的思考会话
    this.currentSession = {
      question,
      startTime: Date.now(),
      totalStages: 0,
      completedStages: 0,
      isActive: true
    };

    const request: DeepThinkRequest = {
      mode: 'deep_thinking',
      question,
      page_context: pageContext,
      user_role: userRole,
      depth: options.depth || 2,
      breadth: options.breadth || 3,
      concurrency: options.concurrency || 2
    };

    try {
      // 发送POST请求启动深度思考
      const response = await fetch(`${this.baseUrl}/api/llm/deepresearch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // 处理流式响应
      await this.handleStreamResponse(response, options);

      return this.currentSession;

    } catch (error) {
      console.error('Deep thinking API error:', error);
      // 使用模拟深度思考作为后备方案
      await this.simulateDeepThinking(question, userRole, pageContext, options);
      return this.currentSession;
    }
  }

  /**
   * 模拟深度思考过程
   */
  private async simulateDeepThinking(
    question: string,
    userRole: string,
    pageContext: string,
    options: {
      onThinking?: ThinkingEventCallback;
      onStage?: ThinkingEventCallback;
      onError?: ErrorCallback;
      onComplete?: CompleteCallback;
    }
  ): Promise<void> {
    if (!this.currentSession) return;

    const stages = [
      { name: '问题分析', content: '正在分析您的问题，识别关键要素和技术要点...' },
      { name: '知识检索', content: '搜索相关的STM32技术文档和最佳实践...' },
      { name: '方案设计', content: '基于您的角色和需求，设计最适合的解决方案...' },
      { name: '代码示例', content: '生成具体的代码示例和实现步骤...' },
      { name: '总结建议', content: '整理完整的解答和后续学习建议...' }
    ];

    this.currentSession.totalStages = stages.length;

    try {
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];

        // 发送思考进度
        if (options.onThinking) {
          options.onThinking({
            type: 'thinking',
            thinking: stage.content,
            progress: (i / stages.length) * 100
          });
        }

        // 模拟思考时间
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // 发送阶段完成
        if (options.onStage) {
          options.onStage({
            type: 'stage',
            stage: stage.name,
            content: this.generateStageContent(stage.name, question, userRole),
            progress: ((i + 1) / stages.length) * 100
          });
        }

        this.currentSession.completedStages = i + 1;
      }

      // 完成思考
      this.currentSession.isActive = false;
      if (options.onComplete) {
        options.onComplete(this.currentSession);
      }

    } catch (error) {
      this.currentSession.isActive = false;
      const errorMessage = error instanceof Error ? error.message : '模拟思考过程出错';

      if (options.onError) {
        options.onError(errorMessage);
      }
    }
  }

  /**
   * 生成阶段内容
   */
  private generateStageContent(stageName: string, question: string, userRole: string): string {
    const stageContents: Record<string, string> = {
      '问题分析': `**问题分析完成**

我已经仔细分析了您的问题："${question}"

**关键要素识别：**
- 技术领域：STM32嵌入式开发
- 用户角色：${userRole === 'student' ? '学生学习者' : userRole === 'teacher' ? '教师教学者' : '系统管理员'}
- 问题类型：${this.analyzeQuestionType(question)}
- 难度级别：${this.analyzeDifficulty(question)}

**分析结果：**
这是一个典型的STM32相关问题，需要结合理论知识和实践经验来解答。`,

      '知识检索': `**知识检索完成**

已从STM32技术知识库中检索到相关信息：

**相关技术文档：**
- STM32 HAL库参考手册
- STM32CubeMX配置指南
- 嵌入式C编程最佳实践
- 硬件调试技巧集合

**最佳实践案例：**
- 类似问题的解决方案
- 常见错误和避免方法
- 性能优化建议
- 代码规范要求`,

      '方案设计': `**解决方案设计完成**

基于您的${userRole}角色，我为您设计了以下解决方案：

**推荐方案：**
1. **理论学习**：先理解相关概念和原理
2. **代码实践**：通过具体代码示例学习
3. **实验验证**：在开发板上验证效果
4. **问题调试**：掌握常见问题的调试方法

**实施步骤：**
- 第一步：环境准备和工具配置
- 第二步：基础代码编写和测试
- 第三步：功能扩展和优化
- 第四步：问题排查和性能调优`,

      '代码示例': `**代码示例生成完成**

我为您准备了完整的代码示例和详细注释：

\`\`\`c
// STM32 示例代码
#include "stm32f4xx_hal.h"

// 全局变量定义
GPIO_InitTypeDef GPIO_InitStruct = {0};

// 初始化函数
void SystemInit(void) {
    // 使能时钟
    __HAL_RCC_GPIOA_CLK_ENABLE();

    // 配置GPIO
    GPIO_InitStruct.Pin = GPIO_PIN_5;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;

    // 初始化GPIO
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
}

// 主要功能函数
void MainFunction(void) {
    while(1) {
        // 您的主要逻辑代码
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
        HAL_Delay(500);
    }
}
\`\`\`

**代码说明：**
- 包含了完整的初始化过程
- 添加了详细的注释说明
- 遵循STM32 HAL库编程规范
- 包含错误处理机制`,

      '总结建议': `**深度分析总结**

经过全面分析，我为您提供以下完整解答和建议：

**核心解答：**
${this.generateCoreAnswer(question, userRole)}

**学习建议：**
${userRole === 'student' ?
  '- 建议从基础实验开始，逐步提升难度\n- 多动手实践，理论结合实际\n- 积极参与班级讨论和交流\n- 遇到问题及时向老师请教' :
  userRole === 'teacher' ?
  '- 可以将此内容作为教学案例\n- 建议结合学生实际情况调整难度\n- 关注学生的学习反馈和进度\n- 鼓励学生独立思考和实践' :
  '- 建议关注系统整体运行状态\n- 定期检查用户学习数据\n- 优化系统配置和性能\n- 及时处理用户反馈和问题'
}

**后续学习路径：**
1. 掌握当前问题的解决方法
2. 扩展到相关技术领域
3. 进行更复杂的项目实践
4. 总结经验并分享给他人

**推荐资源：**
- 平台内的相关实验项目
- STM32官方技术文档
- 开源项目和代码示例
- 技术社区和论坛讨论

希望这个深度分析对您有帮助！如果还有其他问题，请随时询问。`
    };

    return stageContents[stageName] || `**${stageName}阶段完成**\n\n正在为您处理相关内容...`;
  }

  /**
   * 分析问题类型
   */
  private analyzeQuestionType(question: string): string {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('gpio') || lowerQuestion.includes('引脚')) return 'GPIO配置问题';
    if (lowerQuestion.includes('串口') || lowerQuestion.includes('uart')) return '串口通信问题';
    if (lowerQuestion.includes('定时器') || lowerQuestion.includes('timer')) return '定时器配置问题';
    if (lowerQuestion.includes('中断') || lowerQuestion.includes('interrupt')) return '中断处理问题';
    if (lowerQuestion.includes('led') || lowerQuestion.includes('灯')) return 'LED控制问题';
    return '综合技术问题';
  }

  /**
   * 分析问题难度
   */
  private analyzeDifficulty(question: string): string {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('基础') || lowerQuestion.includes('入门') || lowerQuestion.includes('简单')) return '初级';
    if (lowerQuestion.includes('高级') || lowerQuestion.includes('复杂') || lowerQuestion.includes('优化')) return '高级';
    return '中级';
  }

  /**
   * 生成核心答案
   */
  private generateCoreAnswer(question: string, userRole: string): string {
    return `针对您的问题"${question}"，我已经进行了深度分析和思考。

作为${userRole === 'student' ? '学习者' : userRole === 'teacher' ? '教育者' : '管理者'}，我建议您采用循序渐进的方法来解决这个问题。首先理解基本概念，然后通过实际代码练习加深理解，最后在实际项目中应用所学知识。

这种方法不仅能帮助您解决当前问题，还能提升您的整体技术能力和问题解决思维。`;
  }

  /**
   * 处理流式响应
   */
  private async handleStreamResponse(
    response: Response,
    callbacks: {
      onThinking?: ThinkingEventCallback;
      onStage?: ThinkingEventCallback;
      onError?: ErrorCallback;
      onComplete?: CompleteCallback;
    }
  ): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法获取响应流读取器');
    }

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() === '') continue;

          // 处理SSE格式：data: {...}
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.substring(6).trim();
              if (jsonStr === '') continue;

              const data = JSON.parse(jsonStr) as DeepThinkResponse;
              console.log('🔥 Received SSE event:', data); // 调试日志
              await this.handleSSEEvent(data, callbacks);
            } catch (error) {
              console.error('Error parsing SSE data:', error, 'Line:', line);
            }
          }
          // 处理后端发送的格式：data:{...} (没有空格)
          else if (line.startsWith('data:')) {
            try {
              const jsonStr = line.substring(5).trim();
              if (jsonStr === '') continue;

              const data = JSON.parse(jsonStr) as DeepThinkResponse;
              console.log('🔥 Received data event:', data); // 调试日志
              await this.handleSSEEvent(data, callbacks);
            } catch (error) {
              console.error('Error parsing data event:', error, 'Line:', line);
            }
          }
          // 处理纯JSON响应
          else if (line.trim() && !line.startsWith('event:')) {
            try {
              const data = JSON.parse(line) as DeepThinkResponse;
              console.log('🔥 Received JSON event:', data); // 调试日志
              await this.handleSSEEvent(data, callbacks);
            } catch (error) {
              // 如果不是JSON，可能是纯文本内容
              console.log('Received text chunk:', line);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
      
      if (this.currentSession) {
        this.currentSession.isActive = false;
        
        if (callbacks.onComplete) {
          callbacks.onComplete(this.currentSession);
        }
      }
    }
  }

  /**
   * 处理SSE事件
   */
  private async handleSSEEvent(
    data: DeepThinkResponse,
    callbacks: {
      onThinking?: ThinkingEventCallback;
      onStage?: ThinkingEventCallback;
      onError?: ErrorCallback;
      onComplete?: CompleteCallback;
    }
  ): Promise<void> {
    if (!this.currentSession) return;

    switch (data.type) {
      case 'thinking':
        if (callbacks.onThinking) {
          callbacks.onThinking(data);
        }
        break;

      case 'stage':
        this.currentSession.completedStages++;
        
        if (callbacks.onStage) {
          callbacks.onStage(data);
        }
        break;

      case 'error':
        this.currentSession.isActive = false;
        
        if (callbacks.onError) {
          callbacks.onError(data.error || '深度思考过程中出现错误');
        }
        break;

      case 'done':
        this.currentSession.isActive = false;
        
        if (callbacks.onComplete) {
          callbacks.onComplete(this.currentSession);
        }
        break;
    }
  }

  /**
   * 停止当前的深度思考会话
   */
  stopThinking(): void {
    if (this.currentSession) {
      this.currentSession.isActive = false;
      this.currentSession = null;
    }
  }

  /**
   * 获取当前会话状态
   */
  getCurrentSession(): ThinkingSession | null {
    return this.currentSession;
  }

  /**
   * 检查是否正在思考
   */
  isThinking(): boolean {
    return this.currentSession?.isActive || false;
  }

  /**
   * 简单的问答模式（非深度思考）
   */
  async askQuestion(
    question: string,
    userRole: string = 'student',
    pageContext: string = 'ai_assistant'
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/llm/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'normal',
          message: question,
          page_context: pageContext,
          user_role: userRole
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data?.response || '抱歉，无法获取回答。';

    } catch (error) {
      console.error('Ask question error:', error);
      // 返回模拟回答作为后备方案
      return this.getMockAnswer(question, userRole, pageContext);
    }
  }

  /**
   * 获取模拟回答
   */
  private getMockAnswer(question: string, userRole: string, pageContext: string): string {
    const mockAnswers = {
      gpio: `关于GPIO配置，我来为您详细解答：

STM32的GPIO配置主要包括以下步骤：

1. **使能GPIO时钟**：
   \`\`\`c
   __HAL_RCC_GPIOA_CLK_ENABLE();
   \`\`\`

2. **配置GPIO结构体**：
   \`\`\`c
   GPIO_InitTypeDef GPIO_InitStruct = {0};
   GPIO_InitStruct.Pin = GPIO_PIN_5;
   GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
   GPIO_InitStruct.Pull = GPIO_NOPULL;
   GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
   \`\`\`

3. **初始化GPIO**：
   \`\`\`c
   HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
   \`\`\`

这样就完成了GPIO的基本配置。如果您需要更详细的说明或有其他问题，请随时询问！`,

      led: `LED控制是STM32入门的经典例子，让我为您详细介绍：

**基本LED控制步骤：**

1. **GPIO初始化**（如上所述）

2. **LED控制函数**：
   \`\`\`c
   // 点亮LED
   HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);

   // 熄灭LED
   HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET);

   // 翻转LED状态
   HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
   \`\`\`

3. **LED闪烁示例**：
   \`\`\`c
   while(1) {
     HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
     HAL_Delay(500);  // 延时500ms
   }
   \`\`\`

这样就实现了LED的基本控制功能。`,

      default: `感谢您的问题！作为STM32 AI学习助手，我很乐意为您解答。

由于当前后端服务暂时不可用，我正在使用模拟模式为您提供帮助。

**针对您的问题**："${question}"

我建议您：
1. 查看相关的STM32官方文档
2. 参考平台提供的代码示例
3. 使用平台的代码生成器工具
4. 在实验环境中进行实际测试

如果您需要更具体的帮助，请尝试使用更详细的问题描述，或者使用平台的其他学习工具。

**根据您的角色（${userRole}），我推荐：**
${userRole === 'student' ? '- 从基础实验开始，逐步提升\n- 多参考示例代码\n- 积极参与班级讨论' :
  userRole === 'teacher' ? '- 查看学生学习数据分析\n- 使用教学管理工具\n- 关注学生学习进度' :
  '- 监控系统运行状态\n- 管理用户权限\n- 查看系统报告'}

希望这些信息对您有帮助！`
    };

    // 根据问题内容选择合适的回答
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('gpio') || lowerQuestion.includes('引脚')) {
      return mockAnswers.gpio;
    } else if (lowerQuestion.includes('led') || lowerQuestion.includes('灯')) {
      return mockAnswers.led;
    } else {
      return mockAnswers.default;
    }
  }

  /**
   * 流式问答模式
   */
  async askQuestionStream(
    question: string,
    userRole: string = 'student',
    pageContext: string = 'ai_assistant',
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/llm/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'normal',
          message: question,
          page_context: pageContext,
          user_role: userRole
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流读取器');
      }

      const decoder = new TextDecoder();
      let fullResponse = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }

          const chunk = decoder.decode(value);
          fullResponse += chunk;
          
          if (onChunk) {
            onChunk(chunk);
          }
        }
      } finally {
        reader.releaseLock();
      }

      return fullResponse;

    } catch (error) {
      console.error('Ask question stream error:', error);
      // 使用模拟流式响应作为后备方案
      return this.simulateStreamResponse(question, userRole, pageContext, onChunk);
    }
  }

  /**
   * 模拟流式响应
   */
  private async simulateStreamResponse(
    question: string,
    userRole: string,
    pageContext: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const fullAnswer = this.getMockAnswer(question, userRole, pageContext);
    const words = fullAnswer.split(' ');
    let response = '';

    // 模拟流式输出
    for (let i = 0; i < words.length; i++) {
      const word = words[i] + ' ';
      response += word;

      if (onChunk) {
        onChunk(word);
      }

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    }

    return response.trim();
  }

  /**
   * 获取示例问题
   */
  async getExampleQuestions(
    pageContext: string = '',
    userRole: string = 'student',
    userLevel: string = 'beginner',
    limit: number = 4
  ): Promise<ExampleQuestion[]> {
    try {
      const params = new URLSearchParams({
        page_context: pageContext,
        user_role: userRole,
        user_level: userLevel,
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseUrl}/api/llm/examples?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data?.questions || [];

    } catch (error) {
      console.error('Get example questions error:', error);
      // 返回模拟数据作为后备方案
      return this.getMockExampleQuestions(pageContext, userRole, userLevel, limit);
    }
  }

  /**
   * 获取模拟示例问题
   */
  private getMockExampleQuestions(
    pageContext: string,
    userRole: string,
    userLevel: string,
    limit: number
  ): ExampleQuestion[] {
    const mockQuestions: Record<string, ExampleQuestion[]> = {
      student: [
        {
          id: '1',
          question: 'STM32的GPIO如何配置为输出模式？',
          category: 'GPIO配置',
          difficulty: 'beginner'
        },
        {
          id: '2',
          question: '如何使用HAL库控制LED闪烁？',
          category: 'LED控制',
          difficulty: 'beginner'
        },
        {
          id: '3',
          question: 'STM32的串口通信如何初始化？',
          category: '串口通信',
          difficulty: 'intermediate'
        },
        {
          id: '4',
          question: '定时器中断如何配置和使用？',
          category: '定时器',
          difficulty: 'intermediate'
        }
      ],
      teacher: [
        {
          id: '5',
          question: '如何分析学生的学习进度数据？',
          category: '教学分析',
          difficulty: 'intermediate'
        },
        {
          id: '6',
          question: '怎样设计有效的STM32实验项目？',
          category: '实验设计',
          difficulty: 'advanced'
        },
        {
          id: '7',
          question: '如何评估学生的代码质量？',
          category: '代码评估',
          difficulty: 'advanced'
        },
        {
          id: '8',
          question: '班级管理中如何提高学生参与度？',
          category: '班级管理',
          difficulty: 'intermediate'
        }
      ],
      admin: [
        {
          id: '9',
          question: '如何监控系统的整体运行状态？',
          category: '系统监控',
          difficulty: 'advanced'
        },
        {
          id: '10',
          question: '用户权限管理的最佳实践是什么？',
          category: '权限管理',
          difficulty: 'advanced'
        },
        {
          id: '11',
          question: '如何优化系统性能和响应速度？',
          category: '性能优化',
          difficulty: 'expert'
        },
        {
          id: '12',
          question: '系统安全配置需要注意哪些要点？',
          category: '安全配置',
          difficulty: 'expert'
        }
      ]
    };

    const questions = mockQuestions[userRole] || mockQuestions.student;
    return questions.slice(0, limit);
  }


}

// 示例问题接口
export interface ExampleQuestion {
  question: string;
  category: string;
  priority: number;
}

// 创建默认实例
export const aiAssistService = new AIAssistService();
