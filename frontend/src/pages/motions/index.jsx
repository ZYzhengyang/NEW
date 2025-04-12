import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Slider, Tabs, Tag, Space, Divider } from 'antd';
import { SearchOutlined, FilterOutlined, SortAscendingOutlined, StarOutlined, DownloadOutlined } from '@ant-design/icons';
import MotionCard from '../../components/ResourceCard';

const { Option } = Select;
const { TabPane } = Tabs;

// 模拟数据
const mockMotions = [
  {
    id: 1,
    title: '后踢击打R',
    price: '$1.50',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '战斗动作',
    tags: ['热门', '新品'],
    rating: 4.8,
    downloads: 1245,
    originalPrice: '$2.00',
    description: '专业级后踢击打动作，适用于格斗游戏和动作场景'
  },
  {
    id: 2,
    title: '截拳直拳',
    price: '$2.25',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '战斗动作',
    tags: ['推荐'],
    rating: 4.5,
    downloads: 890,
    originalPrice: '$3.00',
    description: '快速截拳直拳组合，适合近身格斗场景'
  },
  {
    id: 3,
    title: '弹跳步',
    price: '$2.25',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '动作',
    tags: ['新品'],
    rating: 4.2,
    downloads: 756,
    originalPrice: '$2.75',
    description: '灵活的弹跳步动作，可用于运动和舞蹈场景'
  },
  {
    id: 4,
    title: '拳击待机',
    price: '$2.25',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '战斗动作',
    tags: ['热门'],
    rating: 4.7,
    downloads: 1150,
    originalPrice: '$2.80',
    description: '专业拳击手待机姿势，带有微小的呼吸和重心转移'
  },
  {
    id: 5,
    title: '胸部拉伸',
    price: '$2.25',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '日常动作',
    tags: ['新品'],
    rating: 4.3,
    downloads: 680,
    originalPrice: '$2.75',
    description: '健身热身动作，精确捕捉肌肉拉伸细节'
  },
  {
    id: 6,
    title: '防御招式',
    price: '$2.25',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '战斗动作',
    tags: ['热门', '推荐'],
    rating: 4.9,
    downloads: 1560,
    originalPrice: '$3.00',
    description: '多种格斗防御姿势组合，适合各类战斗场景'
  },
  {
    id: 7,
    title: '下蹲',
    price: '$2.25',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '日常动作',
    tags: ['基础'],
    rating: 4.1,
    downloads: 2340,
    originalPrice: '$2.50',
    description: '标准下蹲动作，适用于各种场景和角色'
  },
  {
    id: 8,
    title: '向下前踢L',
    price: '$1.50',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '战斗动作',
    tags: ['热门'],
    rating: 4.6,
    downloads: 925,
    originalPrice: '$2.00',
    description: '左腿向下前踢，适合格斗和武术场景'
  },
  {
    id: 9,
    title: '跳入',
    price: '$1.50',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '动作',
    tags: ['基础'],
    rating: 4.0,
    downloads: 720,
    originalPrice: '$1.80',
    description: '基础跳跃进入动作，可用于各种游戏场景'
  },
  {
    id: 10,
    title: '肘击L',
    price: '$1.50',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '战斗动作',
    tags: ['热门'],
    rating: 4.4,
    downloads: 830,
    originalPrice: '$2.00',
    description: '左肘击打动作，力量感强，动作流畅'
  }
];

// 分类数据
const categories = [
  { name: '全部', count: 523 },
  { name: '战斗动作', count: 156 },
  { name: '日常动作', count: 94 },
  { name: '舞蹈动作', count: 78 },
  { name: '表情动作', count: 45 },
  { name: '特殊动作', count: 37 },
  { name: '互动动作', count: 24 }
];

// 标签数据
const tagItems = [
  { name: '全部', icon: null },
  { name: '热门', icon: <StarOutlined style={{ color: '#ff4d4f' }} /> },
  { name: '新品', icon: null },
  { name: '推荐', icon: null },
  { name: '基础', icon: null },
  { name: 'VIP', icon: null }
];

const MotionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [motions, setMotions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedTags, setSelectedTags] = useState(['全部']);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setMotions(mockMotions);
      setLoading(false);
    }, 500);
  }, []);

  // 处理标签选择
  const handleTagSelect = (tag) => {
    if (tag === '全部') {
      setSelectedTags(['全部']);
    } else {
      const newTags = selectedTags.filter(t => t !== '全部');
      if (newTags.includes(tag)) {
        // 如果已选中，则取消
        const filteredTags = newTags.filter(t => t !== tag);
        setSelectedTags(filteredTags.length === 0 ? ['全部'] : filteredTags);
      } else {
        // 如果未选中，则添加
        setSelectedTags([...newTags, tag]);
      }
    }
  };

  // 过滤资源
  const filteredMotions = motions.filter(motion => {
    // 搜索文本过滤
    const matchesSearch = searchText ? 
      motion.title.toLowerCase().includes(searchText.toLowerCase()) || 
      motion.description.toLowerCase().includes(searchText.toLowerCase()) : 
      true;
    
    // 分类过滤
    const matchesCategory = selectedCategory === '全部' || motion.category === selectedCategory;
    
    // 标签过滤
    const matchesTags = selectedTags.includes('全部') || 
      motion.tags.some(tag => selectedTags.includes(tag));
    
    // 价格过滤（去除$符号后转为数字）
    const price = parseFloat(motion.price.replace('$', ''));
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesTags && matchesPrice;
  });

  // 排序资源
  const sortedMotions = [...filteredMotions].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
      case 'price-desc':
        return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
      default:
        return b.id - a.id; // 假设id越大越新
    }
  });

  return (
    <div className="motion-library bg-[#121212] min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      {/* 页面标题 */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">动作资源库</h1>
        <p className="text-gray-400">专业级动作捕捉数据，助力您的游戏和动画项目</p>
      </div>
      
      {/* 顶部筛选区 */}
      <div className="filter-section bg-[#1a1a1a] rounded-lg p-4 mb-6 shadow-lg">
        {/* 搜索和排序 */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <Input 
              placeholder="搜索动作资源..." 
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="bg-[#252525] border-gray-700 text-white hover:border-yellow-500 focus:border-yellow-500"
            />
          </div>
          
          <div className="flex space-x-4">
            <Select 
              defaultValue="newest" 
              style={{ width: 120 }} 
              onChange={value => setSortBy(value)}
              className="bg-[#252525]"
              dropdownClassName="bg-[#252525]"
            >
              <Option value="newest">最新上架</Option>
              <Option value="popular">最受欢迎</Option>
              <Option value="rating">评分最高</Option>
              <Option value="price-asc">价格从低到高</Option>
              <Option value="price-desc">价格从高到低</Option>
            </Select>
            
            <Button icon={<FilterOutlined />} type="primary" ghost>
              筛选
            </Button>
          </div>
        </div>
        
        {/* 分类选项卡 */}
        <Tabs defaultActiveKey="全部" onChange={value => setSelectedCategory(value)}>
          {categories.map(category => (
            <TabPane 
              tab={`${category.name} (${category.count})`} 
              key={category.name}
            />
          ))}
        </Tabs>
        
        {/* 标签过滤 */}
        <div className="flex flex-wrap items-center mt-4">
          <span className="text-gray-400 mr-3">标签:</span>
          <Space size={[8, 16]} wrap>
            {tagItems.map(tag => {
              const isSelected = selectedTags.includes(tag.name);
              return (
                <Tag
                  key={tag.name}
                  color={isSelected ? '#D4AF37' : ''}
                  style={{ 
                    cursor: 'pointer',
                    borderColor: isSelected ? '#D4AF37' : '#444',
                    backgroundColor: isSelected ? '' : '#333'
                  }}
                  icon={tag.icon}
                  onClick={() => handleTagSelect(tag.name)}
                >
                  {tag.name}
                </Tag>
              );
            })}
          </Space>
        </div>
        
        {/* 价格滑块 */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">价格范围:</span>
            <span className="text-yellow-400">¥{priceRange[0]} - ¥{priceRange[1]}</span>
          </div>
          <Slider
            range
            defaultValue={[0, 100]}
            onChange={value => setPriceRange(value)}
            min={0}
            max={100}
          />
        </div>
      </div>
      
      {/* 资源列表 */}
      <div className="resources-container">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            找到 <span className="text-yellow-400">{sortedMotions.length}</span> 个资源
          </h2>
          <div className="text-gray-400 text-sm">
            第 1-{sortedMotions.length} 项，共 {sortedMotions.length} 项
          </div>
        </div>
        
        {/* 网格布局的资源卡片 - 使用Tailwind grid实现紧凑展示 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 justify-center">
          {sortedMotions.map(motion => (
            <MotionCard 
              key={motion.id} 
              id={motion.id}
              name={motion.title}
              rating={motion.rating}
              downloads={motion.downloads}
              price={parseFloat(motion.price.replace('$', ''))}
              oldPrice={motion.originalPrice ? parseFloat(motion.originalPrice.replace('$', '')) : undefined}
              tags={motion.tags}
              thumbnail={motion.thumbnail}
              hoverPreview={motion.thumbnail}
            />
          ))}
        </div>
        
        {/* 空状态 */}
        {sortedMotions.length === 0 && !loading && (
          <div className="empty-state text-center py-16">
            <div className="text-gray-500 text-5xl mb-4">¯\_(ツ)_/¯</div>
            <p className="text-gray-400 text-lg mb-2">没有找到符合条件的资源</p>
            <p className="text-gray-500">请尝试调整筛选条件</p>
          </div>
        )}
        
        {/* 加载中状态 */}
        {loading && (
          <div className="loading-state text-center py-16">
            <div className="text-yellow-400 text-lg">正在加载资源...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MotionsPage; 