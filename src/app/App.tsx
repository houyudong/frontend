import { Suspense } from 'react'
import { AppRouter } from '../router'

const App: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-sm">加载中...</p>
        </div>
      </div>
    }>
      <AppRouter />
    </Suspense>
  );
}

export default App;
