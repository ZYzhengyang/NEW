import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../components/ui/NavBar';
import Footer from '../components/ui/Footer';

// 这里将来会导入3D预览器组件
// import ModelViewer from '../components/EnhancedModelViewer';

const ResourceDetail = () => {
  const { id, type } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedResources, setRelatedResources] = useState([]);

  // 模拟API请求加载资源详情
  useEffect(() => {
    // 实际项目中这里会调用API获取数据
    setTimeout(() => {
      // 模拟数据
      setResource({
        id,
        title: '专业级动作资源',
        description: '这是一个高质量的专业级3D动作资源，适用于游戏和动画项目。包含完整的动作序列和过渡效果。',
        type: type || 'motion',
        price: '$9.99',
        originalPrice: '$14.99',
        author: 'ActorCore专业团队',
        thumbnail: '/placeholder.png',
        downloadCount: 1256,
        rating: 4.7,
        fileFormat: 'FBX',
        polygonCount: '12,000',
        fileSize: '15 MB',
        releaseDate: '2023-09-15',
        tags: ['专业', '游戏', '动画', '武术'],
        previewUrl: '/sample.fbx'
      });

      // 模拟加载相关资源
      setRelatedResources([
        {
          id: 101,
          title: '格斗组合动作',
          thumbnail: '/placeholder.png',
          price: '$8.99',
          type: 'motion'
        },
        {
          id: 102,
          title: '武术套路',
          thumbnail: '/placeholder.png',
          price: '$7.99',
          type: 'motion'
        },
        {
          id: 103,
          title: '跑步循环',
          thumbnail: '/placeholder.png',
          price: '$5.99',
          type: 'motion'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, [id, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-amber-400 text-xl">加载中...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-black">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-red-500 text-xl">资源不存在或已被删除</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <Link to="/" className="text-amber-400 hover:text-amber-300">首页</Link>
          <span className="text-gray-600 mx-2">/</span>
          <Link to={`/category/${resource.type}s`} className="text-amber-400 hover:text-amber-300">{resource.type === 'motion' ? '动作资源' : resource.type === 'model' ? '模型资源' : '资源套装'}</Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className="text-gray-400">{resource.title}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：3D预览器（将来会集成） */}
          <div className="lg:col-span-2 bg-gray-900 rounded-lg overflow-hidden border border-gray-800 aspect-video flex items-center justify-center">
            <div className="text-center p-10">
              <div className="text-amber-400 text-lg mb-3">3D预览器</div>
              <p className="text-gray-400 mb-4">这里将集成3D预览器组件</p>
              <p className="text-gray-500 text-sm">将poe-preview.html的预览功能整合到这里</p>
            </div>
          </div>
          
          {/* 右侧：资源信息与购买按钮 */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h1 className="text-2xl font-bold text-white mb-2">{resource.title}</h1>
            
            <div className="flex items-center text-sm text-gray-400 mb-4">
              <span>作者: {resource.author}</span>
              <span className="mx-2">•</span>
              <span>下载: {resource.downloadCount}</span>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <span>评分: {resource.rating}</span>
                <div className="ml-1 text-amber-400">★★★★★</div>
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="text-amber-400 text-2xl font-bold">{resource.price}</div>
              {resource.originalPrice && (
                <div className="text-gray-500 line-through ml-2">{resource.originalPrice}</div>
              )}
            </div>
            
            <div className="space-y-3 mb-6">
              <button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 rounded-md transition-colors">
                立即购买
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-md border border-amber-700/30 transition-colors">
                加入购物车
              </button>
              <button className="w-full bg-transparent hover:bg-gray-800 text-amber-400 font-medium py-3 rounded-md border border-amber-500 transition-colors">
                收藏资源
              </button>
            </div>
            
            <div className="border-t border-gray-800 pt-4 space-y-3">
              <h3 className="text-white font-medium">资源信息</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">文件格式</div>
                <div className="text-white">{resource.fileFormat}</div>
                
                <div className="text-gray-400">多边形数量</div>
                <div className="text-white">{resource.polygonCount}</div>
                
                <div className="text-gray-400">文件大小</div>
                <div className="text-white">{resource.fileSize}</div>
                
                <div className="text-gray-400">发布日期</div>
                <div className="text-white">{resource.releaseDate}</div>
              </div>
              
              <div className="pt-2">
                <div className="text-gray-400 mb-1 text-sm">标签</div>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-800 text-amber-400 text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 资源描述 */}
        <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">资源描述</h2>
          <p className="text-gray-300 whitespace-pre-line">{resource.description}</p>
        </div>
        
        {/* 相关资源 */}
        {relatedResources.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">相关资源</h2>
              <Link to="/category/motions" className="text-amber-400 hover:text-amber-300 text-sm">
                查看更多
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedResources.map(item => (
                <Link key={item.id} to={`/${item.type}/${item.id}`} className="block group">
                  <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-amber-600/40 transition-all">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-white text-sm font-medium truncate group-hover:text-amber-400 transition-colors">
                        {item.title}
                      </h3>
                      <div className="mt-1 text-amber-400 text-sm font-medium">
                        {item.price}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ResourceDetail; 