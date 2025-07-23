/**
 * 通知中心入口组件
 * 
 * 集成通知图标和下拉菜单，支持所有用户角色
 */

import React, { useState } from 'react';
import NotificationIcon from './NotificationIcon';
import NotificationDropdown from './NotificationDropdown';

interface NotificationEntryProps {
  userRole: 'student' | 'teacher' | 'admin';
  userId: string;
  className?: string;
}

const NotificationEntry: React.FC<NotificationEntryProps> = ({
  userRole,
  userId,
  className = ''
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleIconClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* 通知图标 */}
      <div onClick={handleIconClick}>
        <NotificationIcon
          userRole={userRole}
          userId={userId}
          className="cursor-pointer"
        />
      </div>

      {/* 下拉菜单 */}
      <NotificationDropdown
        userRole={userRole}
        userId={userId}
        isOpen={isDropdownOpen}
        onClose={handleDropdownClose}
      />
    </div>
  );
};

export default NotificationEntry;
