import React from 'react';
import './DebugConsole.css';

const DebugConsole = ({ debugOutput, onClear }) => {
  return (
    <div className="debug-console">
      <div className="output-content console-style">
        <pre>{debugOutput}</pre>
      </div>
    </div>
  );
};

export default DebugConsole;
