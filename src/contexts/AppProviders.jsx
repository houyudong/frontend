import React from 'react';
import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';
import { ProgressProvider } from './ProgressContext';

/**
 * AppProviders - 应用上下文提供者组合
 * 
 * 组合所有上下文提供者的组件，简化应用的上下文配置。
 * 
 * @component
 * @example
 * ```jsx
 * <AppProviders>
 *   <App />
 * </AppProviders>
 * ```
 */
const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <ProgressProvider>
          {children}
        </ProgressProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default AppProviders;
