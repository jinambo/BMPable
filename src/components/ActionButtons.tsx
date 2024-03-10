import React, { useContext, useEffect, useRef, useState } from 'react';
import { ImageDataProps } from '../types/ImageDataProps';
import { ImageContext } from './ImageProvider';
const { ipcRenderer } = window.electron;

const ActionButtons: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setImageData, imageData } = useContext(ImageContext);

  useEffect(() => {
    const handleFileChange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const path = target.files[0].path;
        try {
          const data: ImageDataProps = await ipcRenderer.invoke('load-image', path);
          setImageData(data);
        } catch (error) {
          console.error('Failed to load image', error);
        }
      }
    };

    if (inputRef.current) {
      inputRef.current.addEventListener('change', handleFileChange);
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('change', handleFileChange);
      }
    };
  }, []);

  const openFilePicker = () => {
    if (inputRef.current) {
      inputRef.current.click(); // Aktivace kliknutí na skrytý input
    }
  };

  const saveImage = async () => {
    const result = await ipcRenderer.invoke('save-image', { ...imageData });
    if (result.success) {
      console.log('Image saved to:', result.path);
    } else {
      console.error('Failed to save image:', result.error);
    }
  };

  return (
    <div className="app-buttons">
      <input ref={inputRef} type="file" accept=".bmp" style={{display: 'none'}} />

      <button className="button" onClick={openFilePicker}>
        <img className='small-icon' src="../../public/icons/add.svg" alt="New image" />
        New image
      </button> 

      <button className="button" onClick={saveImage}>
        <img className='small-icon' src="../../public/icons/export.svg" alt="Export image" />
        Export image
      </button> 
    </div>
  );
}

export default ActionButtons;
