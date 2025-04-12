import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: '动作', path: '/category/motions' },
    { name: '模型', path: '/category/models' },
    { name: '套装', path: '/category/packs' },
    { name: '角色', path: '/category/characters' },
  ];

  return (
    <nav className="bg-black bg-opacity-90 border-b border-amber-700/30 sticky top-0 z-50 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-amber-400 font-bold text-lg mr-1 drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]">ActorCore</span>
              <span className="text-white text-base">华弦</span>
            </Link>
          </div>

          {/* 搜索框 */}
          <div className="hidden md:block flex-1 max-w-xl mx-5">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索资源..."
                className="w-full bg-gray-900/70 border border-amber-700/30 rounded-md py-1.5 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all focus:bg-gray-900 text-sm"
              />
              <button className="absolute inset-y-0 right-0 px-3 flex items-center text-amber-400 hover:text-amber-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* 导航链接 - 桌面端 */}
          <div className="hidden md:flex items-center space-x-1">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="text-gray-300 hover:text-amber-400 hover:bg-gray-800/50 px-2 py-1.5 rounded-md text-xs font-medium transition-colors relative group"
              >
                {category.name}
                <span className="absolute bottom-0.5 left-2 right-2 h-0.5 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Link>
            ))}
            
            <div className="ml-3 flex items-center space-x-3 border-l border-gray-700/50 pl-3">
              <Link to="/favorite" className="text-gray-300 hover:text-amber-400 relative group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[8px] rounded-full w-3 h-3 flex items-center justify-center">
                  0
                </span>
              </Link>
              
              <Link to="/cart" className="text-gray-300 hover:text-amber-400 relative group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[8px] rounded-full w-3 h-3 flex items-center justify-center">
                  0
                </span>
              </Link>
              
              <Link
                to="/login"
                className="border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black px-3 py-1 rounded-md text-xs font-medium transition-colors duration-300 shadow-[0_0_10px_rgba(212,175,55,0.1)] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                登录
              </Link>
            </div>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white p-1 rounded-md hover:bg-gray-800/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md py-2 px-4 space-y-1 border-t border-amber-700/20 shadow-lg">
          <div className="mb-2">
            <input
              type="text"
              placeholder="搜索资源..."
              className="w-full bg-gray-800 border border-amber-700/30 rounded-md py-1 px-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
            />
          </div>
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="block py-1.5 text-gray-300 hover:text-amber-400 border-b border-gray-800 last:border-0 text-sm"
            >
              {category.name}
            </Link>
          ))}
          <div className="pt-2 flex justify-between items-center">
            <Link
              to="/login"
              className="text-amber-400 flex items-center text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              登录/注册
            </Link>
            <div className="flex space-x-3">
              <Link to="/favorite" className="text-gray-300 hover:text-amber-400 relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
              <Link to="/cart" className="text-gray-300 hover:text-amber-400 relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar; 