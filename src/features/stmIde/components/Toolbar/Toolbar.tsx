import React from 'react'

interface ToolbarProps {
  hideTitle?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ hideTitle = false }) => {
  return (
    <div className="bg-blue-800 text-white px-3 py-2 flex items-center h-10 flex-shrink-0">
      {!hideTitle && <h1 className="text-base font-semibold">STM32 AI调试工具</h1>}
    </div>
  )
}

export default Toolbar
