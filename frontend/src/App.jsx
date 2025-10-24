import React, { useState, useRef } from 'react';
import {
  Layout,
  Card,
  Input,
  Button,
  Select,
  Spin,
  message,
  Space
} from 'antd';
import {
  StepForwardOutlined,
  ReloadOutlined,
  CopyOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import toast, { Toaster } from 'react-hot-toast';
import DiagramRenderer from './components/DiagramRenderer';
import { generateDiagram } from './services/api';
import './App.css';

const { Header, Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

function App() {
  const [description, setDescription] = useState('');
  const [type, setType] = useState('mermaid');
  const [loading, setLoading] = useState(false);
  const [diagramCode, setDiagramCode] = useState(`flowchart TD
    A[用户输入账号密码] --> B[前端校验格式]
    B --> C[发送请求到后端]
    C --> D[后端验证用户信息]
    D -->|验证成功| E[生成 token 返回]
    D -->|验证失败| F[返回错误信息]
    E --> G[前端跳转页面]
    F --> H[前端显示错误]`);
  const [error, setError] = useState('');
  const diagramRef = useRef(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      message.error('请输入绘图描述');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await generateDiagram(description, type);
      setDiagramCode(result.code);
      message.success('绘图代码生成成功！');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || '生成失败，请重试';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleCopyCode = () => {
    if (!diagramCode) return;
    navigator.clipboard
      .writeText(diagramCode)
      .then(() => {
        toast.success('代码已复制到剪贴板');
      })
      .catch(() => {
        toast.error('复制失败');
      });
  };

  const handleDownloadImage = () => {
    if (diagramRef.current) {
      diagramRef.current.downloadDiagram();
    } else {
      toast.error('没有可下载的图表');
    }
  };

  return (
    <Layout className='app-container'>
      <Header className='app-header'>
        <div style={{ color: '#1890ff', fontSize: '20px', fontWeight: 'bold' }}>
          AI 绘图生成工具
        </div>
      </Header>

      <Content className='main-content'>
        <Card title='输入区域' size='small' style={{ marginBottom: 24 }}>
          <label style={{ marginBottom: 8, display: 'block' }}>
            绘图类型：
          </label>
          <Select value={type} onChange={setType} style={{ width: '100%' }}>
            <Option value='mermaid'>Mermaid</Option>
            <Option value='plantuml'>PlantUML</Option>
          </Select>

          <div
            style={{
              margin: '12px 0'
            }}
          >
            <label style={{ marginBottom: 8, display: 'block' }}>
              绘图描述：
            </label>
            <TextArea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='请输入您想要生成的图形描述，例如：一个包含用户、订单和产品的系统架构图...'
              className='code-editor'
            />
          </div>

          <Space>
            <Button
              type='primary'
              icon={<StepForwardOutlined />}
              onClick={handleGenerate}
              loading={loading}
            >
              生成
            </Button>

            {diagramCode && (
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRegenerate}
                loading={loading}
              >
                重新生成
              </Button>
            )}
          </Space>
        </Card>

        <Card
          title='预览区域'
          size='small'
          extra={
            diagramCode && (
              <Space>
                <Button
                  size='small'
                  icon={<CopyOutlined />}
                  onClick={handleCopyCode}
                >
                  复制代码
                </Button>
                <Button
                  size='small'
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadImage}
                >
                  下载图片
                </Button>
              </Space>
            )
          }
        >
          <div className='diagram-container'>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Spin size='large' />
                <div style={{ marginTop: 16, color: '#666' }}>
                  正在生成绘图代码...
                </div>
              </div>
            ) : error ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#ff4d4f'
                }}
              >
                <div style={{ fontSize: '16px', marginBottom: 16 }}>
                  生成失败
                </div>
                <div style={{ fontSize: '14px' }}>{error}</div>
              </div>
            ) : diagramCode ? (
              <DiagramRenderer
                ref={diagramRef}
                code={diagramCode}
                type={type}
              />
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 0',
                  color: '#999'
                }}
              >
                请输入描述并点击生成按钮
              </div>
            )}
          </div>
        </Card>
      </Content>
      <Toaster />
    </Layout>
  );
}

export default App;
