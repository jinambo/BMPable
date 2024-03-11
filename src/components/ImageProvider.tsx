import { createContext, useEffect, useState } from "react";
import { ImageDataProps } from "../types/ImageDataProps";
import { GlobalMessageProps } from "../types/GlobalMessageProps";

export const ImageContext = createContext(null);

const ImageProvider = ({ children }) => {
  const [imageData, setImageData] = useState<ImageDataProps | null>(null);
  const [previewImageData, setPreviewImageData] = useState<ImageDataProps | null>(null);
  const [globalMessage, setGlobalMessage] = useState<GlobalMessageProps | null>(null);

  const applyChanges = () => {
    if (previewImageData) {
      setImageData(previewImageData);
      setPreviewImageData(null);
    }
  };

  const discardChanges = () => {
    setPreviewImageData(null);
  }

  useEffect(() => {
    if (globalMessage) {
      setTimeout(() => setGlobalMessage(null), 4000);
    }
  }, [globalMessage]);

  return (
    <ImageContext.Provider value={{
      imageData,
      previewImageData,
      globalMessage,
      setImageData,
      setPreviewImageData,
      setGlobalMessage,
      applyChanges,
      discardChanges
    }}>
      { children }
    </ImageContext.Provider>
  );
};
export default ImageProvider;