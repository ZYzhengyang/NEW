import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, Table, Tag, Button, notification } from 'antd'
import { 
  AppstoreOutlined, 
  UserOutlined, 
  ShoppingCartOutlined, 
  FileOutlined,
  ArrowUpOutlined
} from '@ant-design/icons'

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [recentAssets, setRecentAssets] = useState([])
  
  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      setStats({
        totalAssets: 237,
        totalAnimations: 142,
        totalUsers: 532,
        totalOrders: 89
      })
      
      setRecentAssets([
        {
          id: 1,
          name: '拳击动作',
          type: 'Model',
          createdAt: '2023-04-01 14:23:11',
          username: 'admin'
        },
        {
          id: 2,
          name: '跑步动画',
          type: 'Animation',
          createdAt: '2023-04-02 09:10:33',
          username: 'designer1'
        },
        {
          id: 3,
          name: '跳跃素材',
          type: 'Animation',
          createdAt: '2023-04-03 11:45:16',
          username: 'user123'
        },
        {
          id: 4,
          name: '格斗动作包',
          type: 'Model',
          createdAt: '2023-04-05 16:30:22',
          username: 'admin'
        },
        {
          id: 5,
          name: '休闲动画集',
          type: 'Animation',
          createdAt: '2023-04-06 13:12:45',
          username: 'designer2'
        }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])
  
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
        <Button type="link" size="small" onClick={() => notification.info({ message: `查看资产 ${record.id}` })}>
          查看
        </Button>
      )
    }
  ]
  
  return (
    <div>
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>控制面板</h2>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ background: '#1A1A1A', border: '1px solid #333' }}>
            <Statistic
              title={<span style={{ color: '#999' }}>总资产数</span>}
              value={stats.totalAssets}
              valueStyle={{ color: '#D4AF37' }}
              prefix={<AppstoreOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ background: '#1A1A1A', border: '1px solid #333' }}>
            <Statistic
              title={<span style={{ color: '#999' }}>总动画数</span>}
              value={stats.totalAnimations}
              valueStyle={{ color: '#D4AF37' }}
              prefix={<FileOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ background: '#1A1A1A', border: '1px solid #333' }}>
            <Statistic
              title={<span style={{ color: '#999' }}>用户数量</span>}
              value={stats.totalUsers}
              valueStyle={{ color: '#D4AF37' }}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ background: '#1A1A1A', border: '1px solid #333' }}>
            <Statistic
              title={<span style={{ color: '#999' }}>订单数量</span>}
              value={stats.totalOrders}
              valueStyle={{ color: '#D4AF37' }}
              prefix={<ShoppingCartOutlined />}
              suffix={<ArrowUpOutlined style={{ fontSize: '12px', marginLeft: '5px' }} />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
      
      <Card 
        title={<span style={{ color: '#fff' }}>最近添加的资产</span>}
        style={{ 
          marginTop: '20px', 
          background: '#1A1A1A', 
          border: '1px solid #333',
        }}
        headStyle={{ 
          background: '#1A1A1A', 
          borderBottom: '1px solid #333'
        }}
      >
        <Table 
          columns={columns} 
          dataSource={recentAssets} 
          rowKey="id" 
          loading={loading}
          pagination={false}
          style={{ 
            background: '#1A1A1A',
            color: '#fff'
          }}
        />
      </Card>
    </div>
  )
}

export default Dashboard 