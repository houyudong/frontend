/**
 * 数据库服务 - 连接Backend数据库获取真实用户和项目数据
 * 替代硬编码的默认配置
 */

import { getBackendApiUrl } from '../config'

// 数据库用户信息接口（匹配Backend User模型）
export interface DatabaseUser {
  id: string
  username: string
  email: string
  full_name: string
  user_type: 'student' | 'teacher' | 'admin' | 'competitor'
  platform_access: string[]
  status: 'active' | 'inactive'
  school_name?: string
  class_name?: string
  student_id?: string
  preferences?: any
  created_at: string
  updated_at: string
}

// 数据库项目信息接口（匹配Backend Project模型）
export interface DatabaseProject {
  id: string
  user_id: string
  platform: 'course' | 'competition'
  session_data?: any
  description?: string
  programming_language: 'c' | 'python' | 'micropython'
  chip_model: string
  project_config: any
  last_compile_success: boolean
  last_compile_time?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// 数据库查询结果接口
interface DatabaseQueryResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * 数据库服务类
 */
class DatabaseService {
  private cache = {
    users: new Map<string, DatabaseUser>(),
    projects: new Map<string, DatabaseProject[]>(),
    currentUser: null as DatabaseUser | null,
    lastUpdate: 0
  }

  private readonly CACHE_TTL = 5 * 60 * 1000 // 5分钟缓存

  /**
   * 获取所有用户列表
   */
  async getAllUsers(): Promise<DatabaseUser[]> {
    try {
      const response = await fetch(`${getBackendApiUrl()}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Bypass-Auth': 'true' // 开发模式绕过认证
        }
      })

      if (response.ok) {
        const result = await response.json()
        const users = result.data || result

        // 更新缓存
        users.forEach((user: DatabaseUser) => {
          this.cache.users.set(user.id, user)
        })
        this.cache.lastUpdate = Date.now()

        console.log(`📊 从数据库获取了 ${users.length} 个用户`)
        return users
      } else {
        throw new Error(`获取用户列表失败: ${response.statusText}`)
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
      return []
    }
  }

  /**
   * 根据用户名获取用户
   */
  async getUserByUsername(username: string): Promise<DatabaseUser | null> {
    try {
      // 先检查缓存
      for (const user of this.cache.users.values()) {
        if (user.username === username) {
          return user
        }
      }

      // 从数据库查询
      const response = await fetch(`${getBackendApiUrl()}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password: username // 开发模式：密码等于用户名
        })
      })

      if (response.ok) {
        const result = await response.json()
        const userData = result.data?.user

        if (userData) {
          const user: DatabaseUser = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            full_name: userData.full_name,
            user_type: userData.user_type,
            platform_access: JSON.parse(userData.platform_access || '["course"]'),
            status: userData.status,
            school_name: userData.school_name,
            class_name: userData.class_name,
            student_id: userData.student_id,
            preferences: userData.preferences,
            created_at: userData.created_at,
            updated_at: userData.updated_at
          }

          // 更新缓存
          this.cache.users.set(user.id, user)
          this.cache.currentUser = user

          console.log(`👤 从数据库获取用户: ${user.username} (${user.id})`)
          return user
        }
      }

      return null
    } catch (error) {
      console.error('获取用户失败:', error)
      return null
    }
  }

  /**
   * 根据用户ID获取用户
   */
  async getUserById(userId: string): Promise<DatabaseUser | null> {
    try {
      // 先检查缓存
      if (this.cache.users.has(userId)) {
        return this.cache.users.get(userId)!
      }

      const response = await fetch(`${getBackendApiUrl()}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Bypass-Auth': 'true',
          'X-User-ID': userId
        }
      })

      if (response.ok) {
        const result = await response.json()
        const userData = result.data || result

        const user: DatabaseUser = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          full_name: userData.full_name,
          user_type: userData.user_type,
          platform_access: JSON.parse(userData.platform_access || '["course"]'),
          status: userData.status,
          school_name: userData.school_name,
          class_name: userData.class_name,
          student_id: userData.student_id,
          preferences: userData.preferences,
          created_at: userData.created_at,
          updated_at: userData.updated_at
        }

        // 更新缓存
        this.cache.users.set(user.id, user)

        console.log(`👤 从数据库获取用户: ${user.username} (${user.id})`)
        return user
      }

      return null
    } catch (error) {
      console.error('获取用户失败:', error)
      return null
    }
  }



  /**
   * 获取用户的项目列表
   */
  async getUserProjects(userId: string): Promise<DatabaseProject[]> {
    try {
      // 先检查缓存
      if (this.cache.projects.has(userId)) {
        return this.cache.projects.get(userId)!
      }

      const response = await fetch(`${getBackendApiUrl()}/users/${userId}/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Bypass-Auth': 'true',
          'X-User-ID': userId
        }
      })

      if (response.ok) {
        const result = await response.json()
        const projects = result.data || result

        const projectList: DatabaseProject[] = projects.map((p: any) => ({
          id: p.id,
          user_id: p.user_id,
          platform: p.platform,
          session_data: p.session_data,
          description: p.description,
          programming_language: p.programming_language,
          chip_model: p.chip_model,
          project_config: typeof p.project_config === 'string'
            ? JSON.parse(p.project_config)
            : p.project_config,
          last_compile_success: p.last_compile_success,
          last_compile_time: p.last_compile_time,
          is_active: p.is_active,
          created_at: p.created_at,
          updated_at: p.updated_at
        }))

        // 更新缓存
        this.cache.projects.set(userId, projectList)

        console.log(`📁 从数据库获取了用户 ${userId} 的 ${projectList.length} 个项目`)
        return projectList
      }

      return []
    } catch (error) {
      console.error('获取用户项目失败:', error)
      return []
    }
  }

  /**
   * 获取默认测试用户
   */
  async getDefaultTestUser(): Promise<DatabaseUser | null> {
    // 优先尝试获取test_user
    let user = await this.getUserByUsername('test_user')
    if (user) return user

    // 如果没有test_user，尝试获取admin用户
    user = await this.getUserByUsername('admin')
    if (user) return user

    // 如果都没有，获取第一个可用用户
    const users = await this.getAllUsers()
    if (users.length > 0) {
      return users[0]
    }

    return null
  }

  /**
   * 获取用户的默认项目
   */
  async getUserDefaultProject(userId: string): Promise<DatabaseProject | null> {
    const projects = await this.getUserProjects(userId)

    if (projects.length === 0) {
      return null
    }

    // 优先返回名为'test'的项目
    const testProject = projects.find(p => p.id === 'test')
    if (testProject) return testProject

    // 否则返回第一个活跃项目
    const activeProject = projects.find(p => p.is_active)
    if (activeProject) return activeProject

    // 最后返回第一个项目
    return projects[0]
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.users.clear()
    this.cache.projects.clear()
    this.cache.currentUser = null
    this.cache.lastUpdate = 0
    console.log('🧹 数据库缓存已清除')
  }

  /**
   * 检查缓存是否过期
   */
  private isCacheExpired(): boolean {
    return Date.now() - this.cache.lastUpdate > this.CACHE_TTL
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats(): { users: number; projects: number; lastUpdate: number } {
    return {
      users: this.cache.users.size,
      projects: this.cache.projects.size,
      lastUpdate: this.cache.lastUpdate
    }
  }
}

// 创建全局实例
const databaseService = new DatabaseService()

export default databaseService
