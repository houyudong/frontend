import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  private cleanup?: () => void

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 过滤浏览器扩展相关错误
    const errorMessage = error.message || ''
    if (
      errorMessage.includes('runtime.lastError') ||
      errorMessage.includes('message port closed') ||
      errorMessage.includes('Extension context invalidated') ||
      errorMessage.includes('Could not establish connection')
    ) {
      // 忽略扩展相关错误，重置状态
      this.setState({ hasError: false, error: undefined, errorInfo: undefined })
      return
    }

    console.error('❌ ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  componentDidMount() {
    // 全局错误处理
    const handleError = (event: ErrorEvent) => {
      const message = event.message || ''
      if (
        message.includes('runtime.lastError') ||
        message.includes('message port closed') ||
        message.includes('Unchecked runtime.lastError')
      ) {
        event.preventDefault()
        return false
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message = event.reason?.toString() || ''
      if (
        message.includes('runtime.lastError') ||
        message.includes('message port closed')
      ) {
        event.preventDefault()
        return false
      }
    }

    // 抑制控制台错误
    const originalError = console.error
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || ''
      if (
        message.includes('runtime.lastError') ||
        message.includes('message port closed') ||
        message.includes('Unchecked runtime.lastError')
      ) {
        return
      }
      originalError.apply(console, args)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // 清理函数在组件卸载时执行
    this.cleanup = () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      console.error = originalError
    }
  }

  componentWillUnmount() {
    if (this.cleanup) {
      this.cleanup()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          background: '#fff5f5',
          border: '1px solid #fed7d7',
          borderRadius: '6px',
          margin: '20px'
        }}>
          <h2 style={{ color: '#c53030', marginBottom: '10px' }}>
            🚨 应用程序出现错误
          </h2>
          <details style={{ marginBottom: '10px' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
              错误详情
            </summary>
            <pre style={{
              background: '#f7fafc',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto'
            }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#3182ce',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重新加载页面
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
