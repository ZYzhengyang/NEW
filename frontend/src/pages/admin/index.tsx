import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiService } from '@/services/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMotions: 0,
    pendingMotions: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalDownloads: 0,
    totalViews: 0
  })
  
  const [recentMotions, setRecentMotions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 加载统计信息和最近资源
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // 获取动作资源统计
        const motionsResponse = await apiService.motions.getAll({
          page: 1,
          pageSize: 5,
          sort: 'newest'
        })
        
        if (motionsResponse.isSuccess) {
          setRecentMotions(motionsResponse.result.items)
          
          // 模拟统计数据，实际项目中应该从后端API获取
          setStats({
            totalMotions: motionsResponse.result.totalCount,
            pendingMotions: motionsResponse.result.items.filter(m => m.status === 'pending').length,
            totalUsers: 120,
            totalCategories: 8,
            totalDownloads: motionsResponse.result.items.reduce((sum, motion) => sum + motion.downloadCount, 0),
            totalViews: motionsResponse.result.items.reduce((sum, motion) => sum + motion.viewCount, 0)
          })
        }
      } catch (err) {
        console.error('获取仪表盘数据失败', err)
        setError('获取仪表盘数据失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  // 状态标签样式
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // 状态显示文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '已审核'
      case 'pending':
        return '待审核'
      case 'rejected':
        return '已拒绝'
      default:
        return '未知'
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">仪表盘</h1>
      
      {loading ? (
        <div className="mt-6 flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="mt-6 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* 数据统计卡片 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* 总资源卡片 */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">总资源</p>
                  <p className="text-2xl font-semibold">{stats.totalMotions}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* 待审核资源卡片 */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">待审核资源</p>
                  <p className="text-2xl font-semibold">{stats.pendingMotions}</p>
                </div>
                <div className="rounded-full bg-orange-100 p-3 text-orange-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* 总用户卡片 */}
            <Link to="/admin/users" className="rounded-lg bg-white p-4 shadow-sm transition-transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">总用户</p>
                  <p className="text-2xl font-semibold">{stats.totalUsers}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-3 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* 总下载量卡片 */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">资源下载量</p>
                  <p className="text-2xl font-semibold">{stats.totalDownloads}</p>
                </div>
                <div className="rounded-full bg-indigo-100 p-3 text-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* 总浏览量卡片 */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">资源浏览量</p>
                  <p className="text-2xl font-semibold">{stats.totalViews}</p>
                </div>
                <div className="rounded-full bg-pink-100 p-3 text-pink-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* 分类数卡片 */}
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">资源分类</p>
                  <p className="text-2xl font-semibold">{stats.totalCategories}</p>
                </div>
                <div className="rounded-full bg-purple-100 p-3 text-purple-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* 最近添加的资源 */}
          <div className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">最近添加的资源</h2>
            
            <div className="overflow-hidden overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      资源名称
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      分类
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      价格
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      添加时间
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">操作</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentMotions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        暂无资源
                      </td>
                    </tr>
                  ) : (
                    recentMotions.map((motion) => (
                      <tr key={motion.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                              {motion.thumbnailUrl ? (
                                <img src={motion.thumbnailUrl} alt={motion.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{motion.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {motion.categoryName || '未分类'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {motion.price > 0 ? `¥${motion.price}` : '免费'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(motion.status)}`}>
                            {getStatusText(motion.status)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {new Date(motion.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <Link
                            to={`/admin/motions/edit/${motion.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            编辑
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-right">
              <Link
                to="/admin/motions"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                查看所有资源 →
              </Link>
            </div>
          </div>
          
          {/* 快捷操作卡片 */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-medium">添加新资源</h3>
              <p className="mb-4 text-sm text-muted-foreground">上传新的动作资源并配置相关信息</p>
              <Link
                to="/admin/motions/edit"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                添加资源
              </Link>
            </div>
            
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-medium">管理分类</h3>
              <p className="mb-4 text-sm text-muted-foreground">创建、编辑和删除资源分类</p>
              <Link
                to="/admin/categories"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                  <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                </svg>
                管理分类
              </Link>
            </div>
            
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-medium">系统设置</h3>
              <p className="mb-4 text-sm text-muted-foreground">配置站点信息和系统参数</p>
              <Link
                to="/admin/settings"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                系统设置
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboard 