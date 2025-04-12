import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, theme, Avatar, Dropdown, Button } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  UserOutlined,
  TagOutlined,
  SettingOutlined,
  LogoutOutlined,
  BarsOutlined,
  FileOutlined,
  ShoppingOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const handleMenuClick = (e) => {
    navigate(e.key);
  };
  
  const items = [
    {
      key: 'profile',
      label: '个人信息',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: '设置',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        style={{ 
          background: '#0C0C0C',
          borderRight: '1px solid #222'
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 16px',
          color: '#D4AF37',
          fontSize: '18px',
          fontWeight: 'bold',
          borderBottom: '1px solid #222'
        }}>
          {!collapsed && 'LightActorCore'}
          {collapsed && <AppstoreOutlined />}
        </div>
        <Menu 
          theme="dark" 
          defaultSelectedKeys={['dashboard']} 
          mode="inline" 
          onClick={handleMenuClick}
          style={{ background: '#0C0C0C' }}
          items={[
            {
              key: '/admin',
              icon: <DashboardOutlined />,
              label: '控制面板',
            },
            {
              key: '/admin/assets',
              icon: <AppstoreOutlined />,
              label: '资产管理',
            },
            {
              key: '/admin/animations',
              icon: <BarsOutlined />,
              label: '动画管理',
            },
            {
              key: '/admin/categories',
              icon: <TagOutlined />,
              label: '分类管理',
            },
            {
              key: '/admin/users',
              icon: <UserOutlined />,
              label: '用户管理',
            },
            {
              key: '/admin/orders',
              icon: <ShoppingOutlined />,
              label: '订单管理',
            },
            {
              key: '/admin/files',
              icon: <FileOutlined />,
              label: '文件管理',
            },
            {
              key: '/admin/settings',
              icon: <SettingOutlined />,
              label: '系统设置',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#0C0C0C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #222'
        }}>
          <div style={{ fontSize: '18px', color: '#D4AF37', fontWeight: 'bold' }}>
            管理控制台
          </div>
          <div>
            <Dropdown menu={{ items }} placement="bottomRight">
              <Button type="text" style={{ height: 'auto', color: '#D4AF37' }}>
                <Avatar style={{ backgroundColor: '#D4AF37', marginRight: 8 }} icon={<UserOutlined />} />
                管理员
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ 
            padding: 24, 
            background: '#0C0C0C', 
            borderRadius: borderRadiusLG,
            minHeight: '100%',
            border: '1px solid #222'
          }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout; 