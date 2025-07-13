import { useState, useCallback } from 'react';

type DocTab = 'guide' | 'api' | 'examples';

interface DocSearchResult {
  title: string;
  content: string;
  url: string;
}

interface UseDocPanelReturn {
  activeDocTab: DocTab;
  searchQuery: string;
  searchResults: DocSearchResult[];
  onTabChange: (tab: DocTab) => void;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => Promise<void>;
}

/**
 * useDocPanel - 文档面板Hook
 * 
 * 用于管理文档面板的状态和搜索功能。
 * 
 * @returns {UseDocPanelReturn} 文档面板状态和操作方法
 */
const useDocPanel = (): UseDocPanelReturn => {
  const [activeDocTab, setActiveDocTab] = useState<DocTab>('guide');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DocSearchResult[]>([]);

  const onTabChange = useCallback((tab: DocTab) => {
    setActiveDocTab(tab);
  }, []);

  const onSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const onSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // TODO: 实现实际的文档搜索功能
      const mockResults: DocSearchResult[] = [
        {
          title: '搜索结果示例',
          content: '这是一个示例搜索结果...',
          url: '#'
        }
      ];
      setSearchResults(mockResults);
    } catch (error) {
      console.error('搜索文档失败:', error);
      setSearchResults([]);
    }
  }, [searchQuery]);

  return {
    activeDocTab,
    searchQuery,
    searchResults,
    onTabChange,
    onSearchQueryChange,
    onSearch
  };
};

export default useDocPanel; 