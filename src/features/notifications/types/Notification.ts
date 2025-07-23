/**
 * 通知系统类型定义
 */

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  content: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  senderId?: string;
  senderName?: string;
  senderRole?: UserRole;
  recipientId?: string;
  recipientIds?: string[];
  targetAudience?: TargetAudience;
  createdAt: string;
  scheduledAt?: string;
  readAt?: string;
  expiresAt?: string;
  metadata?: NotificationMetadata;
  actions?: NotificationAction[];
  attachments?: NotificationAttachment[];
}

export type NotificationType = 
  | 'system'           // 系统通知
  | 'achievement'      // 成就解锁
  | 'reminder'         // 学习提醒
  | 'assignment'       // 作业通知
  | 'announcement'     // 公告通知
  | 'grade'           // 成绩通知
  | 'course'          // 课程通知
  | 'experiment'      // 实验通知
  | 'discussion'      // 讨论通知
  | 'deadline'        // 截止日期提醒
  | 'maintenance'     // 系统维护
  | 'security';       // 安全提醒

export type NotificationCategory = 
  | 'academic'        // 学术相关
  | 'administrative'  // 管理相关
  | 'social'         // 社交相关
  | 'technical'      // 技术相关
  | 'personal';      // 个人相关

export type NotificationPriority = 
  | 'low'            // 低优先级
  | 'normal'         // 普通优先级
  | 'high'           // 高优先级
  | 'urgent';        // 紧急

export type NotificationStatus = 
  | 'draft'          // 草稿
  | 'scheduled'      // 已安排
  | 'sent'           // 已发送
  | 'delivered'      // 已送达
  | 'read'           // 已读
  | 'archived'       // 已归档
  | 'failed';        // 发送失败

export type UserRole = 'student' | 'teacher' | 'admin';

export type TargetAudience = 
  | 'all_students'   // 所有学生
  | 'all_teachers'   // 所有教师
  | 'all_users'      // 所有用户
  | 'class_students' // 班级学生
  | 'course_students'// 课程学生
  | 'specific_users' // 指定用户
  | 'role_based';    // 基于角色

export interface NotificationMetadata {
  achievementId?: string;
  courseId?: string;
  experimentId?: string;
  assignmentId?: string;
  classId?: string;
  discussionId?: string;
  relatedUrl?: string;
  imageUrl?: string;
  iconUrl?: string;
  customData?: Record<string, any>;
}

export interface NotificationAction {
  id: string;
  label: string;
  type: 'button' | 'link';
  url?: string;
  action?: string;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface NotificationAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  content: string;
  priority: NotificationPriority;
  isActive: boolean;
  variables: TemplateVariable[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  description: string;
  required: boolean;
  defaultValue?: any;
}

export interface NotificationSettings {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  categories: {
    [key in NotificationCategory]: {
      enabled: boolean;
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byCategory: Record<NotificationCategory, number>;
  byPriority: Record<NotificationPriority, number>;
  recentActivity: NotificationActivity[];
}

export interface NotificationActivity {
  date: string;
  sent: number;
  delivered: number;
  read: number;
  clicked: number;
}

export interface NotificationFilter {
  types?: NotificationType[];
  categories?: NotificationCategory[];
  priorities?: NotificationPriority[];
  status?: NotificationStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  senderId?: string;
  recipientId?: string;
  search?: string;
  unreadOnly?: boolean;
  sortBy?: 'createdAt' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface BulkNotificationRequest {
  templateId?: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  content: string;
  priority: NotificationPriority;
  targetAudience: TargetAudience;
  recipientIds?: string[];
  classIds?: string[];
  courseIds?: string[];
  scheduledAt?: string;
  expiresAt?: string;
  metadata?: NotificationMetadata;
  actions?: NotificationAction[];
  attachments?: NotificationAttachment[];
}

export interface NotificationDeliveryStatus {
  notificationId: string;
  recipientId: string;
  status: NotificationStatus;
  deliveredAt?: string;
  readAt?: string;
  clickedAt?: string;
  errorMessage?: string;
}

// 成就解锁通知特定类型
export interface AchievementNotification extends Notification {
  type: 'achievement';
  metadata: {
    achievementId: string;
    achievementName: string;
    achievementIcon: string;
    achievementLevel: string;
    points: number;
  };
}

// 学习提醒通知特定类型
export interface ReminderNotification extends Notification {
  type: 'reminder';
  metadata: {
    reminderType: 'study' | 'assignment' | 'exam' | 'deadline';
    courseId?: string;
    courseName?: string;
    dueDate?: string;
    relatedUrl?: string;
  };
}
