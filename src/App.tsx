import { useState } from 'react'
import './App.css'

import ImageCanvas from './ImageCanvas'
import ActionButtons from './components/ActionButtons'
import Toolbar from './components/Toolbar'
import Toggle from './components/atoms/Toggle'

function App() {
  const [toggleLightMode, setToggleLightMode] = useState<boolean>(false);

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
      <Toolbar />
      <ImageCanvas />
      <ActionButtons />
    </div>
  )
}

export default App
