import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  // 登出处理
  const handleLogout = () => {
    // 清除本地存储的token
    localStorage.removeItem('token')
    // 重定向到登录页
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 侧边栏 */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-800 transition duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 侧边栏标题 */}
        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
          <h2 className="text-xl font-bold text-white">动作核心管理</h2>
          <button
            className="rounded-md p-1 text-gray-400 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="mt-5 px-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            控制台
          </NavLink>

          <NavLink
            to="/admin/motions"
            className={({ isActive }) =>
              `mt-1 flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            动作资源
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `mt-1 flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            用户管理
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `mt-1 flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            分类管理
          </NavLink>

          <button
            onClick={handleLogout}
            className="mt-6 flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            退出登录
          </button>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="relative flex flex-1 flex-col overflow-y-auto bg-gray-100">
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
          <button
            className="rounded-md p-1 text-gray-500 hover:text-gray-900 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-500">管理员</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
              A
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout 