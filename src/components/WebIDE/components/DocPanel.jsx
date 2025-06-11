import React from 'react';
import './DocPanel.css';

const DocPanel = ({
  activeDocTab,
  onTabChange,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  searchResults
}) => {
  return (
    <div className="doc-panel-container">
      <div className="stm32-doc-panel">
        <div className="doc-tabs">
          <button
            className={`doc-tab ${activeDocTab === 'api' ? 'active' : ''}`}
            onClick={() => onTabChange('api')}
          >
            API参考
          </button>
          <button
            className={`doc-tab ${activeDocTab === 'tutorials' ? 'active' : ''}`}
            onClick={() => onTabChange('tutorials')}
          >
            教程
          </button>
          <button
            className={`doc-tab ${activeDocTab === 'examples' ? 'active' : ''}`}
            onClick={() => onTabChange('examples')}
          >
            示例代码
          </button>
        </div>
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="搜索 STM32F1 文档..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            />
            <button onClick={onSearch} className="search-button">搜索</button>
          </div>
        </div>
        <div className="results-container">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div key={index} className="search-result-item">
                <div className="result-title">{result.title}</div>
                <div className="result-description">{result.description}</div>
              </div>
            ))
          ) : (
            <div className="placeholder-message">
              <div>输入关键词搜索 STM32F1 标准外设库文档</div>
              <div>例如: GPIO, USART, SPI</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocPanel;
