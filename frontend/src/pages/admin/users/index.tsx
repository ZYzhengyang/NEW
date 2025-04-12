import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, PaginatedResult, ApiResponse } from '@/types'
import { apiService } from '@/services/api'

// 用户状态枚举
const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BANNED: 'banned'
}

const AdminUsersPage = () => {
  // 分页和过滤状态
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  })
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      // 构建请求参数
      const params: any = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        sort: 'newest'
      }

      // 添加过滤条件
      if (filterStatus !== 'all') {
        params.status = filterStatus
      }

      if (searchQuery) {
        params.search = searchQuery
      }

      // 调用API获取用户列表
      const response = await apiService.users.getAll(params)

      if (response.isSuccess) {
        setUsers(response.result.items)
        setPagination({
          ...pagination,
          totalCount: response.result.totalCount,
          totalPages: response.result.totalPages
        })
      } else {
        setError('获取用户列表失败')
      }
    } catch (err) {
      console.error('获取用户列表错误:', err)
      setError('获取用户列表时发生错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 首次加载和筛选条件变化时获取用户
  useEffect(() => {
    fetchUsers()
  }, [pagination.page, pagination.pageSize, filterStatus])

  // 进行搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 重置到第一页然后获取数据
    setPagination({ ...pagination, page: 1 })
    fetchUsers()
  }

  // 重置搜索和过滤
  const handleResetFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
    setPagination({ ...pagination, page: 1 })
  }

  // 切换用户状态
  const handleToggleUserStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await apiService.users.updateStatus(userId, newStatus)
      
      if (response.isSuccess) {
        // 更新本地状态，避免重新获取整个列表
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ))
      } else {
        setError(`更新用户状态失败: ${response.message}`)
      }
    } catch (err) {
      console.error('更改用户状态错误:', err)
      setError('更改用户状态时发生错误')
    }
  }

  // 获取状态标签样式
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'bg-green-100 text-green-800'
      case UserStatus.INACTIVE:
        return 'bg-yellow-100 text-yellow-800'
      case UserStatus.BANNED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // 获取状态显示文本
  const getStatusText = (status: string) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return '正常'
      case UserStatus.INACTIVE:
        return '未激活'
      case UserStatus.BANNED:
        return '已封禁'
      default:
        return '未知'
    }
  }

  // 构建分页器
  const renderPagination = () => {
    const pages = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, pagination.page - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1)

    // 调整起始页，确保显示足够的页码
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPagination({ ...pagination, page: i })}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
            pagination.page === i
              ? 'z-10 bg-primary text-white focus:z-20'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          } border border-gray-300`}
        >
          {i}
        </button>
      )
    }

    return (
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              显示 <span className="font-medium">{users.length ? (pagination.page - 1) * pagination.pageSize + 1 : 0}</span> 到{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)}
              </span>{' '}
              条，共 <span className="font-medium">{pagination.totalCount}</span> 条结果
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">上一页</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              {pages}
              <button
                onClick={() => setPagination({ ...pagination, page: Math.min(pagination.totalPages, pagination.page + 1) })}
                disabled={pagination.page === pagination.totalPages}
                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">下一页</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <Link
          to="/admin/users/new"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          添加用户
        </Link>
      </div>

      {/* 筛选和搜索工具栏 */}
      <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
              状态筛选
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
            >
              <option value="all">全部状态</option>
              <option value={UserStatus.ACTIVE}>正常</option>
              <option value={UserStatus.INACTIVE}>未激活</option>
              <option value={UserStatus.BANNED}>已封禁</option>
            </select>
          </div>

          <div className="flex-grow">
            <form onSubmit={handleSearch}>
              <label htmlFor="search-input" className="block text-sm font-medium text-gray-700">
                搜索用户
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索用户名或邮箱..."
                  className="block w-full flex-1 rounded-none rounded-l-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
                />
                <button
                  type="submit"
                  className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <div className="mt-auto">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重置筛选
            </button>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* 用户表格 */}
      <div className="overflow-hidden overflow-x-auto rounded-lg border bg-white shadow">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-64 items-center justify-center p-6 text-center">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">未找到用户</h3>
              <p className="mt-1 text-sm text-gray-500">尝试调整搜索条件或清除筛选器。</p>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  用户信息
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  角色
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  状态
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  注册时间
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  上次登录
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">操作</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.avatar ? (
                          <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.username} />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                            {user.username?.charAt(0).toUpperCase() || '?'}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {user.isAdmin ? (
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                        管理员
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        用户
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                      {getStatusText(user.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '从未登录'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {/* 用户状态快捷操作下拉菜单 */}
                      <div className="relative inline-block text-left">
                        <button
                          id={`user-status-menu-${user.id}`}
                          type="button"
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                          onClick={() => {
                            const element = document.getElementById(`user-status-dropdown-${user.id}`);
                            if (element) {
                              element.classList.toggle('hidden');
                            }
                          }}
                        >
                          状态
                          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div
                          id={`user-status-dropdown-${user.id}`}
                          className="absolute right-0 z-10 mt-2 hidden w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                          <div className="py-1">
                            {user.status !== UserStatus.ACTIVE && (
                              <button
                                onClick={() => handleToggleUserStatus(user.id, UserStatus.ACTIVE)}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              >
                                设为正常
                              </button>
                            )}
                            {user.status !== UserStatus.INACTIVE && (
                              <button
                                onClick={() => handleToggleUserStatus(user.id, UserStatus.INACTIVE)}
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              >
                                设为未激活
                              </button>
                            )}
                            {user.status !== UserStatus.BANNED && (
                              <button
                                onClick={() => handleToggleUserStatus(user.id, UserStatus.BANNED)}
                                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                              >
                                封禁用户
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/admin/users/edit/${user.id}`}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        编辑
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* 分页 */}
        {!loading && users.length > 0 && renderPagination()}
      </div>
    </div>
  )
}

export default AdminUsersPage 