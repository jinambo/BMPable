import { useState } from 'react'
import './App.css'

import ImageCanvas from './ImageCanvas'
import ActionButtons from './components/ActionButtons'
import Toolbar from './components/Toolbar'

function App() {
  const [toggleLightMode, setToggleLightMode] = useState<boolean>(false);

  return (
    <div className={`app-container ${ toggleLightMode && 'light-scheme' }`}>

      <div className="app-scheme-toggle">
        <label className="switch">
          <input type="checkbox" onChange={ () => setToggleLightMode(!toggleLightMode)} />
          <span className="slider round"></span>
        </label>
      </div>

      <Toolbar />
      <ImageCanvas />
      <ActionButtons />
    </div>
  )
}

export default App
