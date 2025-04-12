import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Badge, Avatar, Dropdown, Button, Select, Divider, Row, Col, Space, Input } from 'antd'
import { 
  HomeOutlined, 
  SearchOutlined,
  ShoppingCartOutlined, 
  UserOutlined,
  MenuOutlined,
  SettingOutlined,
  FireOutlined,
  ClockCircleOutlined,
  GiftOutlined,
  AppstoreOutlined,
  RightOutlined,
  BellOutlined,
  DownOutlined
} from '@ant-design/icons'
import '../App.css'

const { Header, Content, Footer, Sider } = AntLayout
const { Search } = Input;

function Layout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // 分类数据
  const categories = [
    { name: '全部', count: 4173, icon: <AppstoreOutlined /> },
    { name: '日常生活', count: 1853, icon: <HomeOutlined /> },
    { name: '交流互动', count: 811, icon: <UserOutlined /> },
    { name: '娱乐', count: 647, icon: <HomeOutlined /> },
    { name: '战斗', count: 659, icon: <HomeOutlined /> },
    { name: '动作与冒险', count: 575, icon: <HomeOutlined /> },
    { name: '中世纪与奇幻', count: 242, icon: <HomeOutlined /> },
    { name: '卡通与动漫', count: 710, icon: <HomeOutlined /> },
    { name: '非人类', count: 45, icon: <HomeOutlined /> },
  ];
  
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const userMenu = (
    <Menu theme="dark">
      <Menu.Item key="profile">个人中心</Menu.Item>
      <Menu.Item key="orders">我的订单</Menu.Item>
      <Menu.Item key="settings">账号设置</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">退出登录</Menu.Item>
    </Menu>
  );

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <div className="top-notification">
        <Row justify="center" align="middle" style={{ height: '36px', background: '#000', borderBottom: '1px solid #222' }}>
          <Col xs={0} sm={0} md={8} lg={8} xl={8} style={{ textAlign: 'left', paddingLeft: '20px' }}>
            <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>客服热线: 400-123-4567</span>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8} style={{ textAlign: 'center' }}>
            <span style={{ color: '#fff' }}>今日限定: <span className="gold-text">全场作品8折</span> | 新用户注册送100金币</span>
          </Col>
          <Col xs={0} sm={0} md={8} lg={8} xl={8} style={{ textAlign: 'right', paddingRight: '20px' }}>
            <Link to="/login" style={{ color: '#999', marginRight: '20px' }}>登录</Link>
            <Link to="/register" style={{ color: '#999' }}>注册</Link>
          </Col>
        </Row>
      </div>
      
      <Header style={{ padding: '0 20px', height: '64px', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <Row justify="space-between" align="middle">
          <Col span={5}>
            <div className="logo" style={{ background: 'none', margin: '16px 0' }}>
              <Link to="/">
                <img src="/logo.png" alt="ActorCore" height="32" />
              </Link>
            </div>
          </Col>
          
          <Col span={10}>
            <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]} style={{ border: 'none' }}>
              <Menu.Item key="/" icon={<HomeOutlined />}>
                <Link to="/">首页</Link>
              </Menu.Item>
              <Menu.Item key="/store" icon={<AppstoreOutlined />}>
                <Link to="/store">素材库</Link>
              </Menu.Item>
              <Menu.Item key="/hot" icon={<FireOutlined />}>
                <Link to="/hot">热门</Link>
              </Menu.Item>
              <Menu.Item key="/packs" icon={<ShoppingOutlined />}>
                <Link to="/packs">素材包</Link>
              </Menu.Item>
            </Menu>
          </Col>
          
          <Col span={9} style={{ textAlign: 'right' }}>
            <Row justify="end" align="middle" gutter={16}>
              <Col>
                <Search
                  placeholder="搜索素材..."
                  allowClear
                  enterButton={<SearchOutlined style={{ fontSize: '16px' }} />}
                  size="middle"
                  className="dark-search"
                  style={{ width: 220 }}
                />
              </Col>
              <Col>
                <Badge count={3} size="small">
                  <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: '20px', color: '#fff' }} />} />
                </Badge>
              </Col>
              <Col>
                <Badge dot>
                  <Button type="text" icon={<BellOutlined style={{ fontSize: '20px', color: '#fff' }} />} />
                </Badge>
              </Col>
              <Col>
                <Dropdown overlay={userMenu} placement="bottomRight">
                  <Button type="text" style={{ height: '64px', padding: '0 8px' }}>
                    <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: '8px', backgroundColor: '#D4AF37' }} />
                    <span style={{ color: '#fff' }}>用户名</span>
                    <DownOutlined style={{ fontSize: '12px', marginLeft: '5px', color: '#999' }} />
                  </Button>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
      
      <AntLayout>
        <Sider 
          width={220} 
          style={{ 
            overflow: 'auto',
            height: '100vh',
            position: 'sticky',
            left: 0,
            top: 100,
            border: 'none',
            boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
          }}
          collapsible={true}
          onCollapse={onCollapse}
        >
          <div style={{ padding: '16px 0', textAlign: 'center' }}>
            <span className="gold-text" style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {collapsed ? '分类' : '素材分类'}
            </span>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['motion']} style={{ borderRight: 'none' }}>
            <Menu.Item key="motion" icon={<AppstoreOutlined />}>
              <Link to="/category/motion">动作</Link>
            </Menu.Item>
            <Menu.Item key="expression" icon={<AppstoreOutlined />}>
              <Link to="/category/expression">表情</Link>
            </Menu.Item>
            <Menu.Item key="scene" icon={<AppstoreOutlined />}>
              <Link to="/category/scene">场景</Link>
            </Menu.Item>
            <Menu.Item key="prop" icon={<AppstoreOutlined />}>
              <Link to="/category/prop">道具</Link>
            </Menu.Item>
            <Menu.Item key="character" icon={<AppstoreOutlined />}>
              <Link to="/category/character">角色</Link>
            </Menu.Item>
            <Menu.Item key="effect" icon={<AppstoreOutlined />}>
              <Link to="/category/effect">特效</Link>
            </Menu.Item>
            <Menu.Item key="sound" icon={<AppstoreOutlined />}>
              <Link to="/category/sound">音效</Link>
            </Menu.Item>
          </Menu>
          
          <Divider style={{ margin: '16px 0', borderColor: '#333' }} />
          
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ color: '#999', marginBottom: '12px', fontSize: '14px' }}>热门标签</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Link to="/tag/战斗" style={{ color: '#D4AF37', fontSize: '12px', padding: '2px 8px', border: '1px solid #333', borderRadius: '2px' }}>战斗</Link>
              <Link to="/tag/舞蹈" style={{ color: '#D4AF37', fontSize: '12px', padding: '2px 8px', border: '1px solid #333', borderRadius: '2px' }}>舞蹈</Link>
              <Link to="/tag/魔法" style={{ color: '#D4AF37', fontSize: '12px', padding: '2px 8px', border: '1px solid #333', borderRadius: '2px' }}>魔法</Link>
              <Link to="/tag/日常" style={{ color: '#D4AF37', fontSize: '12px', padding: '2px 8px', border: '1px solid #333', borderRadius: '2px' }}>日常</Link>
              <Link to="/tag/表情" style={{ color: '#D4AF37', fontSize: '12px', padding: '2px 8px', border: '1px solid #333', borderRadius: '2px' }}>表情</Link>
              <Link to="/tag/武器" style={{ color: '#D4AF37', fontSize: '12px', padding: '2px 8px', border: '1px solid #333', borderRadius: '2px' }}>武器</Link>
            </div>
          </div>
        </Sider>
        
        <Content style={{ padding: '0', background: '#111' }}>
          {location.pathname === '/' && (
            <div style={{ 
              background: '#D4AF37', 
              padding: '10px 16px',
              color: '#000',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              多件商品数量折扣: 购买3+件享15%折扣, 6+件享30%折扣. 查看详情 <RightOutlined style={{ fontSize: '12px' }} />
            </div>
          )}
          <Outlet />
          
          <div style={{ background: '#000', padding: '40px 20px 20px', marginTop: '40px', borderTop: '1px solid #222' }}>
            <Row gutter={[32, 32]}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <div style={{ marginBottom: '20px' }}>
                  <img src="/logo.png" alt="ActorCore" height="40" />
                </div>
                <p style={{ color: '#999', fontSize: '14px', lineHeight: '1.8' }}>
                  ActorCore提供优质的3D素材库，为创作者提供丰富的动作、表情等资源，让您的创作更加简单高效。
                </p>
              </Col>
              <Col xs={24} sm={12} md={5} lg={5} xl={5}>
                <h3 style={{ color: '#D4AF37', marginBottom: '20px', fontSize: '16px' }}>关于我们</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '10px' }}><Link to="/about" style={{ color: '#999' }}>公司介绍</Link></li>
                  <li style={{ marginBottom: '10px' }}><Link to="/contact" style={{ color: '#999' }}>联系我们</Link></li>
                  <li style={{ marginBottom: '10px' }}><Link to="/terms" style={{ color: '#999' }}>服务条款</Link></li>
                  <li style={{ marginBottom: '10px' }}><Link to="/privacy" style={{ color: '#999' }}>隐私政策</Link></li>
                </ul>
              </Col>
              <Col xs={24} sm={12} md={5} lg={5} xl={5}>
                <h3 style={{ color: '#D4AF37', marginBottom: '20px', fontSize: '16px' }}>服务支持</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '10px' }}><Link to="/faq" style={{ color: '#999' }}>常见问题</Link></li>
                  <li style={{ marginBottom: '10px' }}><Link to="/tutorial" style={{ color: '#999' }}>使用教程</Link></li>
                  <li style={{ marginBottom: '10px' }}><Link to="/feedback" style={{ color: '#999' }}>问题反馈</Link></li>
                  <li style={{ marginBottom: '10px' }}><Link to="/community" style={{ color: '#999' }}>社区交流</Link></li>
                </ul>
              </Col>
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <h3 style={{ color: '#D4AF37', marginBottom: '20px', fontSize: '16px' }}>联系我们</h3>
                <p style={{ color: '#999', marginBottom: '10px' }}>客服邮箱：support@actorcore.com</p>
                <p style={{ color: '#999', marginBottom: '10px' }}>商务合作：business@actorcore.com</p>
                <p style={{ color: '#999', marginBottom: '20px' }}>客服热线：400-123-4567（周一至周五 9:00-18:00）</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <a href="#" style={{ color: '#D4AF37', fontSize: '20px' }}><i className="fab fa-weixin"></i></a>
                  <a href="#" style={{ color: '#D4AF37', fontSize: '20px' }}><i className="fab fa-weibo"></i></a>
                  <a href="#" style={{ color: '#D4AF37', fontSize: '20px' }}><i className="fab fa-bilibili"></i></a>
                </div>
              </Col>
            </Row>
            <Divider style={{ margin: '30px 0 20px', borderColor: '#222' }} />
            <div style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
              © 2023 ActorCore. All Rights Reserved. 版权所有
            </div>
          </div>
        </Content>
      </AntLayout>
      
      <Footer style={{ textAlign: 'center', padding: '12px', background: '#0A0A0A', color: '#666', fontSize: '12px' }}>
        LightActorCore © 2023 版权所有
      </Footer>
    </AntLayout>
  )
}

export default Layout 