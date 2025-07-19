import { User } from '../types/User';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    fullName: '系统管理员',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    username: 'teacher1',
    email: 'teacher1@example.com',
    fullName: '张老师',
    role: 'teacher',
    status: 'active',
    lastLogin: '2024-01-15T09:15:00Z',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    studentsManaged: 25
  },
  {
    id: '3',
    username: 'teacher2',
    email: 'teacher2@example.com',
    fullName: '李老师',
    role: 'teacher',
    status: 'active',
    lastLogin: '2024-01-14T16:45:00Z',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    studentsManaged: 30
  },
  {
    id: '4',
    username: 'student1',
    email: 'student1@example.com',
    fullName: '王小明',
    role: 'student',
    status: 'active',
    lastLogin: '2024-01-15T11:20:00Z',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-15T11:20:00Z',
    coursesCompleted: 3,
    experimentsCompleted: 8
  },
  {
    id: '5',
    username: 'student2',
    email: 'student2@example.com',
    fullName: '刘小红',
    role: 'student',
    status: 'active',
    lastLogin: '2024-01-15T08:30:00Z',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
    coursesCompleted: 2,
    experimentsCompleted: 5
  },
  {
    id: '6',
    username: 'student3',
    email: 'student3@example.com',
    fullName: '陈小华',
    role: 'student',
    status: 'inactive',
    lastLogin: '2024-01-10T14:20:00Z',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    coursesCompleted: 1,
    experimentsCompleted: 2
  },
  {
    id: '7',
    username: 'student4',
    email: 'student4@example.com',
    fullName: '赵小强',
    role: 'student',
    status: 'active',
    lastLogin: '2024-01-15T13:45:00Z',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T13:45:00Z',
    coursesCompleted: 4,
    experimentsCompleted: 12
  },
  {
    id: '8',
    username: 'student5',
    email: 'student5@example.com',
    fullName: '孙小丽',
    role: 'student',
    status: 'suspended',
    lastLogin: '2024-01-08T10:15:00Z',
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-08T10:15:00Z',
    coursesCompleted: 0,
    experimentsCompleted: 1
  }
];
