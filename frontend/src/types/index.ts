// 基本API响应类型
export interface ApiResponse<T> {
  isSuccess: boolean
  code: number
  message: string
  result: T
}

// 分页响应类型
export interface PaginatedResult<T> {
  items: T[]
  totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
}

// 用户类型
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  isAdmin: boolean
  status: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

// 动作资源类型
export interface Motion {
  id: string
  name: string
  description: string
  thumbnailUrl: string
  modelUrl: string
  animationUrls: string[]
  price: number
  categoryId: string
  categoryName: string
  tags: string[]
  createdAt: string
  updatedAt: string
  viewCount: number
  downloadCount: number
  status: 'pending' | 'approved' | 'rejected'
  userId: string
  userName: string
}

// 分类类型
export interface Category {
  id: string
  name: string
  description: string
  iconUrl: string
  parentId: string | null
  order: number
  motionCount: number
} 