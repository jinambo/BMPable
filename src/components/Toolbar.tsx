import { useContext } from "react";
import { ImageContext } from "./ImageProvider";
import ToolbarItem from "./atoms/ToolbarItem";
const { ipcRenderer } = window.electron;

import InvertIcon from "../../public/icons/invert.svg";
import SaturationIcon from "../../public/icons/saturation.svg";
import RotateIcon from "../../public/icons/rotate.svg";


const Toolbar: React.FC = () => {
  const { imageData, setImageData } = useContext(ImageContext);

  const invertColors = async () => {
    if (!imageData) return;
    const invertedData = await ipcRenderer.invoke('invert-image-colors', imageData);
    setImageData(invertedData);
  };

  const handleSaturation = async () => {
    if (!imageData) return;
    const saturedData = await ipcRenderer.invoke('adjust-image-saturation', imageData, 1.5);
    setImageData(saturedData);
  }

  const handleRotation = async () => {
    if (!imageData) return;
    const rotatedData = await ipcRenderer.invoke('rotate-image-90', imageData);
    setImageData(rotatedData);
  }

  const handleFlipVertical = async () => {
    if (!imageData) return;
    const rotatedData = await ipcRenderer.invoke('flip-image-vertical', imageData);
    setImageData(rotatedData); 
  }

  const handleFlipHorizontal = async () => {
    if (!imageData) return;
    const rotatedData = await ipcRenderer.invoke('flip-image-horizontal', imageData);
    setImageData(rotatedData); 
  }

  return (
    <nav className='app-toolbar'>

      <div className="toolbar-logo">
        <img className="toolbar-logo__image" src="../../public/bmpablo.png" alt="" />
        <div className='toolbar-logo__title'>
          <h3>BMPablo</h3>
          <small>Simple BMP editor</small>
        </div>
      </div>
      
      <ul className='toolbar-menu'>
        <ToolbarItem
          title="Invert colors"
          Icon={InvertIcon}
          action={invertColors}
        ></ToolbarItem>

        <ToolbarItem
          title="Saturation"
          Icon={SaturationIcon}
          action={handleSaturation}
        ></ToolbarItem>

        <ToolbarItem
          title="Rotate"
          Icon={RotateIcon}
          action={handleRotation}
        ></ToolbarItem>

        <ToolbarItem
          title="Flip vertical"
          Icon={RotateIcon}
          action={handleFlipVertical}
        ></ToolbarItem>

        <ToolbarItem
          title="Flip horizontal"
          Icon={RotateIcon}
          action={handleFlipHorizontal}
        ></ToolbarItem>
      </ul>
    </nav>
  );
}

export default Toolbar;
