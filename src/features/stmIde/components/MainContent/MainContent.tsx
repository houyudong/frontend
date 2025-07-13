import React from 'react'
import DebugToolbar from './DebugToolbar'
import EditorContainer from './EditorContainer'
import BottomPanel from './BottomPanel'
import SplitPane from '../Layout/SplitPane'

const MainContent: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full w-full min-w-0" id="main-content">
      {/* 调试工具栏 */}
      <DebugToolbar />

      {/* 编辑器和底部面板的分割容器 */}
      <div className="flex-1 overflow-hidden" id="editor-panel-split">
        <SplitPane
          direction="vertical"
          sizes={[70, 30]}
          minSize={[40, 20]}
          leftId="editor-container"
          rightId="bottom-panel"
        >
          {/* 编辑器区域 */}
          <EditorContainer />

          {/* 底部面板 */}
          <BottomPanel />
        </SplitPane>
      </div>
    </div>
  )
}

export default MainContent
