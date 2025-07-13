import { Suspense } from 'react'
import { AppRouter } from './routes'
import './styles/login-animations.css'

const App: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    }>
      <AppRouter />
    </Suspense>
  );
}

export default App; 