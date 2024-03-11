import SaturationIcon from "../assets/icons/saturation.svg";
import ContrastIcon from "../assets/icons/contrast.svg";
import BrightnessIcon from "../assets/icons/brightness.svg";
import { AdjustmentActions } from "../types/Actions";

export const adjustableArr = [
  {
    title: "Saturation",
    icon: SaturationIcon,
    description: "You can adjust saturation of the image here.",
    action: AdjustmentActions.SATURATION,
    min: -100,
    max: 100,
    defaultValue: 0,
    step: 1
  },
  {
    title: "Contrast",
    icon: ContrastIcon,
    description: "You can adjust contrast of the image here.",
    action: AdjustmentActions.CONTRAST,
    min: -100,
    max: 100,
    defaultValue: 0,
    step: 1
  },
  {
    title: "Brightness",
    icon: BrightnessIcon,
    description: "You can adjust brightness of the image here.",
    action: AdjustmentActions.BRIGHTNESS,
    min: -100,
    max: 100,
    defaultValue: 0,
    step: 1
  },
];