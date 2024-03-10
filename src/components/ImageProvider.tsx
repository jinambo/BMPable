import { createContext, useEffect, useState } from "react";
import { ImageDataProps } from "../types/ImageDataProps";
import { ImageSettingsProps } from "../types/ImageSettingsProps";

export const ImageContext = createContext(null);

const ImageProvider = ({ children }) => {
  const [imageData, setImageData] = useState<ImageDataProps | null>(null);
  const [imageSettings, setImageSettings] = useState<ImageSettingsProps | null>(null);

  return (
    <ImageContext.Provider value={{
      imageData,
      imageSettings,
      setImageData,
      setImageSettings
    }}>
      { children }
    </ImageContext.Provider>
  );
};
export default ImageProvider;