import React from 'react';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-700/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row px-6 py-12 md:py-16 lg:py-20">
          {/* 左侧文字区 */}
          <div className="lg:w-1/2 flex flex-col justify-center py-8 lg:pr-12">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                <span className="block">华弦3D动作资源</span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">专业级创作平台</span>
              </h1>
              <p className="mt-6 text-lg text-gray-300 max-w-xl">
                提供海量高质量3D动作、模型和角色资源，满足游戏开发、动画制作和虚拟现实等多领域创作需求。
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/category/motions"
                  className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-medium rounded-md hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-shadow duration-300 group relative overflow-hidden"
                >
                  <span className="absolute w-full h-full top-0 left-0 bg-gradient-to-r from-amber-400 to-amber-300 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <span className="relative">浏览动作库</span>
                </Link>
                <Link
                  to="/search"
                  className="px-8 py-3 bg-gray-800 text-amber-400 font-medium rounded-md border border-amber-700/30 hover:border-amber-500/70 transition-colors duration-300"
                >
                  资源搜索
                </Link>
              </div>
            </div>
          </div>
          
          {/* 右侧图像区 */}
          <div className="lg:w-1/2 mt-10 lg:mt-0 flex items-center justify-center lg:justify-end relative">
            <div className="relative w-full max-w-lg xl:max-w-xl">
              {/* 主图像 */}
              <div className="relative shadow-2xl rounded-lg overflow-hidden border border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <img
                  src="/banner-image.jpg" 
                  alt="3D动作资源"
                  className="w-full h-full object-cover"
                />
                
                {/* 悬浮标签1 */}
                <div className="absolute top-4 right-4 bg-amber-500/90 text-black px-3 py-1 rounded-full text-sm font-medium shadow-lg z-20">
                  专业级品质
                </div>
                
                {/* 悬浮标签2 */}
                <div className="absolute bottom-16 left-6 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-md text-sm shadow-lg z-20 border-l-2 border-amber-500">
                  <div className="font-medium text-amber-400">游戏开发资源</div>
                  <div className="text-xs mt-1">高品质动作捕捉数据</div>
                </div>
              </div>
              
              {/* 装饰元素 */}
              <div className="absolute -bottom-3 -right-3 w-40 h-40 bg-amber-500/5 rounded-full blur-md"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-700/10 rounded-full blur-md"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 底部渐变 */}
      <div className="h-16 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default Banner; 