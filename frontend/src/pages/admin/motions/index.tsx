import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiService, MotionAsset } from '@/services/api'

const AdminMotionsPage = () => {
  const [motions, setMotions] = useState<MotionAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 筛选状态
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // 分页
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  // 加载动作资源
  useEffect(() => {
    fetchMotions()
  }, [statusFilter, currentPage])
  
  const fetchMotions = async () => {
    try {
      setLoading(true)
      
      // 准备查询参数
      const params: {
        page: number;
        pageSize: number;
        search?: string;
        status?: string;
      } = {
        page: currentPage,
        pageSize,
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      
      if (searchTerm.trim()) {
        params.search = searchTerm.trim()
      }
      
      const response = await apiService.motions.getAll(params)
      
      if (response.isSuccess) {
        const { items, totalPages: pages } = response.result
        setMotions(items)
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
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // 重置页码
    fetchMotions()
  }
  
  const handleStatusChange = (status: 'all' | 'pending' | 'approved' | 'rejected') => {
    setStatusFilter(status)
    setCurrentPage(1) // 重置页码
  }
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  const handleUpdateStatus = async (id: number, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const response = await apiService.motions.updateStatus(id, status)
      
      if (response.isSuccess) {
        // 更新本地数据
        setMotions(prev => 
          prev.map(item => 
            item.id === id ? { ...item, status } : item
          )
        )
      } else {
        setError(response.message || '更新状态失败')
      }
    } catch (err) {
      console.error('更新动作资源状态失败', err)
      setError('更新动作资源状态失败，请稍后重试')
    }
  }
  
  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除此资源吗？此操作无法撤销。')) {
      return
    }
    
    try {
      const response = await apiService.motions.delete(id)
      
      if (response.isSuccess) {
        // 从列表中移除
        setMotions(prev => prev.filter(item => item.id !== id))
      } else {
        setError(response.message || '删除资源失败')
      }
    } catch (err) {
      console.error('删除动作资源失败', err)
      setError('删除动作资源失败，请稍后重试')
    }
  }
  
  // 获取状态标签样式
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
  
  // 获取状态显示文本
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">动作资源管理</h1>
        <Link
          to="/admin/motions/edit"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          添加新资源
        </Link>
      </div>

      {/* 筛选工具栏 */}
      <div className="mt-6 rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          {/* 搜索框 */}
          <div className="w-full md:w-1/3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索资源名称..."
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
          
          {/* 状态筛选 */}
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange('all')}
              className={`rounded-md px-3 py-2 text-sm ${
                statusFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => handleStatusChange('pending')}
              className={`rounded-md px-3 py-2 text-sm ${
                statusFilter === 'pending'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              待审核
            </button>
            <button
              onClick={() => handleStatusChange('approved')}
              className={`rounded-md px-3 py-2 text-sm ${
                statusFilter === 'approved'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              已审核
            </button>
            <button
              onClick={() => handleStatusChange('rejected')}
              className={`rounded-md px-3 py-2 text-sm ${
                statusFilter === 'rejected'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              已拒绝
            </button>
          </div>
        </div>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      {/* 资源列表 */}
      <div className="mt-6 rounded-lg border bg-card shadow-sm">
        {/* 桌面端表格 */}
        <div className="overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  资源信息
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
                  创建时间
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    <div className="flex justify-center py-4">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    </div>
                  </td>
                </tr>
              ) : motions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    没有找到动作资源
                  </td>
                </tr>
              ) : (
                motions.map((motion) => (
                  <tr key={motion.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
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
                          <div className="text-sm text-gray-500">ID: {motion.id}</div>
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
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/motions/edit/${motion.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          编辑
                        </Link>
                        <Link
                          to={`/motions/${motion.id}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          查看
                        </Link>
                        {motion.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(motion.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              通过
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(motion.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              拒绝
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(motion.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* 分页 */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  显示第 <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> 到第{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, motions.length + (currentPage - 1) * pageSize)}
                  </span>{' '}
                  项，共{' '}
                  <span className="font-medium">{motions.length + (currentPage - 1) * pageSize}</span> 项
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="分页">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md border px-2 py-2 text-sm font-medium focus:z-20 ${
                      currentPage === 1
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                        : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">上一页</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20 ${
                        currentPage === page
                          ? 'z-10 border-primary bg-primary text-white'
                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md border px-2 py-2 text-sm font-medium focus:z-20 ${
                      currentPage === totalPages
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                        : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">下一页</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminMotionsPage 