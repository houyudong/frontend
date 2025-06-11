import { useLocation } from 'react-router-dom'
import { Suspense } from 'react'
import { AppRouter } from './routes'
import { MainLayout, AuthLayout, WebIDELayout } from './components/layout'
import { Spinner } from './components/ui'
import './styles/login-animations.css'

function App() {
  const location = useLocation()

  // 加载中组件
  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="xl" color="primary" />
    </div>
  );

  // 根据路径选择布局
  const getLayout = () => {
    // 登录页直接渲染，不使用布局
    if (location.pathname === '/login') {
      return <AppRouter />;
    }

    // WebIDE页面使用WebIDELayout
    if (location.pathname.includes('/webide')) {
      return (
        <WebIDELayout>
          <AppRouter />
        </WebIDELayout>
      );
    }

    // 其他页面使用MainLayout
    return (
      <MainLayout>
        <AppRouter />
      </MainLayout>
    );
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      {getLayout()}
    </Suspense>
  );
}

export default App