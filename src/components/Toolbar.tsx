import { useContext, useEffect, useState } from "react";
import { ImageContext } from "./ImageProvider";
import ToolbarItem from "./atoms/ToolbarItem";
import Toggle from "./atoms/Toggle";
import RangeInput from "./atoms/InputRange";
const { ipcRenderer } = window.electron;

import InvertIcon from "../../public/icons/invert.svg";
import SaturationIcon from "../../public/icons/saturation.svg";
import RotateIcon from "../../public/icons/rotate.svg";
import FlipVerticalIcon from "../../public/icons/flip-vertical.svg";
import FlipHorizontalIcon from "../../public/icons/flip-horizontal.svg";
import PositioningItem from "./atoms/PositioningItem";

const Toolbar: React.FC = () => {
  const {imageData, setImageData} = useContext(ImageContext);
  const [inverted, setInverted] = useState<boolean>(null);

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

  const handleSaturationChange = async (value: number) => {
    if (!imageData) return;
    const saturedData = await ipcRenderer.invoke('adjust-image-saturation', imageData, value);
    setImageData(saturedData);
  };

  useEffect(() => {
    const triggerInvertion = async () => {
      if (!imageData) return;
      const invertedData = await ipcRenderer.invoke('invert-image-colors', imageData);
      setImageData(invertedData);       
    }

    if (inverted !== null) triggerInvertion();
  }, [inverted]);

  return (
    <nav className='app-toolbar'>

      <div className="toolbar-logo">
        <img className="toolbar-logo__image" src="../../public/bmpablo.png" alt="" />
        <div className='toolbar-logo__title'>
          <h3>BMPablo</h3>
          <small>Simple BMP editor</small>
        </div>
      </div>
      
      <div className="toolbar-positioning flex-middle">
        <PositioningItem onClick={handleFlipHorizontal} Icon={FlipHorizontalIcon} />
        <PositioningItem onClick={handleFlipVertical} Icon={FlipVerticalIcon} />
        <PositioningItem onClick={handleRotation} Icon={RotateIcon} />
      </div>

      <ul className='toolbar-menu'>
        <ToolbarItem
          title="Invert colors"
          Icon={InvertIcon}
        >
          <h6>Invert colors</h6>
          <small>You can toggle image's color here</small>

          <Toggle
            style={{'marginTop': '0.5rem'}}
            state={inverted}
            toggle={setInverted}
          />
        </ToolbarItem>

        <ToolbarItem
          title="Saturation"
          Icon={SaturationIcon}
        >
          <h6>Apply saturation</h6>
          <small>You can adjust saturation of the image here.</small>

          <RangeInput
            min={0}
            max={200}
            initialValue={100}
            step={1}
            onChange={handleSaturationChange}
          />
        </ToolbarItem>
      </ul>
    </nav>
  );
}

export default Toolbar;
