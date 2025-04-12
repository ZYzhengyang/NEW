import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiService, MotionAsset, MotionCategory } from '@/services/api'

const MotionsPage = () => {
  const [motions, setMotions] = useState<MotionAsset[]>([])
  const [categories, setCategories] = useState<MotionCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 筛选状态
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('newest')
  
  // 分页
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const pageSize = 12

  // 加载动作资源和分类
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 获取分类列表
        const categoriesRes = await apiService.categories.getAll()
        if (categoriesRes.isSuccess) {
          setCategories(categoriesRes.result)
        }
        
        // 获取动作资源列表
        await fetchMotions()
      } catch (err) {
        console.error('获取数据失败', err)
        setError('获取数据失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // 当筛选条件改变时重新加载资源
  useEffect(() => {
    fetchMotions()
  }, [selectedCategory, searchTerm, sortOption, currentPage])
  
  const fetchMotions = async () => {
    try {
      setLoading(true)
      
      // 准备查询参数
      const params: {
        page: number;
        pageSize: number;
        categoryId?: number;
        search?: string;
        status: string;
        sort?: string;
      } = {
        page: currentPage,
        pageSize,
        status: 'approved', // 只获取已审核的资源
      }
      
      if (selectedCategory) {
        params.categoryId = selectedCategory
      }
      
      if (searchTerm.trim()) {
        params.search = searchTerm.trim()
      }
      
      if (sortOption) {
        params.sort = sortOption
      }
      
      const response = await apiService.motions.getAll(params)
      
      if (response.isSuccess) {
        const { items, totalCount, totalPages: pages } = response.result
        setMotions(items)
        setTotalItems(totalCount)
        setTotalPages(pages)
      } else {
        setError(response.message || '获取资源失败')
      }
    } catch (err) {
      console.error('获取动作资源失败', err)
      setError('获取动作资源失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }
  
  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1) // 重置页码
  }
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value)
    setCurrentPage(1) // 重置页码
  }
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // 重置页码
  }
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">动作资源库</h1>
        <p className="text-muted-foreground">
          浏览并下载高质量的3D动作资源，支持FBX和GLTF格式
        </p>
      </div>
      
      {/* 筛选工具栏 */}
      <div className="mb-8 rounded-lg border bg-card p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          {/* 搜索框 */}
          <div>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索动作资源..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-400 transition-colors hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
          
          {/* 分类筛选 */}
          <div>
            <select
              value={selectedCategory || ''}
              onChange={(e) => handleCategoryChange(e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">所有分类</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* 排序方式 */}
          <div>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="newest">最新上传</option>
              <option value="popular">最受欢迎</option>
              <option value="price_low">价格低到高</option>
              <option value="price_high">价格高到低</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* 分类标签 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`rounded-full px-4 py-1 text-sm transition-colors ${
            selectedCategory === null
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`rounded-full px-4 py-1 text-sm transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      {/* 加载状态 */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
      
      {/* 资源列表 */}
      {!loading && motions.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
          </svg>
          <h3 className="mb-1 text-lg font-medium">未找到动作资源</h3>
          <p className="text-muted-foreground">
            尝试调整筛选条件或清除搜索关键词
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {motions.map((motion) => (
            <Link 
              key={motion.id} 
              to={`/motions/${motion.id}`}
              className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                {motion.thumbnailUrl ? (
                  <img
                    src={motion.thumbnailUrl}
                    alt={motion.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="mb-1 text-sm text-muted-foreground">
                  {motion.categoryName}
                </div>
                <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
                  {motion.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">
                    {motion.price > 0 ? `¥${motion.price}` : '免费'}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {motion.viewCount}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* 分页 */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`rounded-md border px-3 py-2 ${
                currentPage === 1
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-gray-100'
              }`}
            >
              上一页
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`rounded-md px-3 py-2 ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'border hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`rounded-md border px-3 py-2 ${
                currentPage === totalPages
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-gray-100'
              }`}
            >
              下一页
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-8 rounded-lg bg-gray-50 p-6 text-center">
        <h3 className="mb-2 text-xl font-semibold">想要分享您的动作资源？</h3>
        <p className="mx-auto mb-4 max-w-2xl text-muted-foreground">
          您可以上传自己创建的3D动作资源，与社区共享或出售。我们支持多种格式，包括FBX和GLTF。
        </p>
        <Link
          to="/login"
          className="inline-block rounded-md bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/90"
        >
          立即上传
        </Link>
      </div>
    </div>
  )
}

export default MotionsPage 