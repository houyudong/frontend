# STM32 AI平台 - API使用指南

## 📋 概述

本文档描述了STM32 AI学习平台的前端API架构和使用方法。

## 🔧 API客户端配置

### 基础配置
```typescript
// src/api/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理认证失败
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🔐 认证API

### 登录接口
```typescript
interface LoginRequest {
  username: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
}

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      username: string;
      displayName: string;
      role: string;
      email?: string;
    };
  };
  message: string;
}

// 使用示例
const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post('/api/auth/login', credentials);
  return response.data;
};
```

### 用户信息获取
```typescript
const getCurrentUser = async () => {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};
```

## 🧪 实验管理API

### 获取实验列表
```typescript
interface ExperimentListItem {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: number;
  completed: boolean;
  progress: number;
}

const getExperiments = async (): Promise<ExperimentListItem[]> => {
  const response = await apiClient.get('/api/experiments');
  return response.data.data;
};
```

### 获取实验详情
```typescript
interface ExperimentDetail {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  knowledgePoints: KnowledgePoint[];
  steps: ExperimentStep[];
  resources: Resource[];
  evaluation: EvaluationCriteria;
}

const getExperimentDetail = async (id: string): Promise<ExperimentDetail> => {
  const response = await apiClient.get(`/api/experiments/${id}`);
  return response.data.data;
};
```

### 提交实验结果
```typescript
interface ExperimentSubmission {
  experimentId: string;
  code: string;
  results: any;
  notes?: string;
}

const submitExperiment = async (submission: ExperimentSubmission) => {
  const response = await apiClient.post('/api/experiments/submit', submission);
  return response.data;
};
```

## 🤖 AI助手API

### 普通对话模式
```typescript
interface ChatRequest {
  message: string;
  mode: 'normal';
  page_context: string;
  user_role: string;
}

const askQuestion = async (question: string, userRole: string = 'student') => {
  const response = await apiClient.post('/api/llm/chat', {
    mode: 'normal',
    message: question,
    page_context: 'ai_assistant',
    user_role: userRole
  });
  return response.data.data.response;
};
```

### 深度思考模式
```typescript
interface DeepThinkRequest {
  mode: 'deep_thinking';
  question: string;
  page_context: string;
  user_role: string;
  depth: number;
  breadth: number;
  concurrency: number;
}

const startDeepThinking = async (request: DeepThinkRequest) => {
  const response = await apiClient.post('/api/llm/deep-think', request);
  return response.data;
};
```

## 📊 数据分析API

### 学生进度数据
```typescript
interface StudentProgress {
  studentId: string;
  experimentsCompleted: number;
  totalExperiments: number;
  averageScore: number;
  timeSpent: number;
  lastActivity: string;
}

const getStudentProgress = async (studentId: string): Promise<StudentProgress> => {
  const response = await apiClient.get(`/api/analytics/student/${studentId}/progress`);
  return response.data.data;
};
```

### 班级统计数据
```typescript
interface ClassStatistics {
  classId: string;
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  completionRate: number;
  topPerformers: StudentSummary[];
}

const getClassStatistics = async (classId: string): Promise<ClassStatistics> => {
  const response = await apiClient.get(`/api/analytics/class/${classId}/statistics`);
  return response.data.data;
};
```

## 🛠️ STM32 IDE API

### 项目管理
```typescript
interface ProjectInfo {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived' | 'deleted';
}

const getProjects = async (): Promise<ProjectInfo[]> => {
  const response = await apiClient.get('/api/projects');
  return response.data.data;
};

const createProject = async (projectData: Partial<ProjectInfo>) => {
  const response = await apiClient.post('/api/projects', projectData);
  return response.data;
};
```

### 文件操作
```typescript
const getFileContent = async (projectId: string, filePath: string) => {
  const response = await apiClient.get(`/api/projects/${projectId}/files`, {
    params: { path: filePath }
  });
  return response.data.data.content;
};

const saveFile = async (projectId: string, filePath: string, content: string) => {
  const response = await apiClient.post(`/api/projects/${projectId}/files`, {
    path: filePath,
    content: content
  });
  return response.data;
};
```

### 编译和调试
```typescript
const compileProject = async (projectId: string) => {
  const response = await apiClient.post(`/api/projects/${projectId}/compile`);
  return response.data;
};

const startDebugSession = async (projectId: string) => {
  const response = await apiClient.post(`/api/projects/${projectId}/debug/start`);
  return response.data;
};
```

## 🔄 WebSocket API

### 连接配置
```typescript
class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;

  constructor() {
    this.url = `ws://localhost:8080/ws`;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('WebSocket连接已建立');
        resolve();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket连接错误:', error);
        reject(error);
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data));
      };
    });
  }

  private handleMessage(message: any) {
    switch (message.type) {
      case 'compile_result':
        this.handleCompileResult(message.data);
        break;
      case 'debug_event':
        this.handleDebugEvent(message.data);
        break;
      default:
        console.log('未知消息类型:', message.type);
    }
  }
}
```

## 📝 错误处理

### 统一错误处理
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // 服务器响应错误
    return {
      code: error.response.status.toString(),
      message: error.response.data.message || '服务器错误',
      details: error.response.data
    };
  } else if (error.request) {
    // 网络错误
    return {
      code: 'NETWORK_ERROR',
      message: '网络连接失败，请检查网络设置',
    };
  } else {
    // 其他错误
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || '未知错误',
    };
  }
};
```

## 🔧 使用最佳实践

### 1. API调用封装
```typescript
// 创建专门的API服务类
class ExperimentService {
  async getAll(): Promise<ExperimentListItem[]> {
    try {
      const response = await apiClient.get('/api/experiments');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getById(id: string): Promise<ExperimentDetail> {
    try {
      const response = await apiClient.get(`/api/experiments/${id}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const experimentService = new ExperimentService();
```

### 2. React Hook集成
```typescript
const useExperiments = () => {
  const [experiments, setExperiments] = useState<ExperimentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        setLoading(true);
        const data = await experimentService.getAll();
        setExperiments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取实验列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, []);

  return { experiments, loading, error };
};
```

### 3. 类型安全
- 所有API接口都应该有TypeScript类型定义
- 使用泛型确保类型安全
- 运行时类型验证（可选）

---

**文档版本**: v1.0.0  
**最后更新**: 2025-01-14
