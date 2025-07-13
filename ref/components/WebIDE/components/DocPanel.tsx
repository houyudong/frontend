import React from 'react';
import './DocPanel.css';

interface DocPanelProps {
  activeDocTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchResults: any[];
  onSearch: () => Promise<void>;
}

/**
 * DocPanel - 文档面板组件
 * 
 * 用于显示和搜索文档。
 * 
 * @param {DocPanelProps} props - 组件属性
 * @returns {React.ReactElement} 文档面板组件
 */
const DocPanel: React.FC<DocPanelProps> = ({
  activeDocTab,
  onTabChange,
  searchQuery,
  onSearchQueryChange,
  searchResults,
  onSearch
}) => {
  return (
    <div className="doc-panel">
      <div className="doc-header">
        <h3>文档</h3>
        <div className="doc-tabs">
          <button
            className={`tab-button ${activeDocTab === 'guide' ? 'active' : ''}`}
            onClick={() => onTabChange('guide')}
          >
            指南
          </button>
          <button
            className={`tab-button ${activeDocTab === 'api' ? 'active' : ''}`}
            onClick={() => onTabChange('api')}
          >
            API
          </button>
          <button
            className={`tab-button ${activeDocTab === 'examples' ? 'active' : ''}`}
            onClick={() => onTabChange('examples')}
          >
            示例
          </button>
        </div>
      </div>
      <div className="doc-content">
        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="搜索文档..."
          />
          <button onClick={onSearch}>搜索</button>
        </div>
        <div className="search-results">
          {searchResults.map((result, index) => (
            <div key={index} className="search-result">
              <h4>{result.title}</h4>
              <p>{result.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocPanel; 