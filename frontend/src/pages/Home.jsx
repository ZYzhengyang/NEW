import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Row, Col, Input, Select, Empty, Tabs, Button, Tag, Dropdown, Space, Carousel, Typography, Menu, Divider } from 'antd'
import { SearchOutlined, HeartOutlined, ShoppingCartOutlined, FilterOutlined, DownOutlined, RightOutlined, PlayCircleOutlined, FireOutlined, StarOutlined, DownloadOutlined } from '@ant-design/icons'

const { Search } = Input
const { Option } = Select
const { TabPane } = Tabs
const { Title, Paragraph } = Typography

const mockMotions = [
  {
    id: 1,
    title: '后踢击打R',
    price: '$1.50',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '战斗动作'
  },
  {
    id: 2,
    title: '截拳直拳',
    price: '$2.25',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '战斗动作'
  },
  {
    id: 3,
    title: '弹跳步',
    price: '$2.25',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '动作'
  },
  {
    id: 4,
    title: '拳击待机',
    price: '$2.25',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '战斗动作'
  },
  {
    id: 5,
    title: '胸部拉伸',
    price: '$2.25',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '日常动作'
  },
  {
    id: 6,
    title: '防御招式',
    price: '$2.25',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '战斗动作'
  },
  {
    id: 7,
    title: '下蹲',
    price: '$2.25',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '日常动作'
  },
  {
    id: 8,
    title: '向下前踢L',
    price: '$1.50',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '战斗动作'
  },
  {
    id: 9,
    title: '跳入',
    price: '$1.50',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '动作'
  },
  {
    id: 10,
    title: '肘击L',
    price: '$1.50',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '战斗动作'
  },
  {
    id: 11,
    title: '肘击R',
    price: '$1.50',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '战斗动作'
  },
  {
    id: 12,
    title: '假动作',
    price: '$2.25',
    thumbnail: '/placeholder.png',
    isNew: true,
    category: '战斗动作'
  }
]

const mockModels = [
  {
    id: 101,
    title: '科幻战士',
    price: '$12.99',
    thumbnail: '/model1.jpg',
    isNew: true,
    category: '人类角色',
    compatibility: ['Unreal Engine', 'Unity', 'Blender']
  },
  {
    id: 102,
    title: '城市女孩',
    price: '$9.99',
    thumbnail: '/model2.jpg',
    isNew: false,
    category: '人类角色',
    compatibility: ['Unreal Engine', 'Unity', 'Maya']
  },
  {
    id: 103,
    title: '幻想龙',
    price: '$19.99',
    thumbnail: '/model3.jpg',
    isNew: true,
    category: '幻想角色',
    compatibility: ['Unreal Engine', 'Blender']
  },
  {
    id: 104,
    title: '森林狼人',
    price: '$14.99',
    thumbnail: '/model4.jpg',
    isNew: false,
    category: '幻想角色',
    compatibility: ['Unity', 'Maya', 'Blender']
  }
];

const bannerItems = [
  {
    title: '专业级动作捕捉',
    subtitle: '为您的游戏和动画提供顶级质量的动作资源',
    image: '/banner1.jpg',
    buttonText: '立即探索',
    link: '/motion'
  },
  {
    title: '新品上市: 科幻角色系列',
    subtitle: '高度定制的未来战士模型，适用于各种游戏场景',
    image: '/banner2.jpg',
    buttonText: '查看详情',
    link: '/asset/101'
  },
  {
    title: '限时优惠: 全场7折',
    subtitle: '所有角色和动作资源限时折扣，把握机会立即行动',
    image: '/banner3.jpg',
    buttonText: '浏览商店',
    link: '/shop'
  }
];

const categoryItems = [
  { title: '人类角色', count: 256, icon: '👤' },
  { title: '动物角色', count: 124, icon: '🐺' },
  { title: '幻想角色', count: 89, icon: '🐉' },
  { title: '机械角色', count: 67, icon: '🤖' },
  { title: '日常动作', count: 342, icon: '🚶' },
  { title: '战斗动作', count: 278, icon: '⚔️' },
  { title: '舞蹈动作', count: 156, icon: '💃' },
  { title: '特效动作', count: 98, icon: '✨' }
];

const mockPacks = [
  {
    id: 1,
    title: '免费格斗',
    price: '免费',
    originalPrice: '',
    itemCount: 71,
    thumbnail: '/fight_pack.jpg',
    isLimited: true,
    discount: '',
    description: '全面的拳击和格斗动作集'
  },
  {
    id: 2,
    title: '特技动作',
    price: '$79.00',
    originalPrice: '',
    itemCount: 22,
    thumbnail: '/stunt_pack.jpg',
    isLimited: false,
    discount: '',
    description: '攀登、跳跃和坠落特技动作'
  },
  {
    id: 3,
    title: '爆炸特效',
    price: '$59.00',
    originalPrice: '$79.00',
    itemCount: 17,
    thumbnail: '/explosion_pack.jpg',
    isLimited: false,
    discount: '25%',
    description: '全光谱爆炸动作'
  }
];

const filterItems = [
  { key: 'all', label: '全部' },
  { key: 'items', label: '项目' },
  { key: 'packs', label: '包' }
];

const typeItems = [
  { key: 'all', label: '全部' },
  { key: 'mocap', label: 'Mocap' },
  { key: 'hand', label: '手动动画' }
];

function Home() {
  const [filteredMotions, setFilteredMotions] = useState([])
  const [filteredModels, setFilteredModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('motion')
  const [filterType, setFilterType] = useState('all')
  const [animationType, setAnimationType] = useState('all')

  useEffect(() => {
    setFilteredMotions(mockMotions)
    setFilteredModels(mockModels)
    setLoading(false)
  }, [])

  const filteredAssets = activeTab === 'model' 
    ? filteredModels.filter(model => {
        const matchSearch = model.title.toLowerCase().includes(search.toLowerCase()) ||
                          (model.description && model.description.toLowerCase().includes(search.toLowerCase()))
        const matchCategory = category === 'all' || model.category === category
        return matchSearch && matchCategory
      })
    : filteredMotions.filter(motion => {
    const matchSearch = motion.title.toLowerCase().includes(search.toLowerCase()) ||
                          (motion.description && motion.description.toLowerCase().includes(search.toLowerCase()))
    const matchCategory = category === 'all' || motion.category === category
    return matchSearch && matchCategory
  })

  const renderMotionCard = (motion) => (
    <Col key={motion.id} xs={12} sm={8} md={6} lg={4} xl={3} xxl={2}>
      <Link to={`/asset/${motion.id}`}>
        <Card
          hoverable
          bodyStyle={{ padding: '0', height: '40px', position: 'relative' }}
          style={{ 
            background: '#222', 
            marginBottom: '16px',
            border: 'none',
            borderRadius: '0',
            overflow: 'hidden'
          }}
          cover={
            <div style={{ position: 'relative' }}>
              <img 
                alt={motion.title} 
                src={motion.thumbnail} 
                style={{ 
                  width: '100%', 
                  height: '160px', 
                  objectFit: 'cover',
                  background: '#333'
                }} 
              />
              {motion.isNew && (
                <div style={{ 
                  position: 'absolute', 
                  top: '0', 
                  right: '0', 
                  background: '#D4AF37', 
                  color: '#000', 
                  padding: '2px 6px', 
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  NEW
                </div>
              )}
            </div>
          }
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0 8px',
            position: 'absolute',
            bottom: '0',
            width: '100%',
            height: '100%',
            background: '#222'
          }}>
            <div style={{ 
              color: '#fff', 
              fontSize: '12px', 
              textOverflow: 'ellipsis', 
              overflow: 'hidden', 
              whiteSpace: 'nowrap',
              maxWidth: '60%'
            }}>
              {motion.title}
            </div>
            <div style={{ 
              color: '#D4AF37', 
              fontWeight: 'bold', 
              fontSize: '12px',
              display: 'flex',
              gap: '5px',
              alignItems: 'center'
            }}>
              <HeartOutlined style={{ color: '#666', fontSize: '14px' }} />
              <div>{motion.price}</div>
              <ShoppingCartOutlined style={{ color: '#666', fontSize: '14px' }} />
            </div>
          </div>
        </Card>
      </Link>
    </Col>
  )

  const renderModelCard = (model) => (
    <Col key={model.id} xs={12} sm={8} md={6} lg={4} xl={4} xxl={3}>
      <Link to={`/asset/${model.id}`}>
        <Card
          hoverable
          bodyStyle={{ padding: '8px', height: '80px' }}
          style={{ 
            background: '#1a1a1a', 
            marginBottom: '16px',
            border: '1px solid #333',
            borderRadius: '4px',
            overflow: 'hidden'
          }}
          cover={
            <div style={{ position: 'relative' }}>
              <img 
                alt={model.title} 
                src={model.thumbnail} 
                style={{ 
                  width: '100%', 
                  height: '180px', 
                  objectFit: 'cover',
                  background: '#222'
                }} 
              />
              {model.isNew && (
                <Tag color="#D4AF37" style={{ position: 'absolute', top: '8px', right: '8px' }}>
                  NEW
                </Tag>
              )}
              <div style={{ 
                position: 'absolute', 
                bottom: '8px', 
                right: '8px',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                padding: '4px'
              }}>
                <PlayCircleOutlined style={{ color: '#D4AF37', fontSize: '24px' }} />
              </div>
            </div>
          }
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'normal', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {model.title}
            </div>
            <div style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '14px' }}>
              {model.price}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {model.compatibility.map((comp, index) => (
                <Tag key={index} style={{ fontSize: '10px', padding: '0 4px', lineHeight: '16px', background: '#333', border: 'none' }}>
                  {comp}
                </Tag>
              ))}
            </div>
            <Space>
              <HeartOutlined style={{ color: '#999' }} />
              <ShoppingCartOutlined style={{ color: '#999' }} />
            </Space>
          </div>
        </Card>
      </Link>
    </Col>
  )

  const filterByCategory = (category) => {
    if (category === '全部') {
      setFilteredMotions(mockMotions)
    } else {
      setFilteredMotions(mockMotions.filter(motion => motion.category === category))
    }
  }

  const renderPacksSection = () => (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '0 4px'
      }}>
        <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'normal' }}>素材包 ({mockPacks.length})</div>
      </div>
      
      <Row gutter={16}>
        {mockPacks.map(renderPackCard)}
      </Row>
    </div>
  )

  const renderMainBanner = () => (
    <div className="main-banner" style={{ 
      height: '500px',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '40px'
    }}>
      <div style={{ 
        background: 'rgba(0,0,0,0.6)',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '700px',
        position: 'relative',
        zIndex: 2
      }}>
        <h1 style={{ 
          color: '#D4AF37', 
          fontSize: '38px', 
          fontWeight: 'bold',
          marginBottom: '20px'
        }}>
          限时优惠: 全场7折
        </h1>
        <p style={{ 
          color: '#fff', 
          fontSize: '16px',
          marginBottom: '30px'
        }}>
          所有角色和动作资源限时折扣，把握机会立即行动
        </p>
        <Button 
          type="primary" 
          style={{ 
            background: '#D4AF37', 
            borderColor: '#D4AF37', 
            fontSize: '16px',
            height: '40px',
            padding: '0 30px',
            borderRadius: '0'
          }}
        >
          浏览商店
        </Button>
      </div>
    </div>
  )

  const renderFeaturedResources = () => (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '20px', color: '#fff' }}>精选资源</div>
        <Link to="/more" style={{ color: '#D4AF37', display: 'flex', alignItems: 'center' }}>
          查看全部 <RightOutlined style={{ fontSize: '12px', marginLeft: '5px' }} />
        </Link>
      </div>
      
      <Row gutter={[16, 16]}>
        {activeTab === 'model' 
          ? filteredModels.slice(0, 8).map(renderModelCard) 
          : filteredMotions.slice(0, 8).map(renderMotionCard)}
      </Row>
    </div>
  )

  const renderCategories = () => (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ fontSize: '20px', color: '#fff', marginBottom: '20px' }}>浏览分类</div>
      
      <Row gutter={[16, 16]}>
        {categoryItems.map((category, index) => (
          <Col key={index} xs={12} sm={12} md={6} span={6}>
            <Link to={`/category/${encodeURIComponent(category.title)}`}>
          <Card 
            hoverable 
            style={{ 
                  background: '#111', 
                  border: 'none',
                  borderRadius: '0',
                  height: '80px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ fontSize: '24px', marginRight: '15px' }}>{category.icon}</div>
                  <div>
                    <div style={{ color: '#D4AF37', fontSize: '14px' }}>{category.title}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{category.count} 项目</div>
                  </div>
            </div>
          </Card>
            </Link>
        </Col>
        ))}
      </Row>
    </div>
  )

  const renderPackCard = (pack) => (
    <Col key={pack.id} span={8}>
      <Link to={`/pack/${pack.id}`}>
          <Card 
            hoverable 
            style={{ 
            background: '#111',
            border: 'none',
            borderRadius: '0',
            height: '260px',
              overflow: 'hidden',
            position: 'relative',
            marginBottom: '20px'
            }}
          bodyStyle={{ padding: 0, height: '100%' }}
          >
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
            background: 'rgba(0,0,0,0.5)',
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            padding: '20px'
          }}>
            <Title level={3} style={{ color: '#D4AF37', marginBottom: '10px', textAlign: 'center' }}>
              {pack.title}
            </Title>
            <Paragraph style={{ color: '#ccc', marginBottom: '20px', textAlign: 'center' }}>
              {pack.description}
            </Paragraph>
            
            <Tag color="#D4AF37" style={{ marginBottom: '20px', color: '#000' }}>
              {pack.itemCount}个动作
            </Tag>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {pack.price === '免费' ? (
                <Button type="primary" style={{ background: '#D4AF37', borderColor: '#D4AF37', color: '#000' }}>
                  免费获取
                </Button>
              ) : (
                <>
                  <span style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '18px' }}>{pack.price}</span>
                  {pack.discount && (
                    <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '14px' }}>
                      {pack.originalPrice}
                    </span>
                  )}
                  <Button type="primary" style={{ background: '#D4AF37', borderColor: '#D4AF37', color: '#000' }}>
                    购买
                  </Button>
                </>
              )}
            </div>
            
            {pack.isLimited && (
              <div style={{ 
                position: 'absolute', 
                top: '10px', 
                left: '0', 
                background: '#D4AF37', 
                color: '#000', 
                padding: '4px 10px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                限时优惠
              </div>
            )}
            
            {pack.discount && (
              <div style={{ 
                position: 'absolute', 
                top: '10px', 
                right: '10px', 
                background: '#D4AF37', 
                color: '#000', 
                padding: '2px 6px',
                fontSize: '12px',
                fontWeight: 'bold',
                borderRadius: '0'
              }}>
                {pack.discount}
              </div>
            )}
            </div>
          </Card>
      </Link>
        </Col>
  )

  return (
    <div className="home-container">
      {/* 主横幅 */}
      <div className="main-banner">
        <Carousel autoplay effect="fade">
          {bannerItems.map((banner, index) => (
            <div key={index}>
              <div className="banner-content" style={{ 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${banner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '500px',
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
                padding: '0 20px',
                textAlign: 'center'
              }}>
                <h1 style={{ 
                  color: '#fff', 
                  fontSize: '48px', 
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>{banner.title}</h1>
                <p style={{ 
                  color: '#ccc', 
                  fontSize: '20px',
                  marginBottom: '40px',
                  maxWidth: '800px'
                }}>{banner.subtitle}</p>
                <Link to={banner.link}>
                  <Button 
                    type="primary" 
                    size="large"
                    style={{ 
                      height: '50px',
                      borderRadius: '25px',
                      fontSize: '18px',
                      paddingLeft: '35px',
                      paddingRight: '35px'
                    }}
                  >
                    {banner.buttonText}
                </Button>
                </Link>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* 精选资源 */}
      <div className="section" style={{ padding: '60px 20px' }}>
        <div className="section-header" style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h2 className="section-title">精选资源</h2>
          <p className="section-subtitle">为您精心挑选的优质3D素材</p>
        </div>

        <Row gutter={[24, 24]}>
          {filteredAssets.map(item => (
            <Col xs={24} sm={12} md={8} lg={8} xl={8} key={item.id}>
              <Link to={`/product/${item.id}`}>
                <Card 
                  className="product-card"
                  cover={
                    <div className="product-image-container">
                      <img 
                        alt={item.title} 
                        src={item.thumbnail} 
                        className="product-image"
                      />
                      <div className="product-overlay">
                        <PlayCircleOutlined className="play-icon" />
                      </div>
                      <div className="product-tags">
                        {item.tags.map((tag, index) => (
                          <Tag key={index} color={tag === '热门' ? '#D4AF37' : '#333'} style={{ margin: '0 5px 5px 0' }}>
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  }
                  actions={[
                    <div className="product-action">
                      <HeartOutlined key="heart" />
                      <span>收藏</span>
                    </div>,
                    <div className="product-action">
                      <ShoppingCartOutlined key="cart" />
                      <span>购买</span>
                    </div>
                  ]}
                >
                  <div className="product-title">{item.title}</div>
                  <div className="product-meta">
                    <div className="product-rating">
                      <StarOutlined style={{ color: '#D4AF37' }} /> {item.rating}
                    </div>
                    <div className="product-downloads">
                      <DownloadOutlined /> {item.downloads}
                    </div>
                  </div>
                  <div className="product-price">
                    <span className="current-price">¥{item.price}</span>
                    <span className="original-price">¥{item.originalPrice}</span>
            </div>
          </Card>
              </Link>
        </Col>
          ))}
      </Row>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/store">
            <Button type="primary" size="large" className="more-button">
              查看更多资源 <RightOutlined />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* 浏览分类 */}
      <div className="section dark-section" style={{ padding: '60px 20px', background: '#000' }}>
        <div className="section-header" style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h2 className="section-title">浏览分类</h2>
          <p className="section-subtitle">按类别找到您需要的素材</p>
        </div>

        <Row gutter={[24, 24]}>
          {categoryItems.map((category, index) => (
            <Col xs={24} sm={12} md={12} lg={6} xl={6} key={index}>
              <Link to={`/category/${category.title}`}>
                <Card 
                  className="category-card"
                  cover={
                    <div className="category-image-container">
                      <img alt={category.title} src={`/images/category${index + 1}.jpg`} className="category-image" />
                      <div className="category-overlay">
                        <div className="category-icon">{category.icon}</div>
                      </div>
                    </div>
                  }
                >
                  <div className="category-title">{category.title}</div>
                  <div className="category-description">{category.description}</div>
                  <div className="category-count">{category.count}个素材</div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* 素材包 */}
      <div className="section" style={{ padding: '60px 20px' }}>
        <div className="section-header" style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h2 className="section-title">素材包</h2>
          <p className="section-subtitle">一次购买，长期使用</p>
        </div>

        <Row gutter={[24, 24]}>
          {mockPacks.map((pack, index) => (
            <Col xs={24} sm={24} md={8} lg={8} xl={8} key={index}>
              <Link to={`/pack/${pack.id}`}>
                <Card 
                  className="pack-card"
                  cover={
                    <div className="pack-image-container">
                      <img alt={pack.title} src={pack.thumbnail} className="pack-image" />
                      <div className="pack-badge">
                        <FireOutlined /> 热门
                      </div>
                    </div>
                  }
                >
                  <div className="pack-title">{pack.title}</div>
                  <div className="pack-description">{pack.description}</div>
                  <div className="pack-meta">
                    <div className="pack-item-count">{pack.itemCount}个素材</div>
                    <div className="pack-price">
                      <span className="current-price">¥{pack.price}</span>
                      <span className="original-price">¥{pack.originalPrice}</span>
                      <span className="discount-tag">省{Math.round((pack.originalPrice - pack.price) / pack.originalPrice * 100)}%</span>
                    </div>
                  </div>
                  <Button type="primary" block className="pack-button">
                    查看详情
                  </Button>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* 会员介绍 */}
      <div className="section membership-section" style={{ 
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #000 0%, #222 100%)',
        margin: '40px 0',
        borderTop: '1px solid #333',
        borderBottom: '1px solid #333'
      }}>
        <Row gutter={48} align="middle">
          <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              background: 'linear-gradient(to right, #D4AF37, #E5C250)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              成为VIP会员，享受更多特权
            </h2>
            <p style={{ fontSize: '16px', color: '#bbb', marginBottom: '30px', lineHeight: '1.8' }}>
              每月解锁新素材，无限制下载，优先获取最新资源，尊享技术支持，多设备使用，素材商用授权...
            </p>
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#D4AF37', marginRight: '15px', textAlign: 'center', lineHeight: '24px' }}>✓</div>
                <span style={{ color: '#ccc' }}>每月获取100个精选素材</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#D4AF37', marginRight: '15px', textAlign: 'center', lineHeight: '24px' }}>✓</div>
                <span style={{ color: '#ccc' }}>无限制下载会员素材库</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#D4AF37', marginRight: '15px', textAlign: 'center', lineHeight: '24px' }}>✓</div>
                <span style={{ color: '#ccc' }}>商业用途授权</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#D4AF37', marginRight: '15px', textAlign: 'center', lineHeight: '24px' }}>✓</div>
                <span style={{ color: '#ccc' }}>优先获取最新资源</span>
              </div>
            </div>
            <Link to="/membership">
              <Button type="primary" size="large" style={{ height: '50px', paddingLeft: '30px', paddingRight: '30px', fontSize: '16px' }}>
                立即开通 VIP
              </Button>
            </Link>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ textAlign: 'center' }}>
            <img src="/images/vip-badge.png" alt="VIP会员" style={{ maxWidth: '80%', filter: 'drop-shadow(0 10px 20px rgba(212, 175, 55, 0.3))' }} />
          </Col>
      </Row>
      </div>
    </div>
  )
}

export default Home 