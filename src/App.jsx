import { useState } from 'react'
import LandingPage from './components/LandingPage.jsx'
import VirtualLab from './components/VirtualLab.jsx'

export default function App() {
  const [page, setPage] = useState('landing')

  if (page === 'lab') {
    return <VirtualLab onBack={() => setPage('landing')} />
  }

  return <LandingPage onEnter={() => setPage('lab')} />
}
