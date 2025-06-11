import React, { useState, createContext, useContext, useEffect } from 'react';

// 创建Tabs上下文
const TabsContext = createContext({
  activeTab: '',
  setActiveTab: () => {},
});

/**
 * Tabs - 标签页组件
 * 
 * 用于在同一区域内组织和切换不同内容的标签页组件。
 * 
 * @component
 * @example
 * ```jsx
 * <Tabs defaultTab="tab1">
 *   <Tabs.List>
 *     <Tabs.Tab id="tab1">标签1</Tabs.Tab>
 *     <Tabs.Tab id="tab2">标签2</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panels>
 *     <Tabs.Panel id="tab1">标签1内容</Tabs.Panel>
 *     <Tabs.Panel id="tab2">标签2内容</Tabs.Panel>
 *   </Tabs.Panels>
 * </Tabs>
 * ```
 */
const Tabs = ({
  children,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'line',
  colorScheme = 'primary',
  size = 'md',
  orientation = 'horizontal',
  isFitted = false,
  className = '',
  ...props
}) => {
  // 内部状态用于非受控组件
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab);
  
  // 确定是受控还是非受控组件
  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;
  
  // 处理标签切换
  const handleTabChange = (tabId) => {
    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    
    if (onChange) {
      onChange(tabId);
    }
  };
  
  // 上下文值
  const contextValue = {
    activeTab,
    setActiveTab: handleTabChange,
    variant,
    colorScheme,
    size,
    orientation,
    isFitted,
  };
  
  return (
    <TabsContext.Provider value={contextValue}>
      <div 
        className={`tabs-container ${orientation === 'vertical' ? 'flex' : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

/**
 * Tabs.List - 标签列表组件
 */
const TabList = ({ children, className = '', ...props }) => {
  const { orientation, isFitted } = useContext(TabsContext);
  
  // 方向样式
  const orientationClasses = orientation === 'vertical'
    ? 'flex-col border-r border-gray-200'
    : 'border-b border-gray-200';
  
  // 是否等宽
  const fittedClasses = isFitted ? 'grid grid-flow-col auto-cols-fr' : 'flex';
  
  // 基础样式
  const baseClasses = orientation === 'vertical'
    ? 'flex'
    : fittedClasses;
  
  return (
    <div 
      className={`tabs-list ${baseClasses} ${orientationClasses} ${className}`}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Tabs.Tab - 标签组件
 */
const Tab = ({ 
  children, 
  id, 
  disabled = false,
  className = '', 
  ...props 
}) => {
  const { activeTab, setActiveTab, variant, colorScheme, size, orientation } = useContext(TabsContext);
  const isActive = activeTab === id;
  
  // 变体样式映射
  const variantClasses = {
    line: {
      base: 'border-b-2 border-transparent',
      active: {
        primary: 'border-primary-500 text-primary-600',
        secondary: 'border-secondary-500 text-secondary-600',
        success: 'border-success-500 text-success-600',
        danger: 'border-danger-500 text-danger-600',
        warning: 'border-warning-500 text-warning-600',
        info: 'border-info-500 text-info-600',
      },
      inactive: 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
    },
    enclosed: {
      base: 'border-b border-transparent rounded-t-md',
      active: {
        primary: 'bg-white border border-b-0 border-gray-200 text-primary-600',
        secondary: 'bg-white border border-b-0 border-gray-200 text-secondary-600',
        success: 'bg-white border border-b-0 border-gray-200 text-success-600',
        danger: 'bg-white border border-b-0 border-gray-200 text-danger-600',
        warning: 'bg-white border border-b-0 border-gray-200 text-warning-600',
        info: 'bg-white border border-b-0 border-gray-200 text-info-600',
      },
      inactive: 'bg-gray-50 text-gray-500 hover:text-gray-700',
    },
    solid: {
      base: 'rounded-md',
      active: {
        primary: 'bg-primary-500 text-white',
        secondary: 'bg-secondary-500 text-white',
        success: 'bg-success-500 text-white',
        danger: 'bg-danger-500 text-white',
        warning: 'bg-warning-500 text-black',
        info: 'bg-info-500 text-white',
      },
      inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    },
  };
  
  // 尺寸样式映射
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  // 禁用样式
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer';
  
  // 基础样式
  const baseClasses = 'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';
  
  // 活动状态样式
  const activeClasses = isActive 
    ? variantClasses[variant]?.active[colorScheme] || variantClasses.line.active.primary
    : variantClasses[variant]?.inactive || variantClasses.line.inactive;
  
  // 组合标签样式
  const tabClasses = `
    ${baseClasses} 
    ${variantClasses[variant]?.base || variantClasses.line.base} 
    ${activeClasses} 
    ${sizeClasses[size] || sizeClasses.md} 
    ${disabledClasses} 
    ${className}
  `;
  
  // 处理标签点击
  const handleClick = () => {
    if (!disabled) {
      setActiveTab(id);
    }
  };
  
  return (
    <button
      type="button"
      role="tab"
      id={`tab-${id}`}
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      disabled={disabled}
      className={tabClasses}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Tabs.Panels - 标签面板容器组件
 */
const TabPanels = ({ children, className = '', ...props }) => {
  const { orientation } = useContext(TabsContext);
  
  // 方向样式
  const orientationClasses = orientation === 'vertical'
    ? 'flex-1 pl-4'
    : 'mt-4';
  
  return (
    <div className={`tabs-panels ${orientationClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Tabs.Panel - 标签面板组件
 */
const TabPanel = ({ children, id, className = '', ...props }) => {
  const { activeTab } = useContext(TabsContext);
  const isActive = activeTab === id;
  
  // 如果不是活动面板，不渲染内容
  if (!isActive) return null;
  
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      className={`tabs-panel ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// 组合组件
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

export default Tabs;
