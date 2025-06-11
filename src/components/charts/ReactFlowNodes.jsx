import React, { useRef } from 'react';
import { NodeResizer } from 'reactflow';

// Diamond-shaped decision node
export const DiamondShapeNode = ({ id, data, selected }) => {
  const nodeRef = useRef(null);
  
  // Handle edit 
  const handleEdit = () => {
    const flowRoot = document.querySelector('.reactflow-wrapper');
    if (flowRoot) {
      const event = new CustomEvent('edit-node-text', { 
        detail: { nodeId: id, text: data.label },
        bubbles: true 
      });
      flowRoot.dispatchEvent(event);
    }
  };
  
  // Diamond style using clip-path
  const diamondStyle = {
    width: '150px',
    height: '150px',
    background: '#fff7e6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ffd591',
    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    fontSize: data.fontSize || '12px',
    color: data.fontColor || '#1e3a8a',
    position: 'relative'
  };
  
  return (
    <>
      {selected && (
        <>
          <NodeResizer 
            color="#ff0071" 
            isVisible={selected} 
            minWidth={100} 
            minHeight={100}
          />
          <div
            style={{
              position: 'absolute',
              right: -25,
              top: 0,
              background: '#fff',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid #ddd',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onClick={handleEdit}
            title="编辑文本"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </div>
        </>
      )}
      <div 
        ref={nodeRef}
        style={diamondStyle}
        onDoubleClick={(e) => {
          handleEdit();
          e.stopPropagation();
        }}
      >
        <div style={{
          padding: '10px',
          textAlign: 'center',
          maxWidth: '80%',
          wordBreak: 'break-word'
        }}>
          {data.label}
        </div>
      </div>
    </>
  );
};

// Rectangle node
export const ResizableNode = ({ id, data, selected, style }) => {
  const nodeRef = useRef(null);
  
  // Handle edit
  const handleEdit = () => {
    const flowRoot = document.querySelector('.reactflow-wrapper');
    if (flowRoot) {
      const event = new CustomEvent('edit-node-text', { 
        detail: { nodeId: id, text: data.label },
        bubbles: true 
      });
      flowRoot.dispatchEvent(event);
    }
  };
  
  return (
    <>
      {selected && (
        <>
          <NodeResizer 
            color="#ff0071" 
            isVisible={selected} 
            minWidth={100} 
            minHeight={30}
          />
          <div
            style={{
              position: 'absolute',
              right: -25,
              top: 0,
              background: '#fff',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid #ddd',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onClick={handleEdit}
            title="编辑文本"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </div>
        </>
      )}
      <div 
        ref={nodeRef}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          wordBreak: 'break-word',
          fontSize: data.fontSize || style.fontSize || '12px',
          color: data.fontColor || style.color || '#1e3a8a'
        }}
        onDoubleClick={(e) => {
          handleEdit();
          e.stopPropagation();
        }}
      >
        {data.label}
      </div>
    </>
  );
}; 