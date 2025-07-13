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
      this.currentSession.isActive = false;
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      if (options.onError) {
        options.onError(errorMessage);
      }
      
      throw error;
    }
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
      throw error;
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
      throw error;
    }
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
      // 遵循奥卡姆原则：失败时返回空数组，不使用备用逻辑
      return [];
    }
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
