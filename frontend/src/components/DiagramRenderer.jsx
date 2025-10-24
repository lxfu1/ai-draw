import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react';
import { toast } from 'react-hot-toast';
import mermaid from 'mermaid';
import plantumlEncoder from 'plantuml-encoder';
import { Alert } from 'antd';
import { downloadAsImage, downloadPlantUMLImage } from '../utils/download';

const DiagramRenderer = forwardRef(({ code, type }, ref) => {
  const containerRef = useRef(null);
  const [error, setError] = useState('');
  const [isRendering, setIsRendering] = useState(true);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const downloadDiagram = async () => {
    if (!code) {
      toast.error('没有可下载的图表');
      return;
    }

    try {
      if (type === 'mermaid') {
        const svgElement = containerRef.current?.querySelector('svg');
        if (svgElement) {
          await downloadAsImage(svgElement, 'mermaid-diagram');
          toast.success('图表下载成功');
        } else {
          toast.error('无法找到可下载的图表');
        }
      } else if (type === 'plantuml' && currentImageUrl) {
        await downloadPlantUMLImage(currentImageUrl, 'plantuml-diagram');
        toast.success('图表下载成功');
      }
    } catch (error) {
      toast.error('下载失败，请重试');
      console.error('Download error:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    downloadDiagram
  }));

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code || !containerRef.current) return;

      setIsRendering(true);
      setError('');

      try {
        if (type === 'mermaid') {
          await renderMermaidDiagram(code);
        } else if (type === 'plantuml') {
          await renderPlantUMLDiagram(code);
        }
      } catch (err) {
        setError(`渲染错误: ${err.message}`);
        console.error('Diagram rendering error:', err);
      } finally {
        setIsRendering(false);
      }
    };

    renderDiagram();
  }, [code, type]);

  const validateMermaidCode = async (code) => {
    const validKeywords = [
      'graph',
      'flowchart',
      'sequenceDiagram',
      'classDiagram',
      'stateDiagram',
      'erDiagram',
      'journey',
      'gantt',
      'pie',
      'gitgraph'
    ];

    return validKeywords.some((keyword) =>
      code.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const renderMermaidDiagram = async (diagramCode) => {
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'arial',
        fontSize: 16
      });

      const isValid = await validateMermaidCode(diagramCode);
      if (!isValid) {
        throw new Error('无效的 Mermaid 语法');
      }

      const container = containerRef.current;
      container.innerHTML = '';

      const { svg } = await mermaid.render(
        `mermaid-diagram-${Date.now()}`,
        diagramCode
      );
      container.innerHTML = svg;
    } catch (err) {
      throw new Error(`Mermaid 渲染失败: ${err.message}`);
    }
  };

  const validatePlantUMLCode = (code) => {
    const validKeywords = [
      '@startuml',
      '@startmindmap',
      '@startwbs',
      '@startjson',
      '@startyaml',
      '@startsalt',
      '@startcreole',
      '@startdot',
      '@startuml'
    ];

    const isValid = validKeywords.some((keyword) =>
      code.toLowerCase().includes(keyword.toLowerCase())
    );

    let replacedCode = code;

    validKeywords.forEach((keyword) => {
      replacedCode = replacedCode.replace(new RegExp(keyword, 'gi'), '');
    });

    return { isValid, replacedCode };
  };

  const renderPlantUMLDiagram = async (diagramCode) => {
    try {
      const { isValid, replacedCode } = validatePlantUMLCode(diagramCode);
      if (!isValid) {
        throw new Error('无效的 PlantUML 语法');
      }

      // 3. 用 plantuml-encoder 编码
      const encoded = plantumlEncoder.encode(replacedCode);
      const container = containerRef.current;
      container.innerHTML = '';

      const imageUrl = `https://www.plantuml.com/plantuml/svg/${encoded}`;
      setCurrentImageUrl(imageUrl);

      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.alt = 'PlantUML Diagram';

      container.appendChild(img);
    } catch (err) {
      throw new Error(`PlantUML 渲染失败: ${err.message}`);
    }
  };

  return (
    <div className='diagram-render'>
      {isRendering && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div>正在渲染图表...</div>
        </div>
      )}

      {error && (
        <Alert
          message='渲染错误'
          description={error}
          type='error'
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <div
        ref={containerRef}
        style={{
          display: isRendering ? 'none' : 'block',
          textAlign: 'center',
          minHeight: '200px'
        }}
      />

      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          background: 'rgb(245, 245, 245)',
          padding: 12
        }}
      >
        <details>
          <summary
            style={{ cursor: 'pointer', color: '#666', fontSize: '12px' }}
          >
            查看生成的代码
          </summary>
          <pre style={{ marginTop: 12 }}>{code}</pre>
        </details>
      </div>
    </div>
  );
});

DiagramRenderer.displayName = 'DiagramRenderer';

export default DiagramRenderer;
