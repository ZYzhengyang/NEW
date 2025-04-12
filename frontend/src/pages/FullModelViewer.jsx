import React from 'react';
import { Card, Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title } = Typography;

function FullModelViewer() {
  const navigate = useNavigate();
  const location = useLocation();
  const modelUrl = location.state?.modelUrl || '/models/example.glb';
  const modelName = location.state?.title || '3D模型预览';

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
        >
          返回
        </Button>
        <Title level={3} style={{ margin: 0 }}>{modelName}</Title>
        <div style={{ width: '32px' }}></div> {/* 用于对称布局 */}
      </div>
      
      <Card bodyStyle={{ padding: 0 }}>
        <iframe
          src="/poe-preview (2).html"
          style={{
            width: '100%',
            height: 'calc(100vh - 150px)',
            border: 'none',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
          title="完整3D预览"
        />
      </Card>
    </div>
  );
}

export default FullModelViewer; 