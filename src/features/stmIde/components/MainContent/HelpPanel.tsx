import React from 'react'
import Dialog from '../UI/Dialog'

interface HelpPanelProps {
  onClose: () => void
}

const HelpPanel: React.FC<HelpPanelProps> = ({ onClose }) => {
  const shortcuts = [
    { key: 'Ctrl+S', desc: '保存文件' },
    { key: 'Ctrl+B', desc: '编译项目' },
    { key: 'F5', desc: '运行程序' },
    { key: 'F9', desc: '切换断点' },
    { key: 'Ctrl+F5', desc: '启动调试' }
  ]



  return (
    <Dialog
      visible={true}
      title="帮助"
      onConfirm={onClose}
      onCancel={onClose}
      confirmText="确定"
      showCancel={false}
      width="max-w-lg"
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">快捷键</h3>
          <div className="space-y-1">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{shortcut.desc}</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">版本信息</h3>
          <p className="text-sm text-gray-600">STM32 AI调试工具 v1.0.0</p>
        </div>
      </div>
    </Dialog>
  )
}

export default HelpPanel
