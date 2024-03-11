import { useContext, useState } from 'react'
import './App.css'

import { ImageContext } from './components/ImageProvider'
import ImageCanvas from './ImageCanvas'
import ActionButtons from './components/ActionButtons'
import Toolbar from './components/Toolbar'
import Toggle from './components/atoms/Toggle'
import GlobalMessage from './components/atoms/GlobalMessage'

function App() {
  const [toggleLightMode, setToggleLightMode] = useState<boolean>(false);
  const {globalMessage} = useContext(ImageContext);

  return (
    <div className={`app-container ${ toggleLightMode && 'light-scheme' }`}>
      <Toggle
        state={ toggleLightMode }
        toggle={ setToggleLightMode }
        style={{
          'position': 'absolute',
          'top': '1rem',
          'right': '1rem',
        }}
        isBAW
      />

      { globalMessage && 
        <GlobalMessage
          text={globalMessage.text}
          type={globalMessage.type}
        />
      }

      <Toolbar />
      <ImageCanvas />
      <ActionButtons />
    </div>
  )
}

export default App
