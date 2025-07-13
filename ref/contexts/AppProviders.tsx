import React from 'react';
import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';
import { ProgressProvider } from './ProgressContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * AppProviders - 应用上下文提供者组合
 *
 * 组合所有上下文提供者，确保正确的嵌套顺序
 *
 * @component
 * @example
 * ```tsx
 * <AppProviders>
 *   <App />
 * </AppProviders>
 * ```
 */
const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
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