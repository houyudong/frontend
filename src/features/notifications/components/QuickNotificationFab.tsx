/**
 * 快速发送通知浮动按钮组件
 * 
 * 提供快速创建和发送通知的功能
 */

import React, { useState } from 'react';
import NotificationEditor from './NotificationEditor';

interface QuickNotificationFabProps {
  userRole: 'teacher' | 'admin';
  userId: string;
  onNotificationSent?: () => void;
}

const QuickNotificationFab: React.FC<QuickNotificationFabProps> = ({
  userRole,
  userId,
  onNotificationSent
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  // 快速通知模板
  const quickTemplates = userRole === 'admin' ? [
    {
      id: 'system_maintenance',
      title: '系统维护通知',
      icon: '🛠️',
      color: 'bg-orange-500 hover:bg-orange-600',
      template: {
        type: 'maintenance' as const,
        priority: 'high' as const,
        title: '系统维护通知',
        content: '系统将于{date}进行维护升级，预计维护时间为{duration}，期间可能无法正常访问，请提前做好准备。'
      }
    },
    {
      id: 'urgent_announcement',
      title: '紧急公告',
      icon: '🚨',
      color: 'bg-red-500 hover:bg-red-600',
      template: {
        type: 'announcement' as const,
        priority: 'urgent' as const,
        title: '紧急公告',
        content: '请注意：{content}'
      }
    },
    {
      id: 'feature_update',
      title: '功能更新',
      icon: '✨',
      color: 'bg-purple-500 hover:bg-purple-600',
      template: {
        type: 'system' as const,
        priority: 'normal' as const,
        title: '新功能发布',
        content: '我们很高兴地宣布新功能{feature}已经上线！{description}欢迎大家体验使用。'
      }
    }
  ] : [
    {
      id: 'assignment_reminder',
      title: '作业提醒',
      icon: '📝',
      color: 'bg-blue-500 hover:bg-blue-600',
      template: {
        type: 'assignment' as const,
        priority: 'normal' as const,
        title: '作业提醒',
        content: '亲爱的同学们，作业《{assignment_name}》将于{due_date}截止提交，请及时完成并提交。'
      }
    },
    {
      id: 'exam_notice',
      title: '考试通知',
      icon: '📊',
      color: 'bg-green-500 hover:bg-green-600',
      template: {
        type: 'announcement' as const,
        priority: 'high' as const,
        title: '考试通知',
        content: '请注意：{course_name}考试将于{exam_date}在{location}举行，请同学们做好准备。'
      }
    },
    {
      id: 'class_announcement',
      title: '课程公告',
      icon: '📢',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      template: {
        type: 'course' as const,
        priority: 'normal' as const,
        title: '课程公告',
        content: '{course_name}课程通知：{content}'
      }
    }
  ];

  // 处理快速模板选择
  const handleQuickTemplate = (template: any) => {
    setShowEditor(true);
    setShowQuickMenu(false);
    // 这里可以传递模板数据给编辑器
  };

  // 处理通知保存
  const handleSaveNotification = async (notificationData: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('快速发送通知:', notificationData);
      alert('通知发送成功！');
      onNotificationSent?.();
    } catch (error) {
      console.error('发送通知失败:', error);
      throw error;
    }
  };

  return (
    <>
      {/* 浮动按钮组 - 更现代化的设计 */}
      <div className="fixed bottom-8 right-8 z-40">
        {/* 快速模板菜单 - 更现代化的设计 */}
        {showQuickMenu && (
          <div className="mb-6 space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            {quickTemplates.map((template, index) => (
              <button
                key={template.id}
                onClick={() => handleQuickTemplate(template.template)}
                className={`group flex items-center space-x-4 px-6 py-4 text-white rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${template.color} relative overflow-hidden backdrop-blur-sm`}
                title={template.title}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'slideInRight 0.3s ease-out forwards'
                }}
              >
                {/* 按钮内部光效 */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* 图标容器 */}
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl filter drop-shadow-sm">{template.icon}</span>
                </div>

                {/* 文字 */}
                <span className="text-sm font-semibold whitespace-nowrap relative z-10">{template.title}</span>

                {/* 右侧箭头 */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 relative z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            ))}

            {/* 自定义通知按钮 - 更现代化的设计 */}
            <button
              onClick={() => {
                setShowEditor(true);
                setShowQuickMenu(false);
              }}
              className={`group flex items-center space-x-4 px-6 py-4 text-white rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden backdrop-blur-sm ${
                userRole === 'admin'
                  ? 'bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800'
                  : 'bg-gradient-to-r from-gray-600 to-slate-700 hover:from-gray-700 hover:to-slate-800'
              }`}
              title="自定义通知"
              style={{
                animationDelay: `${quickTemplates.length * 50}ms`,
                animation: 'slideInRight 0.3s ease-out forwards'
              }}
            >
              {/* 按钮内部光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* 图标容器 */}
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl filter drop-shadow-sm">✏️</span>
              </div>

              {/* 文字 */}
              <span className="text-sm font-semibold whitespace-nowrap relative z-10">自定义通知</span>

              {/* 右侧箭头 */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 relative z-10">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* 主按钮 - 更现代化的设计 */}
        <div className="flex items-center space-x-4">
          {/* 快速菜单切换按钮 - 更现代化的设计 */}
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className={`group relative p-4 text-white rounded-2xl shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl overflow-hidden ${
              showQuickMenu
                ? 'bg-gradient-to-br from-slate-600 to-gray-700'
                : userRole === 'admin'
                  ? 'bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
            }`}
            title="快速模板"
          >
            {/* 按钮内部光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* 脉冲动画背景 */}
            <div className={`absolute inset-0 rounded-2xl animate-pulse ${
              showQuickMenu ? 'bg-white/10' : 'bg-white/5'
            }`}></div>

            <svg
              className={`w-6 h-6 transition-all duration-300 relative z-10 ${
                showQuickMenu ? 'rotate-45 scale-90' : 'rotate-0 scale-100'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>

          {/* 主创建按钮 - 更现代化的设计 */}
          <button
            onClick={() => {
              setShowEditor(true);
              setShowQuickMenu(false);
            }}
            className={`group relative p-5 text-white rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl overflow-hidden ${
              userRole === 'admin'
                ? 'bg-gradient-to-br from-rose-500 via-pink-600 to-red-600 hover:from-rose-600 hover:via-pink-700 hover:to-red-700'
                : 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700'
            }`}
            title="创建通知"
          >
            {/* 按钮内部光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* 脉冲动画背景 */}
            <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse"></div>

            {/* 旋转的背景装饰 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>

            <svg className="w-7 h-7 relative z-10 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 背景遮罩 */}
      {showQuickMenu && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-20"
          onClick={() => setShowQuickMenu(false)}
        />
      )}

      {/* 通知编辑器 */}
      {showEditor && (
        <NotificationEditor
          userRole={userRole}
          userId={userId}
          onClose={() => setShowEditor(false)}
          onSave={handleSaveNotification}
        />
      )}
    </>
  );
};

export default QuickNotificationFab;
