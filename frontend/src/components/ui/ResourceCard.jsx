import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartOutlined, HeartFilled, DownloadOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';

const ResourceCard = ({ resource, showFavorites = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(resource.favorite || false);

  const {
    id,
    title,
    thumbnail,
    author,
    type,
    price,
    originalPrice,
    tags = [],
    description,
    downloads,
    views,
    likes
  } = resource;

  // 确定跳转的详情页路径
  const getDetailPath = () => {
    switch (type) {
      case 'motion':
        return `/motion/${id}`;
      case 'model':
        return `/model/${id}`;
      case 'pack':
        return `/pack/${id}`;
      default:
        return `/resource/${id}`;
    }
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div 
      className="group relative bg-gray-900/90 rounded overflow-hidden border border-gray-800 hover:border-amber-500/70 transition-all duration-300 transform hover:-translate-y-1 animate-breathing-glow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 呼吸光效背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* 闪烁装饰点 */}
      <div className="absolute inset-0 bg-[length:30px_30px] opacity-0 group-hover:opacity-20 group-hover:animate-sparkle pointer-events-none"></div>
      
      <Link to={getDetailPath()} className="block">
        {/* 缩略图容器 - 减小高度 */}
        <div className="relative aspect-video overflow-hidden bg-gray-950">
          <img 
            src={thumbnail || '/placeholder.png'} 
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
          
          {/* 发光边框效果 */}
          <div className="absolute inset-0 border border-amber-500/0 group-hover:border-amber-500/30 rounded-sm pointer-events-none"></div>
          
          {/* 标签 - 减小尺寸 */}
          {tags.length > 0 && (
            <div className="absolute top-1 left-1 flex flex-wrap gap-0.5">
              {tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-[10px] px-1 py-0.5 rounded bg-amber-600 text-white shadow-sm group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:via-amber-400 group-hover:to-amber-600 group-hover:bg-[length:400%_100%] group-hover:animate-bg-shine"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* 收藏按钮 - 减小尺寸 */}
          <button 
            onClick={toggleFavorite}
            className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black hover:scale-110 transition-all group-hover:animate-subtle-bounce"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill={isFavorite ? "currentColor" : "none"} 
              stroke="currentColor"
              className={`w-3 h-3 ${isFavorite ? 'text-amber-500' : 'text-white'} transition-colors duration-300`}
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
          
          {/* 类型标识 - 减小尺寸 */}
          <div className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/80 text-amber-400 text-[10px] rounded backdrop-blur-sm group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-800 group-hover:border-l group-hover:border-amber-500/50">
            {type === 'motion' ? '动作' : type === 'model' ? '模型' : '套装'}
          </div>
        </div>

        {/* 内容信息 - 减小内部间距 */}
        <div className="p-2 bg-gradient-to-b from-gray-900 to-gray-950 relative z-10">
          {/* 发光线条 */}
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 className="text-white font-medium line-clamp-1 text-xs group-hover:text-amber-400 transition-colors">
            {title}
          </h3>
          
          <div className="mt-1 flex justify-between items-center">
            <span className="text-gray-400 text-[10px] transition-colors group-hover:text-gray-300">
              {author ? `作者: ${author}` : type}
            </span>
            
            <div className="flex items-center">
              {originalPrice && (
                <span className="text-gray-500 line-through text-[10px] mr-1">
                  {originalPrice}
                </span>
              )}
              <span className="text-amber-400 font-medium text-xs group-hover:text-amber-300 transition-colors relative overflow-hidden">
                <span className="inline-block group-hover:animate-shimmer group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:via-yellow-300 group-hover:to-amber-400 group-hover:bg-[length:200%_100%] group-hover:bg-clip-text group-hover:text-transparent">
                  {price}
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ResourceCard; 