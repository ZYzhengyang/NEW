import axios from 'axios'
import { ApiResponse, User, Motion, Category, PaginatedResult } from '@/types'

// API基础URL
const baseURL = '/api'

const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage中获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const { response } = error
    if (response && response.status === 401) {
      // 未授权，清除token并跳转到登录页
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 定义基本API接口类型适配器
type PaginatedResponse<T> = PaginatedResult<T>

// 动作资源接口
export interface MotionAsset {
  id: number
  name: string
  description: string
  thumbnailUrl: string
  modelUrl: string
  animationUrls: string[]
  price: number
  categoryId: number
  categoryName: string
  tags: string[]
  createdAt: string
  updatedAt: string
  viewCount: number
  downloadCount: number
  status: 'pending' | 'approved' | 'rejected'
  userId: number
  userName: string
}

// 分类接口
export interface MotionCategory {
  id: number
  name: string
  description: string
  iconUrl: string
  parentId: number | null
  order: number
  motionCount: number
}

// 登录请求
export interface LoginRequest {
  username: string
  password: string
}

// 登录响应
export interface LoginResponse {
  token: string
  user: User
}

// 注册请求
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

// API服务
export const apiService = {
  // 认证相关
  auth: {
    login: (data: LoginRequest) => 
      api.post<any, ApiResponse<LoginResponse>>('/auth/login', data),
      
    register: (data: RegisterRequest) => 
      api.post<any, ApiResponse<User>>('/auth/register', data),
      
    getCurrentUser: () => 
      api.get<any, ApiResponse<User>>('/auth/me'),
  },
  
  // 动作资源相关
  motions: {
    getAll: (params?: { 
      page?: number, 
      pageSize?: number, 
      categoryId?: number, 
      search?: string,
      status?: string,
      sort?: string
    }) => 
      api.get<any, ApiResponse<PaginatedResponse<Motion>>>('/motions', { params }),
      
    getById: (id: string) => 
      api.get<any, ApiResponse<Motion>>(`/motions/${id}`),
      
    create: (data: FormData) => 
      api.post<any, ApiResponse<Motion>>('/motions', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
      
    update: (id: string, data: FormData) => 
      api.put<any, ApiResponse<Motion>>(`/motions/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
      
    delete: (id: string) => 
      api.delete<any, ApiResponse<boolean>>(`/motions/${id}`),
      
    updateStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => 
      api.patch<any, ApiResponse<Motion>>(`/motions/${id}/status`, { status }),
      
    incrementView: (id: string) => 
      api.post<any, ApiResponse<boolean>>(`/motions/${id}/view`),
  },
  
  // 分类相关
  categories: {
    getAll: () => 
      api.get<any, ApiResponse<Category[]>>('/categories'),
      
    getById: (id: string) => 
      api.get<any, ApiResponse<Category>>(`/categories/${id}`),
      
    create: (data: Partial<Category>) => 
      api.post<any, ApiResponse<Category>>('/categories', data),
      
    update: (id: string, data: Partial<Category>) => 
      api.put<any, ApiResponse<Category>>(`/categories/${id}`, data),
      
    delete: (id: string) => 
      api.delete<any, ApiResponse<boolean>>(`/categories/${id}`),
  },
  
  // 上传相关
  upload: {
    uploadFile: (file: File, type: 'model' | 'animation' | 'thumbnail') => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      
      return api.post<any, ApiResponse<{ url: string }>>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    
    processZip: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      
      return api.post<any, ApiResponse<{
        modelUrl: string,
        animationUrls: string[]
      }>>('/upload/process-zip', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
  },
  
  // 用户相关
  users: {
    getAll: (params?: { 
      page?: number, 
      pageSize?: number, 
      search?: string,
      status?: string,
      sort?: string
    }) => 
      api.get<any, ApiResponse<PaginatedResponse<User>>>('/users', { params }),
      
    getById: (id: string) => 
      api.get<any, ApiResponse<User>>(`/users/${id}`),
      
    update: (id: string, data: Partial<User>) => 
      api.put<any, ApiResponse<User>>(`/users/${id}`, data),
      
    delete: (id: string) => 
      api.delete<any, ApiResponse<boolean>>(`/users/${id}`),
      
    updateRole: (id: string, role: 'user' | 'admin') => 
      api.patch<any, ApiResponse<User>>(`/users/${id}/role`, { role }),
    
    updateStatus: (id: string, status: string) => 
      api.patch<any, ApiResponse<User>>(`/users/${id}/status`, { status }),
  },
}

export default api 