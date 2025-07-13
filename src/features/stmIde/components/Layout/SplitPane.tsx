import React from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

interface SplitPaneProps {
  children: [React.ReactNode, React.ReactNode]
  direction?: 'horizontal' | 'vertical'
  sizes?: [number, number]
  minSize?: [number, number]
  className?: string
  leftId?: string
  rightId?: string
}

const SplitPane: React.FC<SplitPaneProps> = ({
  children,
  direction = 'horizontal',
  sizes = [25, 75],
  minSize = [10, 10],
  className = '',
  leftId,
  rightId
}) => {
  const [leftPane, rightPane] = children

  console.log('📐 SplitPane 渲染:', {
    direction,
    sizes,
    minSize,
    hasLeftPane: !!leftPane,
    hasRightPane: !!rightPane,
    leftId,
    rightId
  })

  if (!leftPane || !rightPane) {
    console.warn('SplitPane requires exactly 2 children')
    return <div className="h-full w-full">{children}</div>
  }

  // 验证配置
  if (sizes[0] + sizes[1] !== 100) {
    console.warn('SplitPane sizes should add up to 100%', { sizes })
  }

  if (minSize[0] > sizes[0] || minSize[1] > sizes[1]) {
    console.warn('SplitPane minSize should not be greater than defaultSize', { sizes, minSize })
  }

  return (
    <PanelGroup
      direction={direction}
      className={`h-full w-full ${className}`}
    >
      <Panel
        defaultSize={sizes[0]}
        minSize={minSize[0]}
        id={leftId}
        className="h-full overflow-hidden"
      >
        {leftPane}
      </Panel>

      <PanelResizeHandle className="bg-gray-200 hover:bg-blue-400 transition-colors data-[panel-group-direction=vertical]:h-1 data-[panel-group-direction=horizontal]:w-1 data-[panel-group-direction=vertical]:cursor-row-resize data-[panel-group-direction=horizontal]:cursor-col-resize flex-shrink-0" />

      <Panel
        defaultSize={sizes[1]}
        minSize={minSize[1]}
        id={rightId}
        className="h-full overflow-hidden"
      >
        {rightPane}
      </Panel>
    </PanelGroup>
  )
}

export default SplitPane
