import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiService, MotionAsset } from '@/services/api'
import SceneViewer from '@/components/viewer/SceneViewer'
import AnimationControls from '@/components/viewer/AnimationControls'

const MotionDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [motion, setMotion] = useState<MotionAsset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentAnimation, setCurrentAnimation] = useState(-1)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const [relatedMotions, setRelatedMotions] = useState<MotionAsset[]>([])

  useEffect(() => {
    if (!id) return
    
    const fetchMotion = async () => {
      setLoading(true)
      try {
        const response = await apiService.motions.getById(Number(id))
        
        if (response.isSuccess) {
          setMotion(response.result)
          
          // 增加浏览次数
          apiService.motions.incrementView(Number(id)).catch(console.error)
          
          // 获取相关动作资源
          fetchRelatedMotions(response.result.categoryId)
        } else {
          setError(response.message || '获取资源失败')
        }
      } catch (err) {
        console.error('获取动作资源详情失败', err)
        setError('获取动作资源详情失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }
    
    fetchMotion()
  }, [id])
  
  const fetchRelatedMotions = async (categoryId: number) => {
    try {
      const params = {
        categoryId,
        status: 'approved',
        pageSize: 4,
      }
      
      const response = await apiService.motions.getAll(params)
      
      if (response.isSuccess) {
        // 过滤掉当前资源
        const filtered = response.result.items.filter(item => item.id !== Number(id))
        setRelatedMotions(filtered.slice(0, 3)) // 最多显示3个相关资源
      }
    } catch (err) {
      console.error('获取相关资源失败', err)
    }
  }
  
  // 处理动画信息
  const animations = motion?.animationUrls.map((url, index) => ({
    name: `动画 ${index + 1}`,
    duration: 3.0 // 默认动画长度，实际应该从模型中获取
  })) || []
  
  const handleAnimationChange = (index: number) => {
    setCurrentAnimation(index)
  }
  
  const handleDownload = () => {
    if (!motion) return
    
    // 实现下载逻辑，可能需要先检查用户是否已购买或资源是否免费
    const a = document.createElement('a')
    a.href = motion.modelUrl
    a.download = motion.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    // 增加下载次数统计
    apiService.motions.incrementDownload?.(motion.id).catch(console.error)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (error || !motion) {
    return (
      <div className="container mx-auto py-12">
        <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mb-1 text-xl font-semibold">资源不存在或已被删除</h2>
          <p className="mb-4 text-muted-foreground">{error || '请确认资源ID是否正确'}</p>
          <Link
            to="/motions"
            className="inline-block rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
          >
            返回资源库
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* 面包屑导航 */}
      <div className="mb-6">
        <nav className="flex text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground">首页</Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <Link to="/motions" className="text-muted-foreground hover:text-foreground">动作库</Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="font-medium">{motion.name}</span>
        </nav>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        {/* 左侧预览和控制 */}
        <div className="lg:col-span-2">
          {/* 3D 预览 */}
          <div className="mb-6 overflow-hidden rounded-lg border bg-card shadow-sm">
            <SceneViewer
              modelUrl={motion.modelUrl}
              animationUrls={motion.animationUrls}
              modelType={motion.modelUrl.endsWith('.gltf') || motion.modelUrl.endsWith('.glb') ? 'gltf' : 'fbx'}
              height="500px"
            />
          </div>
          
          {/* 动画控制 */}
          {motion.animationUrls.length > 0 && (
            <div className="mb-6">
              <AnimationControls
                animations={animations}
                currentAnimation={currentAnimation}
                onAnimationChange={handleAnimationChange}
                onPlayPause={setIsPlaying}
                onSpeedChange={setPlaybackSpeed}
                isPlaying={isPlaying}
              />
            </div>
          )}
          
          {/* 详细信息 */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">详细信息</h2>
            
            <div className="mb-6 prose max-w-none">
              <p>{motion.description || '暂无描述'}</p>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="mb-3 text-lg font-semibold">资源信息</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">资源类型:</span>
                    <span>{motion.categoryName}</span>
                  </div>
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">文件格式:</span>
                    <span>{motion.modelUrl.split('.').pop()?.toUpperCase()}</span>
                  </div>
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">动画数量:</span>
                    <span>{motion.animationUrls.length || '无独立动画'}</span>
                  </div>
                </div>
                
                <div>
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">发布时间:</span>
                    <span>{new Date(motion.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">浏览次数:</span>
                    <span>{motion.viewCount}</span>
                  </div>
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">下载次数:</span>
                    <span>{motion.downloadCount}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 标签 */}
            {motion.tags && motion.tags.length > 0 && (
              <div className="mt-6 border-t pt-6">
                <h3 className="mb-3 text-lg font-semibold">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {motion.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 右侧信息和操作 */}
        <div>
          <div className="sticky top-4 space-y-6">
            {/* 资源信息卡片 */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h1 className="mb-2 text-2xl font-bold">{motion.name}</h1>
              
              <div className="mb-4 flex items-center space-x-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  {motion.categoryName}
                </span>
              </div>
              
              <div className="mb-6">
                <div className="mb-1 text-lg font-bold text-primary">
                  {motion.price > 0 ? `¥${motion.price}` : '免费'}
                </div>
                {motion.price > 0 && (
                  <div className="text-sm text-muted-foreground">
                    支持一次付款终身使用
                  </div>
                )}
              </div>
              
              <div className="mb-6 flex flex-col space-y-3">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {motion.price > 0 ? '购买并下载' : '免费下载'}
                </button>
                
                <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  收藏
                </button>
              </div>
              
              <div className="border-t pt-4 text-sm text-muted-foreground">
                <div className="mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  安全可靠的资源
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  提供技术支持
                </div>
              </div>
            </div>
            
            {/* 创作者信息 */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">创作者</h3>
              
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                  {/* 用户头像占位符 */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div>
                  <div className="font-medium">{motion.userName || '匿名用户'}</div>
                  <div className="text-sm text-muted-foreground">动作设计师</div>
                </div>
              </div>
              
              <div className="mt-4">
                <button className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  查看创作者主页
                </button>
              </div>
            </div>
            
            {/* 相关资源 */}
            {relatedMotions.length > 0 && (
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">相关资源</h3>
                
                <div className="space-y-4">
                  {relatedMotions.map((item) => (
                    <Link
                      key={item.id}
                      to={`/motions/${item.id}`}
                      className="flex items-center space-x-3 rounded-md p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="h-12 w-12 overflow-hidden rounded bg-gray-100">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="truncate font-medium">{item.name}</div>
                        <div className="text-sm text-primary">
                          {item.price > 0 ? `¥${item.price}` : '免费'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MotionDetailPage 