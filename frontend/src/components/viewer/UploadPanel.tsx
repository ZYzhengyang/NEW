import { useState, useRef, ChangeEvent } from 'react'
import JSZip from 'jszip'

interface UploadPanelProps {
  onModelUpload: (model: File) => void
  onAnimationsUpload: (animations: File[]) => void
  onSuccess?: () => void
  onError?: (error: string) => void
}

const UploadPanel = ({
  onModelUpload,
  onAnimationsUpload,
  onSuccess,
  onError
}: UploadPanelProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus('processing')
    setStatusMessage('正在处理文件...')

    try {
      const file = files[0]
      
      // 检查文件类型
      if (file.name.endsWith('.zip')) {
        // 处理ZIP文件
        await processZipFile(file)
      } else if (file.name.endsWith('.fbx') || file.name.endsWith('.gltf') || file.name.endsWith('.glb')) {
        // 处理单个模型文件
        setStatusMessage('已识别模型文件')
        onModelUpload(file)
        setUploadStatus('success')
        onSuccess?.()
      } else {
        throw new Error('不支持的文件格式。请上传 .zip, .fbx, .gltf 或 .glb 文件')
      }
    } catch (error) {
      console.error('文件处理错误', error)
      setUploadStatus('error')
      setStatusMessage(error instanceof Error ? error.message : '上传失败')
      onError?.(error instanceof Error ? error.message : '上传失败')
    } finally {
      setIsUploading(false)
      // 清除文件输入，以便同一文件可以再次选择
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const processZipFile = async (file: File) => {
    const zip = new JSZip()
    const content = await zip.loadAsync(file)
    
    // 查找模型文件和动画文件
    const modelFiles: File[] = []
    const animationFiles: File[] = []
    
    const filePromises: Promise<void>[] = []
    
    content.forEach((relativePath, zipEntry) => {
      if (zipEntry.dir) return
      
      // 检查文件类型
      const fileName = zipEntry.name.toLowerCase()
      const isModelFile = fileName.endsWith('.fbx') || fileName.endsWith('.gltf') || fileName.endsWith('.glb')
      const isMainModel = fileName.includes('model') || fileName.includes('main')
      const isAnimation = fileName.includes('anim') || fileName.includes('motion') || relativePath.includes('animations/')
      
      if (isModelFile) {
        const promise = zipEntry.async('blob').then(blob => {
          const extractedFile = new File([blob], zipEntry.name, { type: 'application/octet-stream' })
          
          if (isMainModel) {
            // 主模型放在前面
            modelFiles.unshift(extractedFile)
          } else if (isAnimation) {
            animationFiles.push(extractedFile)
          } else {
            modelFiles.push(extractedFile)
          }
        })
        
        filePromises.push(promise)
      }
      
      // 更新进度
      setUploadProgress(filePromises.length / Object.keys(content.files).length * 100)
    })
    
    // 等待所有文件处理完成
    await Promise.all(filePromises)
    
    if (modelFiles.length === 0) {
      throw new Error('ZIP包中未找到有效的模型文件')
    }
    
    // 使用第一个模型文件作为主模型
    setStatusMessage(`已找到 ${modelFiles.length} 个模型文件和 ${animationFiles.length} 个动画文件`)
    onModelUpload(modelFiles[0])
    
    if (animationFiles.length > 0) {
      onAnimationsUpload(animationFiles)
    }
    
    setUploadStatus('success')
    onSuccess?.()
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold">上传模型</h3>
      
      <div className="mb-4 text-sm text-muted-foreground">
        <p>支持的文件格式：.fbx, .gltf, .glb, .zip</p>
        <p>ZIP包中需包含模型文件和可选的动画文件</p>
      </div>
      
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".fbx,.gltf,.glb,.zip"
          onChange={handleFileChange}
          className="hidden"
          id="model-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="model-upload"
          className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-blue-500 hover:bg-blue-50 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-medium text-gray-600">点击或拖放文件到此处</p>
            <p className="text-xs text-gray-500">每次上传一个文件</p>
          </div>
        </label>
      </div>
      
      {uploadStatus !== 'idle' && (
        <div className={`rounded-md p-3 ${
          uploadStatus === 'processing' ? 'bg-blue-50' : 
          uploadStatus === 'success' ? 'bg-green-50' : 
          'bg-red-50'
        }`}>
          <div className="flex items-center">
            {uploadStatus === 'processing' && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            )}
            {uploadStatus === 'success' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {uploadStatus === 'error' && (
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={`text-sm ${
              uploadStatus === 'processing' ? 'text-blue-700' : 
              uploadStatus === 'success' ? 'text-green-700' : 
              'text-red-700'
            }`}>
              {statusMessage}
            </span>
          </div>
          
          {uploadStatus === 'processing' && (
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-blue-100">
              <div 
                className="h-full bg-blue-500 transition-all" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UploadPanel 