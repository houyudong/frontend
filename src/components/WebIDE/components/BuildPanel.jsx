import React from 'react';
import './BuildPanel.css';

const BuildPanel = ({ buildOutput, buildErrors, onClear }) => {
  return (
    <div className="build-panel">
      <div className="output-content console-style">
        <pre>{buildOutput}</pre>
      </div>
      {buildErrors.length > 0 && (
        <div className="build-errors">
          <h4>编译错误:</h4>
          <ul>
            {buildErrors.map((error, index) => (
              <li key={index} className="error-item">
                <span className="error-location">
                  {error.file}:{error.line}:{error.column}
                </span>
                <span className="error-message">{error.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BuildPanel;
