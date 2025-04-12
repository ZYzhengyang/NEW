import React from 'react';
import NavBar from '../components/ui/NavBar';
import Footer from '../components/ui/Footer';
import CategoryNav from '../components/ui/CategoryNav';
import SidebarMenu from '../components/ui/SidebarMenu';
import ResourceGrid from '../components/ui/ResourceGrid';

// 模拟数据
const generateMockResources = (count) => {
  const types = ['motion', 'model', 'pack'];
  const tags = [['热门'], ['新品'], ['基础'], ['推荐'], ['VIP'], []];
  
  return Array.from({ length: count }).map((_, index) => ({
    id: `res-${index}`,
    title: `测试资源 ${index + 1}`,
    thumbnail: `/placeholder-${(index % 5) + 1}.jpg`,
    author: `作者${index % 10}`,
    type: types[index % types.length],
    price: `¥${Math.floor(Math.random() * 200) + 10}`,
    originalPrice: Math.random() > 0.5 ? `¥${Math.floor(Math.random() * 300) + 100}` : null,
    tags: tags[index % tags.length],
    isFavorite: false
  }));
};

const mockTopResources = generateMockResources(8);
const mockNewResources = generateMockResources(16);
const mockFreeResources = generateMockResources(8);

const Banner = () => (
  <div className="relative h-64 bg-gray-900 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-30"></div>
    <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold text-white mb-2">
          <span className="text-amber-400">ActorCore</span> 华弦动作资源平台
        </h1>
        <p className="text-gray-300 text-sm mb-4">
          高品质3D动作资源库，为您的游戏和动画项目提供专业动作素材
        </p>
        <button className="bg-amber-500 hover:bg-amber-400 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors">
          立即探索
        </button>
      </div>
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* 顶部导航 */}
      <NavBar />
      
      {/* 主横幅 */}
      <Banner />
      
      {/* 分类导航 */}
      <div className="py-3 border-b border-gray-800">
        <CategoryNav />
      </div>
      
      {/* 主内容区 */}
      <div className="flex flex-1">
        {/* 侧边栏 */}
        <div className="w-64 shrink-0 hidden md:block">
          <SidebarMenu />
        </div>
        
        {/* 资源列表区域 */}
        <div className="flex-1 px-4 max-w-[100vw] overflow-x-hidden">
          {/* 置顶资源 */}
          <ResourceGrid 
            title="精选资源" 
            resources={mockTopResources} 
            viewAllLink="/category/featured" 
          />
          
          {/* 最新资源 */}
          <ResourceGrid 
            title="最新上架" 
            resources={mockNewResources} 
            viewAllLink="/category/new" 
          />
          
          {/* 免费资源 */}
          <ResourceGrid 
            title="免费资源" 
            resources={mockFreeResources} 
            viewAllLink="/category/free" 
          />
        </div>
      </div>
      
      {/* 页脚 */}
      <Footer />
    </div>
  );
};

export default Home; 