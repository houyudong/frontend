import { Permission, UserRole, PermissionConfig, PermissionTemplate, PermissionAuditLog } from '../types/Permission';

// 基础权限定义
export const mockPermissions: Permission[] = [
  // 学生管理权限
  {
    id: 'perm_1',
    name: '添加学生',
    description: '允许创建新的学生账户',
    resource: 'student',
    action: 'create',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm_2',
    name: '查看学生信息',
    description: '允许查看学生的基本信息和学习进度',
    resource: 'student',
    action: 'read',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm_3',
    name: '编辑学生信息',
    description: '允许修改学生的基本信息',
    resource: 'student',
    action: 'update',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm_4',
    name: '删除学生',
    description: '允许删除学生账户',
    resource: 'student',
    action: 'delete',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 课程管理权限
  {
    id: 'perm_5',
    name: '创建课程',
    description: '允许创建新的课程',
    resource: 'course',
    action: 'create',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm_6',
    name: '查看课程',
    description: '允许查看课程内容和信息',
    resource: 'course',
    action: 'read',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm_7',
    name: '编辑课程',
    description: '允许修改课程内容和设置',
    resource: 'course',
    action: 'update',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm_8',
    name: '删除课程',
    description: '允许删除课程',
    resource: 'course',
    action: 'delete',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 班级管理权限
  {
    id: 'perm_9',
    name: '创建班级',
    description: '允许创建新的班级',
    resource: 'class',
    action: 'create',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm_10',
    name: '管理班级',
    description: '允许管理班级成员和设置',
    resource: 'class',
    action: 'manage',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 实验管理权限
  {
    id: 'perm_11',
    name: '创建实验',
    description: '允许创建新的实验项目',
    resource: 'experiment',
    action: 'create',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm_12',
    name: '管理实验',
    description: '允许管理实验内容和设置',
    resource: 'experiment',
    action: 'manage',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 成绩管理权限
  {
    id: 'perm_13',
    name: '查看成绩',
    description: '允许查看学生成绩',
    resource: 'grade',
    action: 'read',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm_14',
    name: '编辑成绩',
    description: '允许修改学生成绩',
    resource: 'grade',
    action: 'update',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 报告权限
  {
    id: 'perm_15',
    name: '导出报告',
    description: '允许导出各类报告',
    resource: 'report',
    action: 'export',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 系统管理权限
  {
    id: 'perm_16',
    name: '系统管理',
    description: '允许管理系统设置和配置',
    resource: 'system',
    action: 'manage',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// 用户角色定义
export const mockUserRoles: UserRole[] = [
  {
    id: 'role_1',
    name: 'admin',
    displayName: '系统管理员',
    description: '拥有系统的完全访问权限',
    permissions: mockPermissions, // 管理员拥有所有权限
    userCount: 3,
    isSystem: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'role_2',
    name: 'teacher',
    displayName: '教师',
    description: '教学相关功能的访问权限',
    permissions: [
      mockPermissions[0], // 添加学生
      mockPermissions[1], // 查看学生信息
      mockPermissions[2], // 编辑学生信息
      mockPermissions[4], // 创建课程
      mockPermissions[5], // 查看课程
      mockPermissions[6], // 编辑课程
      mockPermissions[8], // 创建班级
      mockPermissions[9], // 管理班级
      mockPermissions[10], // 创建实验
      mockPermissions[11], // 管理实验
      mockPermissions[12], // 查看成绩
      mockPermissions[13], // 编辑成绩
      mockPermissions[14]  // 导出报告
    ],
    userCount: 15,
    isSystem: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'role_3',
    name: 'student',
    displayName: '学生',
    description: '学习相关功能的访问权限',
    permissions: [
      mockPermissions[5], // 查看课程
      mockPermissions[12] // 查看成绩
    ],
    userCount: 120,
    isSystem: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// 权限配置
export const mockPermissionConfigs: PermissionConfig[] = [
  {
    id: 'config_1',
    category: 'teacher',
    name: '教师可添加学生',
    description: '允许教师创建新的学生账户',
    defaultValue: true,
    currentValue: true,
    resource: 'student',
    action: 'create',
    affectedRoles: ['teacher'],
    isGlobal: false,
    updatedAt: '2024-01-15T10:30:00Z',
    updatedBy: 'admin'
  },
  {
    id: 'config_2',
    name: '教师可创建课程',
    category: 'teacher',
    description: '允许教师创建新的课程',
    defaultValue: true,
    currentValue: true,
    resource: 'course',
    action: 'create',
    affectedRoles: ['teacher'],
    isGlobal: false,
    updatedAt: '2024-01-15T10:30:00Z',
    updatedBy: 'admin'
  },
  {
    id: 'config_3',
    category: 'teacher',
    name: '教师可创建班级',
    description: '允许教师创建和管理班级',
    defaultValue: true,
    currentValue: false,
    resource: 'class',
    action: 'create',
    affectedRoles: ['teacher'],
    isGlobal: false,
    updatedAt: '2024-01-15T10:30:00Z',
    updatedBy: 'admin'
  },
  {
    id: 'config_4',
    category: 'teacher',
    name: '教师可删除学生',
    description: '允许教师删除学生账户',
    defaultValue: false,
    currentValue: false,
    resource: 'student',
    action: 'delete',
    affectedRoles: ['teacher'],
    isGlobal: false,
    updatedAt: '2024-01-15T10:30:00Z',
    updatedBy: 'admin'
  },
  {
    id: 'config_5',
    category: 'student',
    name: '学生可查看其他学生信息',
    description: '允许学生查看同班其他学生的基本信息',
    defaultValue: false,
    currentValue: false,
    resource: 'student',
    action: 'read',
    affectedRoles: ['student'],
    isGlobal: false,
    updatedAt: '2024-01-15T10:30:00Z',
    updatedBy: 'admin'
  }
];

// 权限模板
export const mockPermissionTemplates: PermissionTemplate[] = [
  {
    id: 'template_1',
    name: '基础教师权限',
    description: '适用于新入职教师的基础权限模板',
    targetRole: 'teacher',
    permissions: [
      mockPermissions[1], // 查看学生信息
      mockPermissions[5], // 查看课程
      mockPermissions[6], // 编辑课程
      mockPermissions[12], // 查看成绩
      mockPermissions[13]  // 编辑成绩
    ],
    isBuiltIn: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'template_2',
    name: '高级教师权限',
    description: '适用于资深教师的扩展权限模板',
    targetRole: 'teacher',
    permissions: [
      mockPermissions[0], // 添加学生
      mockPermissions[1], // 查看学生信息
      mockPermissions[2], // 编辑学生信息
      mockPermissions[4], // 创建课程
      mockPermissions[5], // 查看课程
      mockPermissions[6], // 编辑课程
      mockPermissions[8], // 创建班级
      mockPermissions[9], // 管理班级
      mockPermissions[10], // 创建实验
      mockPermissions[11], // 管理实验
      mockPermissions[12], // 查看成绩
      mockPermissions[13], // 编辑成绩
      mockPermissions[14]  // 导出报告
    ],
    isBuiltIn: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// 权限审计日志
export const mockPermissionAuditLogs: PermissionAuditLog[] = [
  {
    id: 'log_1',
    action: 'modify',
    targetType: 'permission',
    targetId: 'config_3',
    targetName: '教师可创建班级',
    operatorId: 'admin_1',
    operatorName: '系统管理员',
    details: '将权限从启用改为禁用',
    timestamp: '2024-01-15T10:30:00Z',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'log_2',
    action: 'grant',
    targetType: 'user',
    targetId: 'teacher_5',
    targetName: '张老师',
    operatorId: 'admin_1',
    operatorName: '系统管理员',
    details: '授予"创建实验"权限',
    timestamp: '2024-01-14T15:20:00Z',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'log_3',
    action: 'create',
    targetType: 'role',
    targetId: 'role_custom_1',
    targetName: '助教',
    operatorId: 'admin_1',
    operatorName: '系统管理员',
    details: '创建新的用户角色',
    timestamp: '2024-01-13T09:15:00Z',
    ipAddress: '192.168.1.100'
  }
];
