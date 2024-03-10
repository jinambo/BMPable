import './App.css'

import ImageCanvas from './ImageCanvas'
import ActionButtons from './components/ActionButtons'
import Toolbar from './components/Toolbar'

function App() {
  return (
    <div className='app-container'>
      <Toolbar />
      <ImageCanvas />
      <ActionButtons />
    </div>
  )
}

export default App
