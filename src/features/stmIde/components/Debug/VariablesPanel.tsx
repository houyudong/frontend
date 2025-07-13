import React, { useState, useEffect, useCallback } from 'react'
import { produce } from 'immer'
import { useDebugStore } from '../../stores/debugStore'
import debugSnapshotService, { VariableInfo } from '../../services/debugSnapshot'

// 变量信息接口 - 基于debug工程设计
interface Variable {
  name: string
  value: string
  type: string
  scope: 'local' | 'global'
  originalName: string
  hasChanged: boolean
}

// 组件状态接口
interface VariableState {
  allVariables: Record<string, Variable>
  previousValues: Record<string, string>
  filterText: string
  isLoading: boolean
  lastError: string | null
}

/**
 * 变量监视面板 - 基于debug工程设计，简洁高效
 * 参考 stmclient/test/debug/js/variable-monitor.js 的实现
 */
const VariablesPanel: React.FC = () => {
  const [state, setState] = useState<VariableState>({
    allVariables: {},
    previousValues: {},
    filterText: '',
    isLoading: false,
    lastError: null
  })

  const { isDebugging, isPaused } = useDebugStore()

  // 判断是否应该过滤掉某个变量 - 更宽松的过滤逻辑，确保全局变量显示
  const shouldFilterVariable = useCallback((name: string, value: string): boolean => {
    // 过滤掉明显的系统内部变量
    if (name.startsWith('__STACK') || name.startsWith('__HEAP')) {
      return true
    }

    // 过滤掉非常大的数组（超过200字符的值）
    if (value && value.length > 200) {
      return true
    }

    // 过滤掉一些明显的系统表，但保留重要的全局变量
    const systemTables = ['AHBPrescTable', 'APBPrescTable', 'MSIRangeTable']
    if (systemTables.includes(name)) {
      return true
    }

    // 不过滤其他变量，包括SystemCoreClock等重要全局变量
    return false
  }, [])

  // 判断是否为局部变量 - 更准确的判断逻辑
  const isLocalVariable = useCallback((name: string): boolean => {
    // 明确的全局变量模式
    const globalPatterns = [
      'System',      // SystemCoreClock等系统变量
      'uw',          // uwTick等HAL变量
      'g_',          // 全局变量前缀
      '__',          // 系统内部变量
      'HAL_',        // HAL库变量
      'GPIO_',       // GPIO相关
      'RCC_',        // RCC相关
      'NVIC_',       // NVIC相关
    ]

    // 如果匹配全局模式，则为全局变量
    const isGlobal = globalPatterns.some(pattern => name.startsWith(pattern))

    // 单字符变量通常是局部变量
    if (name.length === 1) {
      return true
    }

    // 小写开头且不匹配全局模式的，通常是局部变量
    if (name[0] >= 'a' && name[0] <= 'z' && !isGlobal) {
      return true
    }

    return !isGlobal
  }, [])

  // 更新变量列表 - 参考debug工程的变量处理逻辑
  const updateVariables = useCallback((variables: [string, VariableInfo][]) => {
    setState(prevState => produce(prevState, draft => {
      variables.forEach(([name, variable]) => {
        const newValue = variable.value || '...'
        const oldValue = draft.previousValues[name]

        // 检测变量值变化
        const hasChanged = oldValue !== undefined && oldValue !== newValue

        // 过滤掉不适合显示的变量
        if (shouldFilterVariable(name, newValue)) {
          return
        }

        // 确定变量作用域
        let scope: 'local' | 'global' = variable.scope as 'local' | 'global'
        if (!scope || (scope !== 'local' && scope !== 'global')) {
          scope = isLocalVariable(name) ? 'local' : 'global'
        }

        // 更新变量信息
        draft.allVariables[name] = {
          name,
          value: newValue,
          type: variable.type || 'unknown',
          scope,
          originalName: name,
          hasChanged
        }

        // 保存当前值作为下次比较的基准
        draft.previousValues[name] = newValue
      })

      draft.lastError = null
    }))
  }, [shouldFilterVariable, isLocalVariable])

  // 处理变量更新事件
  const handleVariableUpdate = useCallback((data: { variables: [string, VariableInfo][] }) => {
    console.log('🔍 变量面板收到更新:', data)
    console.log('🔍 变量数量:', data.variables?.length || 0)

    // 分析变量类型分布
    if (data.variables && data.variables.length > 0) {
      const localVars = data.variables.filter(([name]) => isLocalVariable(name))
      const globalVars = data.variables.filter(([name]) => !isLocalVariable(name))
      console.log('🔍 局部变量数量:', localVars.length)
      console.log('🔍 全局变量数量:', globalVars.length)
      console.log('🔍 全局变量列表:', globalVars.map(([name]) => name))
    }

    updateVariables(data.variables)
  }, [updateVariables, isLocalVariable])

  // 监听调试快照服务的变量更新事件
  useEffect(() => {
    debugSnapshotService.on('variablesUpdated', handleVariableUpdate)
    return () => {
      debugSnapshotService.off('variablesUpdated', handleVariableUpdate)
    }
  }, [handleVariableUpdate])

  // 监听调试状态变化
  useEffect(() => {
    if (isDebugging && isPaused) {
      // 调试暂停时，获取当前变量
      console.log('🔍 调试暂停，获取变量数据')
      const variables = debugSnapshotService.getAllVariables()

      if (variables.length > 0) {
        const variableEntries = variables.map(v => [v.name, v] as [string, VariableInfo])
        handleVariableUpdate({ variables: variableEntries })
      }
    } else {
      clearVariables()
    }
  }, [isDebugging, isPaused, handleVariableUpdate])

  // 加载变量信息
  const loadVariables = useCallback(async () => {
    setState(prevState => produce(prevState, draft => {
      draft.isLoading = true
      draft.lastError = null
    }))

    try {
      console.log('🔍 手动刷新变量数据')
      const variables = debugSnapshotService.getAllVariables()

      if (variables.length > 0) {
        const variableEntries = variables.map(v => [v.name, v] as [string, VariableInfo])
        handleVariableUpdate({ variables: variableEntries })
      } else {
        console.log('🔍 未找到变量数据，可能需要等待调试快照更新')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载变量失败'
      setState(prevState => produce(prevState, draft => {
        draft.lastError = errorMessage
      }))
      console.error('加载变量失败:', error)
    } finally {
      setState(prevState => produce(prevState, draft => {
        draft.isLoading = false
      }))
    }
  }, [handleVariableUpdate])

  // 清除变量信息
  const clearVariables = useCallback(() => {
    setState(prevState => produce(prevState, draft => {
      draft.allVariables = {}
      draft.lastError = null
    }))
  }, [])

  // 处理筛选
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const filterText = e.target.value
    setState(prevState => produce(prevState, draft => {
      draft.filterText = filterText
    }))
  }, [])

  // 清除变化标记 - 2秒后自动清除高亮
  useEffect(() => {
    const timer = setTimeout(() => {
      setState(prevState => produce(prevState, draft => {
        Object.keys(draft.allVariables).forEach(name => {
          draft.allVariables[name].hasChanged = false
        })
      }))
    }, 2000)

    return () => clearTimeout(timer)
  }, [state.allVariables])

  // 获取排序后的变量列表 - 参考debug工程的排序逻辑
  const getSortedVariables = useCallback(() => {
    const allVars = Object.values(state.allVariables)

    // 应用筛选
    const filteredVars = state.filterText
      ? allVars.filter(v => v.name.toLowerCase().includes(state.filterText.toLowerCase()))
      : allVars

    // 排序：变化的局部变量 -> 变化的全局变量 -> 其他局部变量 -> 其他全局变量
    return filteredVars.sort((a, b) => {
      const getPriority = (variable: Variable) => {
        if (variable.scope === 'local' && variable.hasChanged) return 1
        if (variable.scope === 'global' && variable.hasChanged) return 2
        if (variable.scope === 'local' && !variable.hasChanged) return 3
        return 4
      }

      const priorityA = getPriority(a)
      const priorityB = getPriority(b)

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }

      return a.name.localeCompare(b.name)
    })
  }, [state.allVariables, state.filterText])

  const sortedVariables = getSortedVariables()

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 筛选栏 - 去掉标题，直接显示筛选框 */}
      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
        <input
          type="text"
          placeholder="筛选变量..."
          value={state.filterText}
          onChange={handleFilterChange}
          className="flex-1 px-2 py-1 text-sm bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {state.isLoading && (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        )}
        <button
          onClick={loadVariables}
          disabled={!isDebugging || !isPaused || state.isLoading}
          className={`
            p-1 rounded hover:bg-gray-200 transition-colors
            ${!isDebugging || !isPaused || state.isLoading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-800'
            }
          `}
          title="刷新变量"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden">
        {!isDebugging ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">启动调试以查看变量</p>
          </div>
        ) : !isPaused ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M13 16h3a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2h3" />
            </svg>
            <p className="text-sm">程序运行中</p>
            <p className="text-xs mt-1 text-gray-600">暂停执行以查看变量</p>
          </div>
        ) : state.lastError ? (
          <div className="flex flex-col items-center justify-center h-full text-red-600">
            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">{state.lastError}</p>
            <button
              onClick={loadVariables}
              className="mt-2 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
            >
              重试
            </button>
          </div>
        ) : (
          // 变量表格 - 修复：统一字体大小与标题一致
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="text-left py-1 px-2 text-gray-700 font-medium text-xs border-r border-gray-300" style={{ width: '80px' }}>
                    作用域
                  </th>
                  <th className="text-left py-1 px-2 text-gray-700 font-medium text-xs border-r border-gray-300" style={{ width: '40%' }}>
                    变量名
                  </th>
                  <th className="text-left py-1 px-2 text-gray-700 font-medium text-xs">
                    值
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedVariables.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500 text-xs">
                      {state.filterText ? '无匹配变量' : '暂无变量'}
                    </td>
                  </tr>
                ) : (
                  sortedVariables.map((variable, index) => (
                    <tr
                      key={`${variable.name}-${index}`}
                      className={`
                        border-b border-gray-200 hover:bg-blue-50 transition-all duration-200 group
                        ${variable.hasChanged ? 'bg-yellow-100' : ''}
                      `}
                    >
                      {/* 作用域列 - 修复：统一字体大小和间距 */}
                      <td
                        className={`
                          py-1 px-2 text-center font-medium text-xs border-r border-gray-200
                          ${variable.scope === 'local'
                            ? 'text-green-700 bg-green-50'
                            : 'text-blue-700 bg-blue-50'
                          }
                        `}
                        title={variable.scope === 'local' ? '局部变量' : '全局变量'}
                      >
                        {variable.scope === 'local' ? '局部' : '全局'}
                      </td>

                      {/* 变量名 - 修复：统一字体大小和间距 */}
                      <td
                        className={`
                          py-1 px-2 font-mono font-medium text-xs border-r border-gray-200 break-all
                          ${variable.scope === 'local' ? 'text-green-800' : 'text-blue-800'}
                        `}
                        title={`类型: ${variable.type}`}
                      >
                        {variable.originalName}
                      </td>

                      {/* 变量值 - 修复：统一字体大小和间距 */}
                      <td
                        className={`
                          py-1 px-2 font-mono text-xs break-all max-w-0 overflow-hidden text-ellipsis whitespace-nowrap
                          group-hover:whitespace-normal group-hover:overflow-visible group-hover:max-w-none
                          ${variable.hasChanged
                            ? 'text-orange-600 font-bold'
                            : 'text-gray-800'
                          }
                        `}
                        title={variable.value}
                      >
                        {variable.value}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default VariablesPanel
