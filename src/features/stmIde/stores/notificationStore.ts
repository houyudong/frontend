import { create } from 'zustand'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
}

const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = Date.now().toString()
    const newNotification = { ...notification, id }
    
    set(state => ({
      notifications: [...state.notifications, newNotification]
    }))

    // 自动移除通知
    const duration = notification.duration || 3000
    setTimeout(() => {
      get().removeNotification(id)
    }, duration + 300) // 额外300ms用于动画
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },

  success: (message, duration) => {
    get().addNotification({ message, type: 'success', duration })
  },

  error: (message, duration) => {
    get().addNotification({ message, type: 'error', duration })
  },

  warning: (message, duration) => {
    get().addNotification({ message, type: 'warning', duration })
  },

  info: (message, duration) => {
    get().addNotification({ message, type: 'info', duration })
  }
}))

export default useNotificationStore
