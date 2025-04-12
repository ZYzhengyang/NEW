import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as AntUpload, Form, Input, Select, Button, message, Row, Col, Card, Divider } from 'antd'
import { InboxOutlined, UploadOutlined, DeleteOutlined, EyeOutlined, FullscreenOutlined } from '@ant-design/icons'
import EnhancedModelViewer from '../components/EnhancedModelViewer'

const { Dragger } = AntUpload
const { TextArea } = Input
const { Option } = Select

function Upload() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [uploading, setUploading] = useState(false)
  const [fileList, setFileList] = useState([])
  const [previewFile, setPreviewFile] = useState(null)
  const [previewVisible, setPreviewVisible] = useState(false)

  const handleUpload = async (values) => {
    if (fileList.length === 0) {
      message.error('请选择要上传的文件')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', fileList[0])
      formData.append('title', values.title)
      formData.append('description', values.description)
      formData.append('category', values.category)
      formData.append('tags', values.tags || '')

      // TODO: 调用后端上传接口
      await new Promise(resolve => setTimeout(resolve, 2000))

      message.success('上传成功')
      navigate('/')
    } catch (error) {
      message.error('上传失败')
    } finally {
      setUploading(false)
    }
  }

  const uploadProps = {
    accept: '.zip,.glb,.gltf,.fbx',
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      const isValidType = [
        'application/zip',
        'application/x-zip-compressed',
        'model/gltf-binary',
        'model/gltf+json',
        'application/octet-stream' // FBX files
      ].includes(file.type) || file.name.endsWith('.glb') || file.name.endsWith('.gltf') || file.name.endsWith('.fbx')

      if (!isValidType) {
        message.error('只支持上传 ZIP、GLB、GLTF 或 FBX 文件')
        return false
      }

      setFileList([file])
      
      // 创建文件的URL以便预览
      if (file.name.endsWith('.glb') || file.name.endsWith('.gltf') || file.name.endsWith('.fbx')) {
        setPreviewFile(URL.createObjectURL(file))
      } else {
        setPreviewFile(null)
      }
      
      return false
    },
    onRemove: () => {
      setFileList([])
      setPreviewFile(null)
      setPreviewVisible(false)
    }
  }

  const openFullPreview = () => {
    navigate('/fullview', { state: { modelUrl: previewFile, title: form.getFieldValue('title') || '预览模型' } });
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <h1 style={{ color: 'var(--primary-color)', marginBottom: '24px', textAlign: 'center' }}>
        上传动作资源
      </h1>

      <Row gutter={[24, 24]}>
        <Col span={24} lg={12}>
          <Card title="资源信息" style={{ marginBottom: '20px' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpload}
            >
              <Form.Item
                name="file"
                style={{ marginBottom: '24px' }}
              >
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                  <p className="ant-upload-hint">
                    支持上传 ZIP、GLB、GLTF 或 FBX 格式的文件
                  </p>
                </Dragger>
              </Form.Item>

              <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input placeholder="请输入资源标题" />
              </Form.Item>

              <Form.Item
                label="描述"
                name="description"
                rules={[{ required: true, message: '请输入描述' }]}
              >
                <TextArea
                  placeholder="请输入资源描述"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>

              <Form.Item
                label="分类"
                name="category"
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <Select placeholder="请选择分类">
                  <Option value="动作">动作</Option>
                  <Option value="战斗动作">战斗动作</Option>
                  <Option value="日常动作">日常动作</Option>
                  <Option value="特效动作">特效动作</Option>
                  <Option value="模型">模型</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="标签"
                name="tags"
                extra="多个标签请用逗号分隔"
              >
                <Input placeholder="例如: 武器,战斗,动作,日式" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={uploading}
                  style={{ width: '100%' }}
                  icon={<UploadOutlined />}
                >
                  {uploading ? '上传中...' : '上传'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
          
          {previewFile && !previewVisible && (
            <Card title="模型预览" style={{ marginBottom: '20px' }}>
              <p style={{ marginBottom: '16px' }}>您上传的模型可以在右侧进行预览。</p>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => setPreviewVisible(true)}
                style={{ marginRight: '10px' }}
              >
                开始预览
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setFileList([]);
                  setPreviewFile(null);
                }}
              >
                删除文件
              </Button>
            </Card>
          )}
        </Col>
        
        <Col span={24} lg={12}>
          {previewVisible && previewFile && (
            <div style={{ position: 'relative', height: '600px', borderRadius: '8px', overflow: 'hidden' }}>
              <EnhancedModelViewer
                modelUrl={previewFile}
                animations={[]}
              />
              <Button 
                icon={<FullscreenOutlined />} 
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 100,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderColor: 'var(--primary-color)'
                }}
                onClick={openFullPreview}
              >
                全功能预览
              </Button>
            </div>
          )}
          
          {!previewVisible && (
            <Card title="上传须知" style={{ height: '100%' }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '16px' }}>支持格式</h3>
              <p>我们支持以下格式的3D模型和动画文件：</p>
              <ul>
                <li>GLB/GLTF - 推荐格式，支持完整的模型、材质和动画</li>
                <li>FBX - 支持动画和骨骼</li>
                <li>ZIP - 包含上述格式的压缩文件</li>
              </ul>
              
              <Divider />
              
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '16px' }}>文件要求</h3>
              <ul>
                <li>文件大小限制：最大100MB</li>
                <li>模型尺寸：建议在标准单位范围内（1单位=1米）</li>
                <li>面数：建议不超过100,000个面</li>
                <li>纹理：推荐使用2K或更低分辨率的纹理</li>
                <li>动画：应当使用标准骨骼命名</li>
              </ul>
              
              <Divider />
              
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '16px' }}>最佳实践</h3>
              <ul>
                <li>上传前优化您的模型以获得更好的性能</li>
                <li>确保模型没有重叠的面或非流形几何体</li>
                <li>为您的资源添加详细的描述和标签，以便其他用户更容易找到</li>
                <li>为每个动作提供清晰的名称和说明</li>
              </ul>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default Upload 