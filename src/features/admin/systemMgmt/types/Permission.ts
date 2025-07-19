// 权限类型定义
export type PermissionAction = 
  | 'create' 
  | 'read' 
  | 'update' 
  | 'delete' 
  | 'manage' 
  | 'assign' 
  | 'export' 
  | 'import';

export type ResourceType = 
  | 'student' 
  | 'course' 
  | 'class' 
  | 'experiment' 
  | 'assignment' 
  | 'grade' 
  | 'report' 
  | 'system';

// 单个权限定义
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: ResourceType;
  action: PermissionAction;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 权限组/角色权限
export interface RolePermission {
  id: string;
  roleId: string;
  roleName: string;
  permissions: Permission[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// 用户角色定义
export interface UserRole {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  isSystem: boolean; // 系统内置角色不可删除
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 权限配置项
export interface PermissionConfig {
  id: string;
  category: 'teacher' | 'student' | 'system';
  name: string;
  description: string;
  defaultValue: boolean;
  currentValue: boolean;
  resource: ResourceType;
  action: PermissionAction;
  affectedRoles: string[];
  isGlobal: boolean; // 是否为全局权限
  updatedAt: string;
  updatedBy: string;
}

// 权限模板
export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  targetRole: 'teacher' | 'student';
  permissions: Permission[];
  isBuiltIn: boolean;
  createdAt: string;
}

// 权限审计日志
export interface PermissionAuditLog {
  id: string;
  action: 'grant' | 'revoke' | 'modify' | 'create' | 'delete';
  targetType: 'user' | 'role' | 'permission';
  targetId: string;
  targetName: string;
  operatorId: string;
  operatorName: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

// 权限检查结果
export interface PermissionCheckResult {
  hasPermission: boolean;
  reason?: string;
  requiredPermissions: Permission[];
  userPermissions: Permission[];
}

// 权限管理表单数据
export interface PermissionFormData {
  name: string;
  description: string;
  resource: ResourceType;
  action: PermissionAction;
  isActive: boolean;
}

export interface RoleFormData {
  name: string;
  displayName: string;
  description: string;
  permissions: string[]; // permission IDs
  isActive: boolean;
}

// 权限配置表单数据
export interface PermissionConfigFormData {
  category: 'teacher' | 'student' | 'system';
  name: string;
  description: string;
  currentValue: boolean;
  resource: ResourceType;
  action: PermissionAction;
  isGlobal: boolean;
}

// API 响应类型
export interface PermissionResponse {
  permissions: Permission[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RoleResponse {
  roles: UserRole[];
  total: number;
  page: number;
  pageSize: number;
}

// 权限统计
export interface PermissionStats {
  totalPermissions: number;
  activePermissions: number;
  totalRoles: number;
  activeRoles: number;
  totalUsers: number;
  recentChanges: number;
}
