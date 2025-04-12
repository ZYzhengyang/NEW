import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Row, Col, Button, Tag, Tabs, Card, Divider, Space, Typography, Rate, Tooltip, List, Avatar } from 'antd'
import { 
  HeartOutlined, 
  ShoppingCartOutlined, 
  DownloadOutlined, 
  CheckCircleOutlined, 
  QuestionCircleOutlined,
  EnvironmentOutlined,
  TagOutlined,
  UserOutlined,
  StarOutlined,
  CommentOutlined,
  ShareAltOutlined,
  PlayCircleOutlined
} from '@ant-design/icons'
import ModelViewer from '../components/ModelViewer'

const { TabPane } = Tabs
const { Title, Paragraph, Text } = Typography

// 模拟资源数据
const assetData = {
  id: 1,
  title: '后踢击打R',
  price: '$1.50',
  thumbnail: '/placeholder.png',
  description: '高质量的战斗后踢动作，适用于各种格斗和动作游戏。动画流畅自然，可完美融入您的游戏角色。',
  category: '战斗动作',
  compatibility: ['Unreal Engine', 'Unity', 'Blender', 'Maya', '3ds Max'],
  features: [
    '30帧每秒流畅动画',
    '兼容多种骨骼系统',
    '包含开始和结束过渡',
    '可自定义动画曲线',
    '完整的ROOT动作'
  ],
  creator: {
    name: 'MotionStudios',
    avatar: '/avatar1.jpg',
    rating: 4.8,
    products: 126
  },
  ratings: {
    average: 4.7,
    count: 28,
    distribution: [22, 4, 2, 0, 0]
  },
  relatedAssets: [
    { id: 2, title: '截拳直拳', price: '$2.25', thumbnail: '/placeholder.png', category: '战斗动作' },
    { id: 8, title: '向下前踢L', price: '$1.50', thumbnail: '/placeholder.png', category: '战斗动作' },
    { id: 11, title: '肘击R', price: '$1.50', thumbnail: '/placeholder.png', category: '战斗动作' },
    { id: 12, title: '假动作', price: '$2.25', thumbnail: '/placeholder.png', category: '战斗动作' }
  ],
  reviews: [
    {
      id: 1,
      user: 'GameDev123',
      avatar: '/user1.jpg',
      rating: 5,
      date: '2023-03-15',
      comment: '非常流畅的动画，无缝整合到我的游戏项目中。强烈推荐！'
    },
    {
      id: 2,
      user: 'AnimationPro',
      avatar: '/user2.jpg',
      rating: 4,
      date: '2023-02-28',
      comment: '很好的动作资源，只是需要一点小调整来适应我的角色骨骼。'
    },
    {
      id: 3,
      user: 'UnityMaster',
      avatar: '/user3.jpg',
      rating: 5,
      date: '2023-02-10',
      comment: '完美的后踢动作，节省了我大量的时间。导入Unity非常简单。'
    }
  ]
}

function AssetDetail() {
  const { id } = useParams()
  const [asset, setAsset] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    // 模拟API请求
    setAsset(assetData)
    setLoading(false)
  }, [id])

  if (loading || !asset) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>加载中...</div>
  }

  const renderPreviewSection = () => (
    <div style={{ position: 'relative', height: '500px', background: '#111', borderRadius: '4px', overflow: 'hidden' }}>
      <ModelViewer 
        modelPath="/model.glb" 
        style={{ width: '100%', height: '100%' }} 
      />
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        right: '20px',
        display: 'flex',
        gap: '10px'
      }}>
        <Button type="primary" icon={<PlayCircleOutlined />} size="large" shape="circle"
          style={{ background: '#D4AF37', borderColor: '#D4AF37' }} />
        <Button type="primary" shape="circle" size="large" 
          style={{ background: 'rgba(0,0,0,0.5)', borderColor: '#333' }}>
          1x
        </Button>
        <Link to="/fullview">
          <Button type="primary" icon={<EnvironmentOutlined />} size="large" shape="circle"
            style={{ background: 'rgba(0,0,0,0.5)', borderColor: '#333' }} />
        </Link>
      </div>
    </div>
  )

  const renderProductInfo = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={2} style={{ color: '#fff', margin: 0 }}>{asset.title}</Title>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button shape="circle" icon={<HeartOutlined />} style={{ borderColor: '#333', color: '#D4AF37' }} />
          <Button shape="circle" icon={<ShareAltOutlined />} style={{ borderColor: '#333', color: '#D4AF37' }} />
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Space>
          <Tag color="#D4AF37">{asset.category}</Tag>
          <Text style={{ color: '#999' }}>ID: {asset.id}</Text>
          <Link to={`/creator/${asset.creator.name}`} style={{ color: '#D4AF37' }}>
            {asset.creator.name}
          </Link>
        </Space>
      </div>
      
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Rate allowHalf disabled defaultValue={asset.ratings.average} style={{ fontSize: '16px', color: '#D4AF37' }} />
        <Text style={{ color: '#fff' }}>{asset.ratings.average}</Text>
        <Text style={{ color: '#999' }}>({asset.ratings.count} 评价)</Text>
      </div>
      
      <Paragraph style={{ color: '#ccc', marginBottom: '30px' }}>
        {asset.description}
      </Paragraph>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <Title level={3} style={{ color: '#D4AF37', margin: 0 }}>{asset.price}</Title>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="primary" icon={<ShoppingCartOutlined />} size="large"
            style={{ background: '#D4AF37', borderColor: '#D4AF37', color: '#000' }}>
            加入购物车
          </Button>
          <Button type="primary" icon={<DownloadOutlined />} size="large"
            style={{ background: '#1a1a1a', borderColor: '#333' }}>
            立即购买
          </Button>
        </div>
      </div>
      
      <Divider style={{ borderColor: '#333' }} />
      
      <div style={{ marginBottom: '20px' }}>
        <Title level={4} style={{ color: '#fff' }}>兼容性</Title>
        <Space size="middle" wrap>
          {asset.compatibility.map((comp, index) => (
            <Tag key={index} icon={<CheckCircleOutlined />} color="success">
              {comp}
            </Tag>
          ))}
        </Space>
      </div>
      
      <div>
        <Title level={4} style={{ color: '#fff' }}>特点</Title>
        <List
          dataSource={asset.features}
          renderItem={(item) => (
            <List.Item style={{ borderBottom: '1px solid #333', padding: '10px 0' }}>
              <Text style={{ color: '#ccc' }}><CheckCircleOutlined style={{ color: '#D4AF37', marginRight: '10px' }} />{item}</Text>
            </List.Item>
          )}
        />
      </div>
    </div>
  )

  const renderCreator = () => (
    <Card style={{ background: '#1a1a1a', border: '1px solid #333', marginTop: '30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <Avatar size={64} src={asset.creator.avatar} style={{ marginRight: '15px' }} />
        <div>
          <Title level={4} style={{ color: '#fff', margin: 0 }}>{asset.creator.name}</Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
            <Rate allowHalf disabled defaultValue={asset.creator.rating} style={{ fontSize: '12px', color: '#D4AF37' }} />
            <Text style={{ color: '#999' }}>{asset.creator.rating}</Text>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text style={{ color: '#ccc' }}><TagOutlined style={{ marginRight: '5px' }} />{asset.creator.products} 产品</Text>
        <Link to={`/creator/${asset.creator.name}`} style={{ color: '#D4AF37' }}>
          查看商店
        </Link>
      </div>
    </Card>
  )

  const renderTabs = () => (
    <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginTop: '40px' }}>
      <TabPane 
        tab={<span style={{ color: activeTab === 'details' ? '#D4AF37' : '#fff' }}>详情</span>} 
        key="details"
      >
        <div style={{ padding: '20px 0', color: '#ccc' }}>
          <Paragraph>
            这款高品质的动作捕捉动画提供了完美捕捉的后踢动作，适用于各种格斗游戏、动作游戏或动画项目。
          </Paragraph>
          <Paragraph>
            所有动画都经过精心调整，以确保动作的流畅性和真实感。这个动作包括起始姿势、主要踢击动作和结束恢复姿势，让您的角色动作连贯自然。
          </Paragraph>
          <Paragraph>
            该资源兼容多种3D软件和游戏引擎，包括Unreal Engine、Unity、Blender、Maya和3ds Max等。提供FBX格式，便于在不同平台间导入导出。
          </Paragraph>
          <Title level={4} style={{ color: '#fff', marginTop: '20px' }}>技术规格</Title>
          <ul>
            <li>30 FPS帧率</li>
            <li>FBX格式</li>
            <li>通用骨骼兼容</li>
            <li>包含ROOT动作</li>
            <li>循环优化</li>
          </ul>
        </div>
      </TabPane>
      <TabPane 
        tab={<span style={{ color: activeTab === 'reviews' ? '#D4AF37' : '#fff' }}>评价 ({asset.reviews.length})</span>} 
        key="reviews"
      >
        <div style={{ padding: '20px 0' }}>
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Card style={{ background: '#1a1a1a', border: '1px solid #333' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ textAlign: 'center', padding: '20px', borderRight: '1px solid #333' }}>
                    <Title level={1} style={{ color: '#D4AF37', margin: 0 }}>{asset.ratings.average}</Title>
                    <Rate allowHalf disabled defaultValue={asset.ratings.average} style={{ fontSize: '16px', color: '#D4AF37' }} />
                    <Text style={{ color: '#999', display: 'block' }}>{asset.ratings.count} 评价</Text>
                  </div>
                  <div style={{ flex: 1, padding: '10px' }}>
                    {[5, 4, 3, 2, 1].map(star => (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <Text style={{ color: '#fff', width: '30px' }}>{star} ★</Text>
                        <div style={{ flex: 1, background: '#333', height: '8px', margin: '0 10px', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${(asset.ratings.distribution[5-star] / asset.ratings.count) * 100}%`, 
                            background: '#D4AF37', 
                            height: '100%' 
                          }} />
                        </div>
                        <Text style={{ color: '#999', width: '30px' }}>{asset.ratings.distribution[5-star]}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
            
            {asset.reviews.map(review => (
              <Col key={review.id} span={24}>
                <Card style={{ background: '#1a1a1a', border: '1px solid #333' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Avatar src={review.avatar} />
                      <Text style={{ color: '#fff' }}>{review.user}</Text>
                    </div>
                    <Text style={{ color: '#999' }}>{review.date}</Text>
                  </div>
                  <Rate disabled defaultValue={review.rating} style={{ fontSize: '14px', color: '#D4AF37', marginBottom: '10px' }} />
                  <Paragraph style={{ color: '#ccc' }}>{review.comment}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </TabPane>
    </Tabs>
  )

  const renderRelatedAssets = () => (
    <div style={{ marginTop: '40px' }}>
      <Title level={3} style={{ color: '#fff', marginBottom: '20px' }}>相关资源</Title>
      <Row gutter={16}>
        {asset.relatedAssets.map(related => (
          <Col key={related.id} span={6}>
            <Link to={`/asset/${related.id}`}>
              <Card
                hoverable
                bodyStyle={{ padding: '8px', height: '50px' }}
                style={{ 
                  background: '#1a1a1a', 
                  border: '1px solid #333',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
                cover={
                  <div style={{ position: 'relative' }}>
                    <img 
                      alt={related.title} 
                      src={related.thumbnail} 
                      style={{ 
                        width: '100%', 
                        height: '120px', 
                        objectFit: 'cover',
                        background: '#222'
                      }} 
                    />
                  </div>
                }
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#fff', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {related.title}
                  </div>
                  <div style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '14px' }}>
                    {related.price}
                  </div>
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  )

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
      <Row gutter={32}>
        <Col span={15}>
          {renderPreviewSection()}
        </Col>
        <Col span={9}>
          {renderProductInfo()}
          {renderCreator()}
        </Col>
      </Row>
      
      {renderTabs()}
      {renderRelatedAssets()}
    </div>
  )
}

export default AssetDetail 