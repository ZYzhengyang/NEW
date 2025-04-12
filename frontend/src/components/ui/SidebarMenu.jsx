import React from 'react';
import { Link } from 'react-router-dom';

const SidebarMenu = () => {
  const categories = [
    { name: '动作', icon: '🏃', path: '/category/motion' },
    { name: '表情', icon: '😊', path: '/category/expression' },
    { name: '场景', icon: '🏞️', path: '/category/scene' },
    { name: '道具', icon: '🔮', path: '/category/prop' },
    { name: '角色', icon: '👤', path: '/category/character' },
    { name: '特效', icon: '✨', path: '/category/effect' },
    { name: '音效', icon: '🔊', path: '/category/sound' },
  ];

  const hotTags = [
    { name: '热门', path: '/tag/hot' },
    { name: '新品', path: '/tag/new' },
    { name: '推荐', path: '/tag/recommended' },
    { name: '免费', path: '/tag/free' },
  ];

  return (
    <div className="bg-gray-900 border-r border-gray-800 w-40 flex-shrink-0 h-full">
      <div className="p-3">
        <h3 className="text-white text-xs font-medium mb-2 px-2 uppercase tracking-wider">素材分类</h3>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.path}>
              <Link
                to={category.path}
                className="flex items-center px-2 py-1.5 text-gray-400 hover:text-amber-400 hover:bg-gray-800 rounded text-xs group transition-colors"
              >
                <span className="mr-2 text-xs opacity-70 group-hover:opacity-100">{category.icon}</span>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="border-t border-gray-800 mt-2 pt-3 px-3">
        <h3 className="text-white text-xs font-medium mb-2 px-2 uppercase tracking-wider">热门标签</h3>
        <ul className="space-y-1">
          {hotTags.map((tag) => (
            <li key={tag.path}>
              <Link
                to={tag.path}
                className="flex items-center px-2 py-1.5 text-gray-400 hover:text-amber-400 hover:bg-gray-800 rounded text-xs transition-colors"
              >
                <span className="w-1 h-1 rounded-full bg-amber-500 mr-2"></span>
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="border-t border-gray-800 mt-2 p-3">
        <Link 
          to="/vip" 
          className="flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-xs font-medium rounded transition-colors"
        >
          <span className="mr-1">👑</span> VIP会员
        </Link>
      </div>
    </div>
  );
};

export default SidebarMenu; 