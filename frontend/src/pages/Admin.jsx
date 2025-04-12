import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, message, Tag } from 'antd'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

function Admin() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  useEffect(() => {
    // TODO: 从后端获取资源列表
    setTimeout(() => {
      setAssets([
        {
          id: 1,
          title: '示例动作资源',
          description: '这是一个示例动作资源',
          category: '动作',
          status: 'active',
          uploadTime: '2024-02-09 12:00:00',
          author: '设计师A',
          animations: 5
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleDelete = async () => {
    if (!selectedAsset) return

    try {
      // TODO: 调用后端删除接口
      await new Promise(resolve => setTimeout(resolve, 1000))

      setAssets(assets.filter(asset => asset.id !== selectedAsset.id))
      message.success('删除成功')
    } catch (error) {
      message.error('删除失败')
    } finally {
      setDeleteModalVisible(false)
      setSelectedAsset(null)
    }
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Link to={`/asset/${record.id}`} style={{ color: 'var(--primary-color)' }}>
          {text}
        </Link>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: text => <Tag color="blue">{text}</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'active' ? 'success' : 'warning'}>
          {status === 'active' ? '已上架' : '已下架'}
        </Tag>
      )
    },
    {
      title: '动画数量',
      dataIndex: 'animations',
      key: 'animations'
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author'
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      sorter: (a, b) => new Date(a.uploadTime) - new Date(b.uploadTime)
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/asset/${record.id}`}>
            <Button type="link" icon={<EyeOutlined />}>
              预览
            </Button>
          </Link>
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedAsset(record)
              setDeleteModalVisible(true)
            }}
          >
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div className="panel" style={{ padding: '20px' }}>
      <h1 style={{ color: 'var(--primary-color)', marginBottom: '24px' }}>
        资源管理
      </h1>

      <Table
        columns={columns}
        dataSource={assets}
        loading={loading}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: total => `共 ${total} 条`
        }}
      />

      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false)
          setSelectedAsset(null)
        }}
        okText="确认"
        cancelText="取消"
      >
        <p>确定要删除 "{selectedAsset?.title}" 吗？此操作不可恢复。</p>
      </Modal>
    </div>
  )
}

export default Admin 