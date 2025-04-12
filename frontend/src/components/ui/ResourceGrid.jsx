import React from 'react';
import { Link } from 'react-router-dom';
import ResourceCard from './ResourceCard';

const ResourceGrid = ({ title, resources, viewAllLink, emptyMessage = "暂无资源" }) => {
  return (
    <div className="relative w-full mb-6 bg-gray-950/70 rounded-lg border border-gray-800 overflow-hidden backdrop-blur-sm shadow-lg">
      {/* 发光背景效果 */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-900 via-amber-950/10 to-gray-900 rounded-lg blur-sm opacity-30 -z-10"></div>
      
      {/* 标题区域 */}
      <div className="flex justify-between items-center border-b border-gray-800 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900">
        <div className="p-3 sm:p-4">
          <h2 className="text-base sm:text-lg font-semibold relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-300">
              {title}
            </span>
            {/* 装饰线 */}
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-500/0"></span>
          </h2>
        </div>
        
        {viewAllLink && (
          <Link 
            to={viewAllLink} 
            className="text-xs text-gray-400 hover:text-amber-400 transition-colors duration-300 mr-4 flex items-center gap-1 group"
          >
            查看全部 
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      
      {/* 资源网格 - 修改为一行显示更多卡片 */}
      <div className="p-2 sm:p-3">
        {resources && resources.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3">
            {resources.map((resource) => (
              <div key={resource.id || resource.uniqueId} className="resource-card-wrapper transform transition-transform duration-300 hover:z-10">
                <ResourceCard resource={resource} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-900/50 rounded-lg border border-gray-800/50">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="mx-auto h-8 w-8 text-gray-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
              />
            </svg>
            <p className="mt-2 text-sm">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceGrid; 