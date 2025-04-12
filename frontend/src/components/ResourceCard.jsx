import React from 'react';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';

// MotionCard组件属性定义
const MotionCard = ({
  name,
  rating,
  downloads,
  price,
  oldPrice,
  tags = [],
  thumbnail,
  hoverPreview,
  id,
}) => {
  return (
    <div className="resource-card relative w-[170px] rounded-lg bg-[#1e1e1e] overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group h-[270px]">
      {/* 标签区 */}
      <div className="absolute top-1 right-1 z-10 flex flex-col gap-0.5">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="text-xs text-white px-1.5 py-0.5 rounded font-medium"
            style={{
              backgroundColor:
                tag === '热门' ? '#f43f5e' :  // 热门标签 - 红色
                tag === '新品' ? '#3b82f6' :  // 新品标签 - 蓝色
                tag === '基础' ? '#10b981' :  // 基础标签 - 绿色
                tag === '推荐' ? '#8b5cf6' :  // 推荐标签 - 紫色
                tag === 'VIP' ? '#d97706' : '#6b7280',  // VIP标签 - 金色，其他灰色
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 图片预览 - 固定高度且支持webm/gif */}
      <div className="w-full h-[160px] bg-[#252525] overflow-hidden">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300 absolute inset-0"
        />
        {hoverPreview && (
          <img
            src={hoverPreview}
            alt="preview"
            className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0"
          />
        )}
      </div>

      {/* 内容区 */}
      <div className="p-2 flex flex-col h-[110px]">
        <div>
          <h3 className="text-white font-medium text-xs truncate text-center mb-1">{name}</h3>
          <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-0.5 text-xs">{rating?.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 mr-0.5">⬇</span>
              <span className="text-xs">{downloads >= 1000 ? `${(downloads / 1000).toFixed(1)}k` : downloads}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-800">
          <div className="text-sm text-yellow-400 font-bold">
            ¥{price?.toFixed(2)}
            {oldPrice && (
              <span className="text-gray-500 text-xs line-through ml-1">¥{oldPrice?.toFixed(2)}</span>
            )}
          </div>
          <div className="flex gap-1">
            <button className="text-gray-500 hover:text-yellow-400 transition-colors text-xs">
              <HeartOutlined />
            </button>
            <button className="text-gray-500 hover:text-yellow-400 transition-colors text-xs">
              <ShoppingCartOutlined />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotionCard; 