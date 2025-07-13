import React, { useState } from 'react'
import Button from '../UI/Button'
import Dialog from '../UI/Dialog'

interface SettingsPanelProps {
  onClose: () => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const [settings, setSettings] = useState({
    theme: 'vs-dark',
    fontSize: 14
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    localStorage.setItem('stmide-settings', JSON.stringify(settings))
    onClose()
  }

  return (
    <Dialog
      visible={true}
      title="设置"
      onConfirm={handleSave}
      onCancel={onClose}
      confirmText="确定"
      cancelText="取消"
      width="max-w-md"
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">外观</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">字体大小</label>
              <input
                type="number"
                min="10"
                max="24"
                value={settings.fontSize}
                onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">主题</label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="vs-dark">深色主题</option>
                <option value="vs-light">浅色主题</option>
              </select>
            </div>
          </div>
        </div>
      </div>

    </Dialog>
  )
}

export default SettingsPanel
