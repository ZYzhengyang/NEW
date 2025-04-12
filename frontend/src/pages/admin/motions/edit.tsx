import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiService, MotionAsset, MotionCategory } from '@/services/api'
import SceneViewer from '@/components/viewer/SceneViewer'
import UploadPanel from '@/components/viewer/UploadPanel'

const AdminMotionEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = !!id
  
  // 表单状态
  const [formData, setFormData] = useState<{
    name: string
    description: string
    price: number
    categoryId: number
    status: 'pending' | 'approved' | 'rejected'
    tags: string[]
  }>({
    name: '',
    description: '',
    price: 0,
    categoryId: 0,
    status: 'pending',
    tags: []
  })
  
  // 文件状态
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [animationFiles, setAnimationFiles] = useState<File[]>([])
  
  // 预览状态
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
  const [modelPreview, setModelPreview] = useState<string>('')
  const [animationPreviews, setAnimationPreviews] = useState<string[]>([])
  
  // 加载状态
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<MotionCategory[]>([])
  
  const tagInputRef = useRef<HTMLInputElement>(null)
  
  // 加载分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.categories.getAll()
        if (response.isSuccess) {
          setCategories(response.result)
          
          // 默认选择第一个分类
          if (response.result.length > 0 && !isEditing) {
            setFormData(prev => ({ ...prev, categoryId: response.result[0].id }))
          }
        }
      } catch (err) {
        console.error('获取分类列表失败', err)
        setError('获取分类列表失败，请稍后重试')
      }
    }
    
    fetchCategories()
  }, [isEditing])
  
  // 如果是编辑模式，加载资源数据
  useEffect(() => {
    if (!isEditing) return
    
    const fetchMotion = async () => {
      try {
        setLoading(true)
        const response = await apiService.motions.getById(Number(id))
        
        if (response.isSuccess) {
          const motion = response.result
          
          // 设置表单数据
          setFormData({
            name: motion.name,
            description: motion.description,
            price: motion.price,
            categoryId: motion.categoryId,
            status: motion.status,
            tags: motion.tags || []
          })
          
          // 设置预览数据
          setThumbnailPreview(motion.thumbnailUrl)
          setModelPreview(motion.modelUrl)
          setAnimationPreviews(motion.animationUrls)
        } else {
          setError('获取资源详情失败')
        }
      } catch (err) {
        console.error('获取资源详情失败', err)
        setError('获取资源详情失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }
    
    fetchMotion()
  }, [id, isEditing])
  
  // 处理表单字段变化
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }))
  }
  
  // 处理缩略图上传
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }
  
  // 处理模型上传
  const handleModelUpload = (file: File) => {
    setModelFile(file)
    setModelPreview(URL.createObjectURL(file))
  }
  
  // 处理动画上传
  const handleAnimationsUpload = (files: File[]) => {
    setAnimationFiles(files)
    
    // 创建预览URL
    const previews = files.map(file => URL.createObjectURL(file))
    setAnimationPreviews(previews)
  }
  
  // 处理标签添加
  const handleAddTag = () => {
    if (!tagInputRef.current || !tagInputRef.current.value.trim()) return
    
    const newTag = tagInputRef.current.value.trim()
    if (!formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
    }
    
    tagInputRef.current.value = ''
  }
  
  // 处理标签删除
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }
  
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('资源名称不能为空')
      return
    }
    
    if (!isEditing && !modelFile) {
      setError('请上传模型文件')
      return
    }
    
    if (!isEditing && !thumbnailFile) {
      setError('请上传缩略图')
      return
    }
    
    try {
      setSaving(true)
      setError(null)
      
      // 准备FormData
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('price', formData.price.toString())
      submitData.append('categoryId', formData.categoryId.toString())
      submitData.append('status', formData.status)
      formData.tags.forEach(tag => {
        submitData.append('tags', tag)
      })
      
      // 添加文件
      if (thumbnailFile) {
        submitData.append('thumbnail', thumbnailFile)
      } else if (thumbnailPreview && isEditing) {
        submitData.append('thumbnailUrl', thumbnailPreview)
      }
      
      if (modelFile) {
        submitData.append('model', modelFile)
      } else if (modelPreview && isEditing) {
        submitData.append('modelUrl', modelPreview)
      }
      
      if (animationFiles.length > 0) {
        animationFiles.forEach(file => {
          submitData.append('animations', file)
        })
      } else if (animationPreviews.length > 0 && isEditing) {
        animationPreviews.forEach(url => {
          submitData.append('animationUrls', url)
        })
      }
      
      let response
      
      if (isEditing) {
        response = await apiService.motions.update(Number(id), submitData)
      } else {
        response = await apiService.motions.create(submitData)
      }
      
      if (response.isSuccess) {
        navigate('/admin/motions')
      } else {
        setError(response.message || '保存失败')
      }
    } catch (err) {
      console.error('保存资源失败', err)
      setError('保存资源失败，请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {isEditing ? '编辑动作资源' : '添加动作资源'}
      </h1>
      
      {/* 错误提示 */}
      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* 左侧：基础信息 */}
            <div className="space-y-6">
              {/* 基本信息卡片 */}
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">基本信息</h2>
                
                <div className="space-y-4">
                  {/* 资源名称 */}
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium">
                      资源名称<span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="输入资源名称"
                      required
                    />
                  </div>
                  
                  {/* 资源描述 */}
                  <div>
                    <label htmlFor="description" className="mb-1 block text-sm font-medium">
                      资源描述
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="描述动作资源的特点和用途"
                      rows={4}
                    />
                  </div>
                  
                  {/* 价格 */}
                  <div>
                    <label htmlFor="price" className="mb-1 block text-sm font-medium">
                      价格 (¥)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="输入价格"
                      min="0"
                      step="0.01"
                    />
                    <p className="mt-1 text-xs text-gray-500">设置为0表示免费资源</p>
                  </div>
                  
                  {/* 分类 */}
                  <div>
                    <label htmlFor="categoryId" className="mb-1 block text-sm font-medium">
                      分类<span className="ml-1 text-red-500">*</span>
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                    >
                      <option value="">选择分类</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 状态 */}
                  <div>
                    <label htmlFor="status" className="mb-1 block text-sm font-medium">
                      状态
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="pending">待审核</option>
                      <option value="approved">已审核</option>
                      <option value="rejected">已拒绝</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* 标签卡片 */}
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">标签</h2>
                
                <div className="space-y-4">
                  {/* 标签输入 */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      ref={tagInputRef}
                      className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="输入标签名称"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                    >
                      添加
                    </button>
                  </div>
                  
                  {/* 标签列表 */}
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 rounded-full text-gray-500 hover:text-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    {formData.tags.length === 0 && (
                      <div className="text-sm text-gray-500">暂无标签</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 缩略图上传 */}
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">缩略图</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="relative h-40 w-40 overflow-hidden rounded-md border border-gray-300 bg-gray-100">
                      {thumbnailPreview ? (
                        <img
                          src={thumbnailPreview}
                          alt="缩略图预览"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <label className="cursor-pointer rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                      <span>上传缩略图</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <p className="text-center text-xs text-gray-500">
                    支持 PNG、JPG、JPEG 格式，建议尺寸 500x500
                  </p>
                </div>
              </div>
            </div>
            
            {/* 右侧：模型预览和上传 */}
            <div className="space-y-6">
              {/* 模型预览 */}
              {(modelPreview || animationPreviews.length > 0) && (
                <div className="rounded-lg border bg-card shadow-sm">
                  <div className="overflow-hidden rounded-t-lg">
                    <SceneViewer
                      modelUrl={modelPreview}
                      animationUrls={animationPreviews}
                      modelType={
                        modelPreview.endsWith('.gltf') || modelPreview.endsWith('.glb')
                          ? 'gltf'
                          : 'fbx'
                      }
                      height="400px"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium">模型预览</h3>
                    <p className="text-sm text-gray-500">可拖动旋转查看模型</p>
                  </div>
                </div>
              )}
              
              {/* 模型上传 */}
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">模型上传</h2>
                
                <UploadPanel
                  onModelUpload={handleModelUpload}
                  onAnimationsUpload={handleAnimationsUpload}
                  onError={(errMsg) => setError(errMsg)}
                />
              </div>
              
              {/* 提交按钮 */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/motions')}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                  disabled={saving}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      保存中...
                    </>
                  ) : (
                    '保存'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default AdminMotionEditPage 