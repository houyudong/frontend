import { useState } from 'react';
import axios from 'axios';

// 文档面板相关逻辑
const useDocPanel = () => {
  const [showDocPanel, setShowDocPanel] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState('api');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // 搜索文档
  const handleSearchDocs = async () => {
    if (!searchQuery.trim()) return;

    try {
      // 模拟搜索结果 - 实际应用中应该调用后端API
      const results = [
        {
          title: `STM32F1 - ${searchQuery} API`,
          description: `关于 ${searchQuery} 的API文档和使用说明`
        },
        {
          title: `如何使用 ${searchQuery} 外设`,
          description: '详细的使用教程和代码示例'
        },
        {
          title: `${searchQuery} 常见问题解答`,
          description: '解决使用过程中的常见问题'
        }
      ];

      setSearchResults(results);
    } catch (error) {
      console.error('搜索文档失败:', error);
      setSearchResults([]);
    }
  };

  // 切换文档面板显示状态
  const toggleDocPanel = () => {
    setShowDocPanel(!showDocPanel);
  };

  return {
    showDocPanel,
    setShowDocPanel,
    activeDocTab,
    setActiveDocTab,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    handleSearchDocs,
    toggleDocPanel
  };
};

export default useDocPanel;
