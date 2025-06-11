import React from 'react';
import './FlashPanel.css';

const FlashPanel = ({ flashOutput, hexFiles, selectedHexFile, onHexFileChange }) => {
  return (
    <div className="flash-panel">
      <div className="flash-header">
        <h4>烧录面板</h4>
        {hexFiles.length > 0 && (
          <div className="hex-file-selector">
            <label>选择固件文件:</label>
            <select
              value={selectedHexFile}
              onChange={(e) => onHexFileChange(e.target.value)}
            >
              {hexFiles.map((file, index) => (
                <option key={index} value={file.path}>
                  {file.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flash-output">
        <pre className="output-content">{flashOutput}</pre>
      </div>
    </div>
  );
};

export default FlashPanel;
