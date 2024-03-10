import { useContext } from "react";
import { ImageContext } from "./ImageProvider";
import ToolbarItem from "./atoms/ToolbarItem";
const { ipcRenderer } = window.electron;

const Toolbar: React.FC = () => {
  const { imageData, setImageData } = useContext(ImageContext);

  const invertColors = async () => {
    if (!imageData) return;
    const invertedData = await ipcRenderer.invoke('invert-image-colors', imageData);
    setImageData(invertedData);
  };

  return (
    <nav className='app-toolbar'>
      <h2 className='toolbar-title'>Toolbar</h2>
      
      <ul className='toolbar-menu'>
        <ToolbarItem
          title="Invert colors"
          img="../public/icons/invert.svg"
          action={invertColors}
        ></ToolbarItem>

        <ToolbarItem
          title="Saturation"
          img="../public/icons/saturation.svg"
          action={invertColors}
        ></ToolbarItem>

        <ToolbarItem
          title="Rotate"
          img="../public/icons/rotate.svg"
          action={invertColors}
        ></ToolbarItem>
      </ul>
    </nav>
  );
}

export default Toolbar;
