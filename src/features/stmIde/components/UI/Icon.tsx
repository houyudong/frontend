import React from 'react'
import {
  File, Folder, FolderOpen, FileText, FileCode,
  Save, Copy, Clipboard, Edit, Trash2,
  Play, Pause, Square, ArrowDown, ArrowUp, ArrowRight,
  Settings, Hammer, Zap, Bug,
  ChevronRight, ChevronDown, RotateCcw,
  Plus, Minus, X, Search, Info,
  Check, AlertCircle, AlertTriangle, XCircle,
  Link, Unlink, HardDrive, GitBranch,
  Code2, FileType, Braces, Cpu, Wifi, Loader,
  FilePlus, FolderPlus, ChevronsUp, SaveAll,
  Terminal, List, Eye, Monitor, Activity
} from 'lucide-react'

const iconMap = {
  // 文件系统
  'file': File,
  'folder': Folder,
  'folder-open': FolderOpen,
  'file-text': FileText,
  'file-code': FileCode,
  'file-c': Code2,
  'file-h': Braces,
  'file-cpp': FileType,

  // 编辑操作
  'save': Save,
  'save-all': SaveAll,
  'copy': Copy,
  'paste': Clipboard,
  'edit': Edit,
  'trash': Trash2,

  // 调试控制
  'play': Play,
  'pause': Pause,
  'stop': Square,
  'square': Square,  // 添加square别名
  'step-into': ArrowDown,
  'step-over': ArrowRight,
  'step-out': ArrowUp,

  // 工具
  'settings': Settings,
  'hammer': Hammer,
  'flash': Zap,
  'bug': Bug,

  // 导航
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  'plus': Plus,
  'minus': Minus,
  'close': X,
  'search': Search,
  'refresh': RotateCcw,

  // 状态
  'check': Check,
  'error': XCircle,
  'warning': AlertTriangle,
  'info': Info,
  'alert': AlertCircle,
  'alert-circle': AlertCircle,

  // 设备
  'link': Link,
  'unlink': Unlink,
  'chip': HardDrive,
  'cpu': Cpu,
  'wifi': Wifi,
  'loader': Loader,
  'loading': Loader, // 添加loading别名

  // 文件操作
  'file-plus': FilePlus,
  'folder-plus': FolderPlus,
  'chevrons-up': ChevronsUp,

  // Git
  'git-branch': GitBranch,

  // 控制台专用图标
  'terminal': Terminal,
  'list': List,
  'eye': Eye,
  'monitor': Monitor,
  'activity': Activity
}

export interface IconProps {
  name: string
  size?: number
  className?: string
  color?: string
  onClick?: () => void
  title?: string
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 16,
  className = '',
  color,
  onClick,
  title
}) => {
  const IconComponent = iconMap[name as keyof typeof iconMap]

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return <File size={size} className={className} />
  }

  return (
    <IconComponent
      size={size}
      className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{ color }}
      onClick={onClick}
      title={title}
    />
  )
}

export default Icon
