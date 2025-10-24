export const downloadAsImage = (
  svgElement: SVGElement,
  filename = 'diagram'
) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 序列化SVG
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8'
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.crossOrigin = 'anonymous';

      // 图片加载成功
      img.onload = () => {
        try {
          // 可根据需要替换为 getBoundingClientRect() 获取显示尺寸
          canvas.width = img.width;
          canvas.height = img.height;

          // 填充白色背景（避免透明）
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          // 转换为PNG blob
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.download = `${filename}.png`;
              link.href = url;
              link.click();

              // 释放资源
              URL.revokeObjectURL(url);
              URL.revokeObjectURL(svgUrl);
              resolve();
            } else {
              URL.revokeObjectURL(svgUrl);
              reject(new Error('Failed to convert canvas to blob'));
            }
          }, 'image/png');
        } catch (err) {
          URL.revokeObjectURL(svgUrl);
          reject(err);
        }
      };

      // 图片加载失败
      img.onerror = (err) => {
        URL.revokeObjectURL(svgUrl);
        reject(new Error(`Image load failed: ${err}`));
      };

      img.src = svgUrl;
    } catch (error) {
      console.error('Download failed:', error);
      reject(error);
    }
  });
};

export const downloadPlantUMLImage = async (
  imageUrl: string,
  filename = 'diagram'
) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = `${filename}.svg`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};
