// ImageCanvas.tsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ImageDataProps } from './types/ImageDataProps';
import { ImageContext } from './components/ImageProvider';

const ImageCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { imageData } = useContext(ImageContext);

  const drawImage = (data: ImageDataProps) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const { width, height, pixels } = data;
        canvas.width = width;
        canvas.height = height;

        const imageData = ctx.createImageData(width, height);

        for (let i = 0; i < pixels.length; i++) {
          imageData.data[i] = pixels[i];
        }

        ctx.putImageData(imageData, 0, 0);
      }
    }
  };

  useEffect(() => {
    if (imageData) drawImage(imageData);
  }, [imageData]);

  return (
    <div className='app-workspace'>
      <canvas ref={canvasRef} style={{  }} />
      { !imageData &&
        <p className='workspace-info'>No image data loaded yet ..</p>
      }
    </div>
  );
};

export default ImageCanvas;
