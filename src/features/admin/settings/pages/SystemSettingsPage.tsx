import React, { useState, useEffect } from 'react';
import MainLayout from '../../../../shared/ui/layout/MainLayout';

// 系统配置接口
interface SystemConfig {
  id: string;
  category: string;
  key: string;
  value: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  isPublic: boolean;
}

// 模拟系统配置数据
const mockConfigs: SystemConfig[] = [
  {
    id: '1',
    category: 'system',
    key: 'site_name',
    value: 'STM32 AI学习平台',
    description: '网站名称',
    type: 'string',
    isPublic: true
  },
  {
    id: '2',
    category: 'system',
    key: 'max_users',
    value: '1000',
    description: '最大用户数量',
    type: 'number',
    isPublic: false
  },
  {
    id: '3',
    category: 'system',
    key: 'maintenance_mode',
    value: 'false',
    description: '维护模式',
    type: 'boolean',
    isPublic: false
  },
  {
    id: '4',
    category: 'learning',
    key: 'max_course_duration',
    value: '180',
    description: '课程最大时长（分钟）',
    type: 'number',
    isPublic: true
  },
  {
    id: '5',
    category: 'learning',
    key: 'auto_save_interval',
    value: '30',
    description: '自动保存间隔（秒）',
    type: 'number',
    isPublic: true
  },
  {
    id: '6',
    category: 'security',
    key: 'session_timeout',
    value: '3600',
    description: '会话超时时间（秒）',
    type: 'number',
    isPublic: false
  },
  {
    id: '7',
    category: 'security',
    key: 'password_min_length',
    value: '8',
    description: '密码最小长度',
    type: 'number',
    isPublic: true
  },
  {
    id: '8',
    category: 'ide',
    key: 'default_theme',
    value: 'vs-dark',
    description: '默认编辑器主题',
    type: 'string',
    isPublic: true
  },
  {
    id: '9',
    category: 'ide',
    key: 'enable_autocomplete',
    value: 'true',
    description: '启用代码自动完成',
    type: 'boolean',
    isPublic: true
  },
  {
    id: '10',
    category: 'notification',
    key: 'email_notifications',
    value: 'true',
    description: '启用邮件通知',
    type: 'boolean',
    isPublic: false
  }
];

/**
 * SystemSettingsPage - 系统设置页面
 * 
 * 管理员配置系统参数和设置
 * 支持分类管理和实时更新
 */
const SystemSettingsPage: React.FC = () => {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 模拟数据加载
  useEffect(() => {
    const loadConfigs = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConfigs(mockConfigs);
      setLoading(false);
    };

    loadConfigs();
  }, []);

  // 获取所有分类
  const categories = Array.from(new Set(configs.map(config => config.category)));

  // 过滤配置
  const filteredConfigs = configs.filter(config => {
    const matchesCategory = selectedCategory === 'all' || config.category === selectedCategory;
    const matchesSearch = config.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         config.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 按分类分组
  const groupedConfigs = filteredConfigs.reduce((groups, config) => {
    const category = config.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(config);
    return groups;
  }, {} as Record<string, SystemConfig[]>);

  // 获取分类显示名称
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'system': return '系统设置';
      case 'learning': return '学习设置';
      case 'security': return '安全设置';
      case 'ide': return 'IDE设置';
      case 'notification': return '通知设置';
      default: return category;
    }
  };

  // 获取类型颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string': return 'bg-blue-100 text-blue-800';
      case 'number': return 'bg-green-100 text-green-800';
      case 'boolean': return 'bg-purple-100 text-purple-800';
      case 'json': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 格式化值显示
  const formatValue = (config: SystemConfig) => {
    if (config.type === 'boolean') {
      return config.value === 'true' ? '启用' : '禁用';
    }
    return config.value;
  };

  // 保存配置
  const handleSaveConfig = (config: SystemConfig) => {
    if (editingConfig) {
      // 更新现有配置
      setConfigs(configs.map(c => c.id === config.id ? config : c));
    } else {
      // 添加新配置
      const newConfig = { ...config, id: Date.now().toString() };
      setConfigs([...configs, newConfig]);
    }
    setShowConfigModal(false);
    setEditingConfig(null);
  };

  // 删除配置
  const handleDeleteConfig = (configId: string) => {
    if (window.confirm('确定要删除这个配置项吗？')) {
      setConfigs(configs.filter(c => c.id !== configId));
    }
  };

  // 切换布尔值
  const toggleBooleanValue = (configId: string) => {
    setConfigs(configs.map(config => {
      if (config.id === configId && config.type === 'boolean') {
        return { ...config, value: config.value === 'true' ? 'false' : 'true' };
      }
      return config;
    }));
  };

  return (
    <MainLayout>
      <div className="page-container">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">系统设置</h1>
          <p className="text-gray-600">配置系统参数，管理平台设置和功能开关</p>
        </div>

        {/* 搜索和筛选 */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                搜索配置
              </label>
              <input
                type="text"
                className="input-primary"
                placeholder="输入配置键名或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分类筛选
              </label>
              <select
                className="input-primary"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">全部分类</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryName(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              找到 {filteredConfigs.length} 个配置项
            </span>
            <button
              onClick={() => {
                setEditingConfig(null);
                setShowConfigModal(true);
              }}
              className="btn-primary"
            >
              + 添加配置
            </button>
          </div>
        </div>

        {/* 配置列表 */}
        {loading ? (
          <div className="card">
            <div className="p-6 text-center">
              <div className="loading-spinner h-8 w-8 mx-auto mb-2"></div>
              <p className="text-gray-600">加载配置中...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedConfigs).map(([category, categoryConfigs]) => (
              <div key={category} className="card">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {getCategoryName(category)}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {categoryConfigs.length} 个配置项
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {categoryConfigs.map((config) => (
                      <div key={config.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-sm font-medium text-gray-900">{config.key}</h4>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(config.type)}`}>
                              {config.type}
                            </span>
                            {config.isPublic && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                公开
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{config.description}</p>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">当前值:</span>
                            {config.type === 'boolean' ? (
                              <button
                                onClick={() => toggleBooleanValue(config.id)}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  config.value === 'true' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {formatValue(config)}
                              </button>
                            ) : (
                              <span className="text-sm font-medium text-gray-900">{formatValue(config)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingConfig(config);
                              setShowConfigModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteConfig(config.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 配置编辑模态框 */}
        {showConfigModal && (
          <ConfigModal
            config={editingConfig}
            onSave={handleSaveConfig}
            onCancel={() => {
              setShowConfigModal(false);
              setEditingConfig(null);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
};

// 配置编辑模态框组件
interface ConfigModalProps {
  config: SystemConfig | null;
  onSave: (config: SystemConfig) => void;
  onCancel: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ config, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<SystemConfig>>({
    category: config?.category || 'system',
    key: config?.key || '',
    value: config?.value || '',
    description: config?.description || '',
    type: config?.type || 'string',
    isPublic: config?.isPublic || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.key && formData.value && formData.description) {
      onSave({
        id: config?.id || '',
        category: formData.category!,
        key: formData.key,
        value: formData.value,
        description: formData.description,
        type: formData.type!,
        isPublic: formData.isPublic!
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {config ? '编辑配置' : '添加配置'}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分类
              </label>
              <select
                className="input-primary"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="system">系统设置</option>
                <option value="learning">学习设置</option>
                <option value="security">安全设置</option>
                <option value="ide">IDE设置</option>
                <option value="notification">通知设置</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                配置键名
              </label>
              <input
                type="text"
                className="input-primary"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                类型
              </label>
              <select
                className="input-primary"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                required
              >
                <option value="string">字符串</option>
                <option value="number">数字</option>
                <option value="boolean">布尔值</option>
                <option value="json">JSON</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                配置值
              </label>
              {formData.type === 'boolean' ? (
                <select
                  className="input-primary"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                >
                  <option value="true">启用</option>
                  <option value="false">禁用</option>
                </select>
              ) : (
                <input
                  type={formData.type === 'number' ? 'number' : 'text'}
                  className="input-primary"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <input
                type="text"
                className="input-primary"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                公开配置（用户可见）
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
