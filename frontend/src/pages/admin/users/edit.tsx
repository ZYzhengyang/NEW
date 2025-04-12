import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiService } from '@/services/api'
import { User } from '@/types'

const UserForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = !!id

  // 表单状态
  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    email: '',
    isAdmin: false,
    status: 'inactive'
  })
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取用户数据
  useEffect(() => {
    if (isEditing) {
      fetchUser()
    }
  }, [id])

  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiService.users.getById(id!)
      
      if (response.isSuccess) {
        setFormData({
          username: response.result.username,
          email: response.result.email,
          isAdmin: response.result.isAdmin,
          status: response.result.status
        })
      } else {
        setError('获取用户信息失败')
      }
    } catch (err) {
      console.error('获取用户信息错误:', err)
      setError('获取用户信息时发生错误')
    } finally {
      setLoading(false)
    }
  }

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 表单验证
    if (!formData.username || !formData.email) {
      setError('用户名和邮箱为必填项')
      return
    }
    
    if (!isEditing && (!password || password.length < 6)) {
      setError('新用户密码至少需要6个字符')
      return
    }
    
    if (!isEditing && password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      let response
      
      if (isEditing) {
        // 更新现有用户
        response = await apiService.users.update(id!, formData)
      } else {
        // 创建新用户
        response = await apiService.auth.register({
          username: formData.username!,
          email: formData.email!,
          password: password
        })
        
        // 如果需要设置为管理员或特定状态，需要额外API调用
        if (response.isSuccess && (formData.isAdmin || formData.status !== 'inactive')) {
          const userId = response.result.id
          
          // 设置管理员权限
          if (formData.isAdmin) {
            await apiService.users.updateRole(userId, 'admin')
          }
          
          // 设置状态
          if (formData.status !== 'inactive') {
            await apiService.users.updateStatus(userId, formData.status!)
          }
        }
      }
      
      if (response.isSuccess) {
        // 返回用户列表页
        navigate('/admin/users')
      } else {
        setError(response.message || '操作失败')
      }
    } catch (err) {
      console.error('保存用户数据错误:', err)
      setError('保存用户数据时发生错误')
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{isEditing ? '编辑用户' : '创建用户'}</h1>
        <p className="mt-1 text-gray-500">
          {isEditing ? '更新用户信息和权限' : '创建新用户账号'}
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* 用户名 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                用户名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>

            {/* 邮箱 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>

            {/* 密码 - 仅在创建时显示 */}
            {!isEditing && (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    密码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                    minLength={6}
                  />
                  <p className="mt-1 text-xs text-gray-500">密码至少需要6个字符</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    确认密码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>
              </>
            )}

            {/* 状态 */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                状态
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="active">正常</option>
                <option value="inactive">未激活</option>
                <option value="banned">已封禁</option>
              </select>
            </div>

            {/* 管理员权限 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">
                管理员权限
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-70"
            >
              {loading && (
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isEditing ? '更新用户' : '创建用户'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm 