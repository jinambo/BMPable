import { useContext, useEffect, useState } from "react";
import { ImageContext } from "./ImageProvider";
import ToolbarItem from "./atoms/ToolbarItem";
import Toggle from "./atoms/Toggle";
import RangeInput from "./atoms/InputRange";
import PositioningItem from "./atoms/PositioningItem";
import ApplyButtons from "./atoms/ApplyButtons";
const { ipcRenderer } = window.electron;

import InvertIcon from "../../public/icons/invert.svg";
import SaturationIcon from "../../public/icons/saturation.svg";
import RotateIcon from "../../public/icons/rotate.svg";
import FlipVerticalIcon from "../../public/icons/flip-vertical.svg";
import FlipHorizontalIcon from "../../public/icons/flip-horizontal.svg";
import ContrastIcon from "../../public/icons/contrast.svg";
import BrightnessIcon from "../../public/icons/brightness.svg";

enum AdjustmentActions {
  SATURATION = 'adjust-image-saturation',
  CONTRAST = 'adjust-image-contrast',
  BRIGHTNESS = 'adjust-image-brightness',
}

enum PositionActions {
  ROTATE = 'rotate-image-90',
  FLIP_VERTICAL = 'flip-image-vertical',
  FLIP_HORIZONTAL = 'flip-image-horizontal'
}

const Toolbar: React.FC = () => {
  const {
    imageData,
    setImageData,
    previewImageData,
    setPreviewImageData,
  } = useContext(ImageContext);
  const [inverted, setInverted] = useState<boolean>(null);

  const handlePositioning = async (action: PositionActions) => {
    if (!imageData) return;

    const updatedData = await ipcRenderer.invoke(action, imageData);
    setImageData(updatedData);
  }

  const handleAdjustChange = async (value: number, action: AdjustmentActions) => {
    if (!imageData) return;
    if (!previewImageData) setPreviewImageData(imageData);

    const adjustedData = await ipcRenderer.invoke(action, imageData, value / 100);
    setPreviewImageData(adjustedData);
  }

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
        <PositioningItem
          onClick={() => handlePositioning(PositionActions.FLIP_HORIZONTAL)}
          Icon={FlipHorizontalIcon}
        />
        <PositioningItem
          onClick={() => handlePositioning(PositionActions.FLIP_VERTICAL)}
          Icon={FlipVerticalIcon}
        />
        <PositioningItem
          onClick={() => handlePositioning(PositionActions.ROTATE)}
          Icon={RotateIcon}
        />
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
          <h6>Adjust saturation</h6>
          <small>You can adjust saturation of the image here.</small>
          <RangeInput
            min={0}
            max={500}
            initialValue={100}
            step={1}
            onChange={(value) => handleAdjustChange(value, AdjustmentActions.SATURATION)}
          />
          <ApplyButtons />
        </ToolbarItem>

        <ToolbarItem
          title="Contrast"
          Icon={ContrastIcon}
        >
          <h6>Adjust contrast</h6>
          <small>You can adjust contrast of the image here.</small>
          <RangeInput
            min={0}
            max={200}
            initialValue={100}
            step={1}
            onChange={(value) => handleAdjustChange(value, AdjustmentActions.CONTRAST)}
          />
          <ApplyButtons />
        </ToolbarItem>

        <ToolbarItem
          title="Brightness"
          Icon={BrightnessIcon}
        >
          <h6>Adjust brightness</h6>
          <small>You can adjust brightness of the image here.</small>
          <RangeInput
            min={-100}
            max={100}
            initialValue={0}
            step={1}
            onChange={(value) => handleAdjustChange(value, AdjustmentActions.BRIGHTNESS)}
          />
          <ApplyButtons />
        </ToolbarItem>
      </ul>
    </nav>
  );
}

export default Toolbar;
