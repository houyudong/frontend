import React from 'react';
import { AuthProvider } from './AuthProvider';
import { RoleProvider } from './RoleProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * AppProviders - 应用上下文提供者组合
 *
 * 组合所有上下文提供者，确保正确的嵌套顺序
 * 遵循奥卡姆原则：简洁而不简单的Provider组合
 *
 * @component
 * @example
 * ```tsx
 * <AppProviders>
 *   <App />
 * </AppProviders>
 * ```
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <RoleProvider>
        {children}
      </RoleProvider>
    </AuthProvider>
  );
};
