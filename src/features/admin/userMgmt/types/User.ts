export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  
  // 学生特有字段
  coursesCompleted?: number;
  experimentsCompleted?: number;
  
  // 教师特有字段
  studentsManaged?: number;
}

export interface UserFormData {
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive' | 'suspended';
  password?: string;
  confirmPassword?: string;
}

export interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user: User | null;
  mode: 'create' | 'edit';
}
