import { createContext, useEffect, useState } from "react";
import { ImageDataProps } from "../types/ImageDataProps";
import { ImageSettingsProps } from "../types/ImageSettingsProps";

export const ImageContext = createContext(null);

const ImageProvider = ({ children }) => {
  const [imageData, setImageData] = useState<ImageDataProps | null>(null);
  // const [imageSettings, setImageSettings] = useState<ImageSettingsProps | null>(null);
  const [previewImageData, setPreviewImageData] = useState<ImageDataProps | null>(null);

  const applyChanges = () => {
    if (previewImageData) {
      setImageData(previewImageData);
      setPreviewImageData(null);
    }
  };

  const discardChanges = () => {
    setPreviewImageData(null);
  }

  return (
    <ImageContext.Provider value={{
      imageData,
      previewImageData,
      setImageData,
      setPreviewImageData,
      applyChanges,
      discardChanges
    }}>
      { children }
    </ImageContext.Provider>
  );
};
export default ImageProvider;