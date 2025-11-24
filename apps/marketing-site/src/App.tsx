import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MarketingLanding from './pages/MarketingLanding'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingLanding />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

