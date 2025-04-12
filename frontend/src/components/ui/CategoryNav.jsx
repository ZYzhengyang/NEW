import React from 'react';
import { Link } from 'react-router-dom';

const CategoryNav = () => {
  const categories = [
    { name: '全部', path: '/category/all' },
    { name: '动作', path: '/category/motion' },
    { name: '模型', path: '/category/model' },
    { name: '场景', path: '/category/scene' },
    { name: '角色', path: '/category/character' },
    { name: '道具', path: '/category/prop' },
    { name: '特效', path: '/category/effect' },
    { name: '音效', path: '/category/sound' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center flex-wrap">
        {categories.map((category) => (
          <Link
            key={category.path}
            to={category.path}
            className="text-xs px-3 py-1 mr-3 mb-2 text-gray-400 hover:text-amber-400 hover:bg-gray-900/40 rounded-full border border-gray-800 transition-colors"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav; 