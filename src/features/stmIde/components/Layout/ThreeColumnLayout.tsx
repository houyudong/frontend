import React from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

interface ThreeColumnLayoutProps {
  leftPanel: React.ReactNode
  centerPanel: React.ReactNode
  rightPanel: React.ReactNode
  sizes?: [number, number, number]
  minSizes?: [number, number, number]
  className?: string
  leftId?: string
  centerId?: string
  rightId?: string
}

/**
 * ThreeColumnLayout - 三栏可调节布局组件
 * 
 * 专为STMIDE设计的三栏布局：
 * - 左栏：文件树/侧边栏
 * - 中栏：代码编辑器
 * - 右栏：AI助手
 * 
 * 遵循奥卡姆法则：简单而有效的布局解决方案
 */
const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  leftPanel,
  centerPanel,
  rightPanel,
  sizes = [15, 60, 25],
  minSizes = [10, 40, 20],
  className = '',
  leftId = 'left-panel',
  centerId = 'center-panel',
  rightId = 'right-panel'
}) => {
  console.log('📐 ThreeColumnLayout 渲染:', {
    sizes,
    minSizes,
    hasLeftPanel: !!leftPanel,
    hasCenterPanel: !!centerPanel,
    hasRightPanel: !!rightPanel,
    leftId,
    centerId,
    rightId
  })

  // 验证配置
  if (sizes[0] + sizes[1] + sizes[2] !== 100) {
    console.warn('ThreeColumnLayout sizes should add up to 100%', { sizes })
  }

  if (minSizes.some((minSize, index) => minSize > sizes[index])) {
    console.warn('ThreeColumnLayout minSizes should not be greater than sizes', { sizes, minSizes })
  }

  if (!leftPanel || !centerPanel || !rightPanel) {
    console.warn('ThreeColumnLayout requires all three panels')
    return <div className="h-full w-full flex">{leftPanel}{centerPanel}{rightPanel}</div>
  }

  return (
    <PanelGroup
      direction="horizontal"
      className={`h-full w-full ${className}`}
    >
      {/* 左栏：侧边栏/文件树 */}
      <Panel
        defaultSize={sizes[0]}
        minSize={minSizes[0]}
        id={leftId}
        className="h-full overflow-hidden"
      >
        {leftPanel}
      </Panel>

      {/* 第一个分割线 */}
      <PanelResizeHandle className="bg-gray-200 hover:bg-blue-400 transition-colors w-1 cursor-col-resize flex-shrink-0" />

      {/* 中栏：主编辑器 */}
      <Panel
        defaultSize={sizes[1]}
        minSize={minSizes[1]}
        id={centerId}
        className="h-full overflow-hidden"
      >
        {centerPanel}
      </Panel>

      {/* 第二个分割线 */}
      <PanelResizeHandle className="bg-gray-200 hover:bg-blue-400 transition-colors w-1 cursor-col-resize flex-shrink-0" />

      {/* 右栏：AI助手 */}
      <Panel
        defaultSize={sizes[2]}
        minSize={minSizes[2]}
        id={rightId}
        className="h-full overflow-hidden"
      >
        {rightPanel}
      </Panel>
    </PanelGroup>
  )
}

export default ThreeColumnLayout
