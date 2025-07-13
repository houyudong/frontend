import React from 'react'
import Toast from './Toast'
import useNotificationStore from '../../stores/notificationStore'

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore()

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      pointerEvents: 'none' // 允许点击穿透到下层元素
    }}>
      {notifications.map((notification) => (
        <div key={notification.id} style={{ pointerEvents: 'auto' }}>
          <Toast
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  )
}

export default NotificationContainer
