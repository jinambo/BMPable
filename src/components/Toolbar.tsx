import { useContext, useEffect, useState } from "react";
import { ImageContext } from "./ImageProvider";
import ToolbarItem from "./atoms/ToolbarItem";
import Toggle from "./atoms/Toggle";
import RangeInput from "./atoms/InputRange";
import PositioningItem from "./atoms/PositioningItem";
import ApplyButtons from "./atoms/ApplyButtons";
const { ipcRenderer } = window.electron;
import { AdjustmentActions, PositionActions } from "../types/Actions";
import { adjustableArr } from "../constants/adjustableArr";

import InvertIcon from "../assets/icons/invert.svg";
import RotateIcon from "../assets/icons/rotate.svg";
import FlipVerticalIcon from "../assets/icons/flip-vertical.svg";
import FlipHorizontalIcon from "../assets/icons/flip-horizontal.svg";
import bmpabloImage from '../assets/bmpablo.png';


interface AdjustableValuesProps {
  'adjust-image-saturation': number;
  'adjust-image-contrast': number;
  'adjust-image-brightness': number;
}

interface PositioningValuesProps {
  'flip-image-vertical': boolean;
  'flip-image-horizontal': boolean;
}

const Toolbar: React.FC = () => {
  const {
    imageData,
    setImageData,
    previewImageData,
    setPreviewImageData,
  } = useContext(ImageContext);
  const [inverted, setInverted] = useState<boolean>(null);
  const [rotationCount, setRotationCount] = useState<number>(0);
  const [adjustableValues, setAdjustableValues] = useState<AdjustableValuesProps>({
    'adjust-image-saturation': 0,
    'adjust-image-contrast': 0,
    'adjust-image-brightness': 0
  });
  const [positioningValues, setPositioningValues] = useState<PositioningValuesProps>({
    'flip-image-vertical': false,
    'flip-image-horizontal': false
  });

  // Handler for positioning actions
  const handlePositioning = async (action: PositionActions) => {
    if (!imageData) return;

    const updatedData = await ipcRenderer.invoke(action, imageData);
    setImageData(updatedData);

    // Update state with positioning values (vertical and horizontal flip) and rotation count
    if (action === PositionActions.ROTATE) {
      setRotationCount(rotationCount + 1);
    } else {
      setPositioningValues({...positioningValues, [action]: !positioningValues[action]});
    }
  }

  // Handler for filter adjusting actions
  const handleAdjustChange = async (value: number, action: AdjustmentActions) => {
    if (!imageData) return;
    if (!previewImageData) setPreviewImageData(imageData);

    // Apply filter on current pixels
    // TODO: update this recalculation
    let val = value / 10;
    if (action === AdjustmentActions.BRIGHTNESS) {
      val = value / 100;
    }
    
    const adjustedData = await ipcRenderer.invoke(action, imageData, val);

    // Update preview image with adjusted pixels
    setPreviewImageData(adjustedData);

    // Update state with adjusted values
    setAdjustableValues({...adjustableValues, [action]: value});
  }

  // UseEffect to handle color inversion
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
        <img className="toolbar-logo__image" src={bmpabloImage} alt="BMPablo" />
        <div className='toolbar-logo__title'>
          <h3>BMPablo</h3>
          <small>Simple BMP editor</small>
        </div>
      </div>
      
      <div className="toolbar-positioning flex-middle">
        <PositioningItem
          onClick={() => handlePositioning(PositionActions.FLIP_HORIZONTAL)}
          isActive={positioningValues[PositionActions.FLIP_HORIZONTAL]}
          Icon={FlipHorizontalIcon}
        />
        <PositioningItem
          onClick={() => handlePositioning(PositionActions.FLIP_VERTICAL)}
          isActive={positioningValues[PositionActions.FLIP_VERTICAL]}
          Icon={FlipVerticalIcon}
        />
        <PositioningItem
          onClick={() => handlePositioning(PositionActions.ROTATE)}
          Icon={RotateIcon}
          rotatedTimes={rotationCount}
          isActive={rotationCount % 4 !== 0}
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
            disabled={!imageData}
          />
        </ToolbarItem>

        { adjustableArr.map(({ title, icon: Icon, description, action, min, max, defaultValue, step }) => (
          <ToolbarItem
            key={action}
            title={title}
            Icon={Icon}
          >
            <h6>{`Adjust ${title.toLowerCase()}`}</h6>
            <small>{description}</small>
            <RangeInput
              min={min}
              max={max}
              initialValue={adjustableValues[action]}
              step={step}
              onChange={(value) => handleAdjustChange(value, action)}
              disabled={!imageData}
            />
            <ApplyButtons
              onDiscard={() => setAdjustableValues({...adjustableValues, [action]: defaultValue})}
              disabled={!imageData}
            />
          </ToolbarItem>
        ))}
      </ul>
    </nav>
  );
}

export default Toolbar;
