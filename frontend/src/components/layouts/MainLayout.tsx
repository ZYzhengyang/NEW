import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* 头部导航 */}
      <header className="bg-primary text-white">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link to="/" className="text-2xl font-bold">
            ActorCore 动作资源平台
          </Link>
          
          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
          
          {/* 桌面端导航 */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:underline">首页</Link>
              </li>
              <li>
                <Link to="/motions" className="hover:underline">动作库</Link>
              </li>
              <li>
                <Link to="/login" className="hover:underline">登录</Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline">注册</Link>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* 移动端导航菜单 */}
        {isMenuOpen && (
          <div className="border-t border-gray-700 md:hidden">
            <ul className="container mx-auto space-y-2 p-4">
              <li>
                <Link to="/" className="block py-2 hover:underline">首页</Link>
              </li>
              <li>
                <Link to="/motions" className="block py-2 hover:underline">动作库</Link>
              </li>
              <li>
                <Link to="/login" className="block py-2 hover:underline">登录</Link>
              </li>
              <li>
                <Link to="/register" className="block py-2 hover:underline">注册</Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* 主内容区 */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 py-6 text-center text-white">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} ActorCore 动作资源平台. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout 