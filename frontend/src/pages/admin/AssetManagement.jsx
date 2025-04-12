import React, { useState, useEffect } from 'react'
import { Table, Card, Button, Space, Tag, Input, Select, Modal, Form, Upload, message } from 'antd'
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UploadOutlined
} from '@ant-design/icons'

const { Option } = Select

function AssetManagement() {
  const [loading, setLoading] = useState(true)
  const [assets, setAssets] = useState([])
  const [search, setSearch] = useState('')
  const [assetType, setAssetType] = useState('all')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  
  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      setAssets([
        {
          id: 1,
          name: '拳击动作',
          description: '专业拳击动作集合',
          type: 'Model',
          filePath: '/assets/models/boxing.fbx',
          createdAt: '2023-04-01 14:23:11',
          username: 'admin'
        },
        {
          id: 2,
          name: '跑步动画',
          description: '人物奔跑动画',
          type: 'Animation',
          filePath: '/assets/animations/running.fbx',
          createdAt: '2023-04-02 09:10:33',
          username: 'designer1'
        },
        {
          id: 3,
          name: '跳跃素材',
          description: '跳跃和落地动作',
          type: 'Animation',
          filePath: '/assets/animations/jump.fbx',
          createdAt: '2023-04-03 11:45:16',
          username: 'user123'
        },
        {
          id: 4,
          name: '格斗动作包',
          description: '综合格斗动作集合',
          type: 'Model',
          filePath: '/assets/models/fighting.fbx',
          createdAt: '2023-04-05 16:30:22',
          username: 'admin'
        },
        {
          id: 5,
          name: '休闲动画集',
          description: '日常休闲动作',
          type: 'Animation',
          filePath: '/assets/animations/casual.fbx',
          createdAt: '2023-04-06 13:12:45',
          username: 'designer2'
        }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])
  
  const handleAdd = () => {
    form.resetFields()
    setIsModalVisible(true)
  }
  
  const handleEdit = (record) => {
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      type: record.type
    })
    setIsModalVisible(true)
  }
  
  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个资产吗？此操作不可撤销。',
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { style: { background: '#D4AF37', borderColor: '#D4AF37' } },
      onOk: () => {
        setAssets(assets.filter(asset => asset.id !== id))
        message.success('资产已成功删除')
      }
    })
  }
  
  const handleModalOk = () => {
    form.validateFields().then(values => {
      // 处理表单提交
      console.log('Form values:', values)
      message.success('资产已保存')
      setIsModalVisible(false)
    }).catch(errorInfo => {
      console.log('Validation failed:', errorInfo)
    })
  }
  
  const filteredAssets = assets.filter(asset => {
    const matchSearch = asset.name.toLowerCase().includes(search.toLowerCase()) ||
                      asset.description.toLowerCase().includes(search.toLowerCase())
    const matchType = assetType === 'all' || asset.type === assetType
    return matchSearch && matchType
  })
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Animation' ? 'blue' : 'gold'}>
          {type}
        </Tag>
      )
    },
    {
      title: '文件路径',
      dataIndex: 'filePath',
      key: 'filePath',
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: '创建者',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            style={{ color: '#D4AF37', borderColor: '#D4AF37' }}
          >
            查看
          </Button>
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ]
  
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }
  
  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#fff', margin: 0 }}>资产管理</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
          style={{ background: '#D4AF37', borderColor: '#D4AF37' }}
        >
          添加资产
        </Button>
      </div>
      
      <div style={{ 
        display: 'flex', 
        marginBottom: '20px', 
        gap: '16px' 
      }}>
        <Input 
          placeholder="搜索资产名称或描述" 
          prefix={<SearchOutlined />} 
          style={{ background: '#1A1A1A', border: '1px solid #333', color: '#fff' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select 
          style={{ width: 200, background: '#1A1A1A' }}
          placeholder="选择资产类型" 
          value={assetType}
          onChange={value => setAssetType(value)}
        >
          <Option value="all">全部类型</Option>
          <Option value="Model">模型</Option>
          <Option value="Animation">动画</Option>
          <Option value="Texture">纹理</Option>
          <Option value="Audio">音频</Option>
          <Option value="Other">其他</Option>
        </Select>
      </div>
      
      <Card style={{ background: '#1A1A1A', border: '1px solid #333' }}>
        <Table 
          columns={columns} 
          dataSource={filteredAssets} 
          rowKey="id" 
          loading={loading}
        />
      </Card>
      
      <Modal
        title="资产信息"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="保存"
        cancelText="取消"
        okButtonProps={{ style: { background: '#D4AF37', borderColor: '#D4AF37' } }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="资产名称"
            rules={[{ required: true, message: '请输入资产名称' }]}
          >
            <Input placeholder="输入资产名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="资产描述"
          >
            <Input.TextArea rows={4} placeholder="输入资产描述" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="资产类型"
            rules={[{ required: true, message: '请选择资产类型' }]}
          >
            <Select placeholder="选择资产类型">
              <Option value="Model">模型</Option>
              <Option value="Animation">动画</Option>
              <Option value="Texture">纹理</Option>
              <Option value="Audio">音频</Option>
              <Option value="Other">其他</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="upload"
            label="上传文件"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload name="file" action="/api/upload" listType="picture">
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AssetManagement 