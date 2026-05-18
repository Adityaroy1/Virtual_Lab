import { useState } from 'react'
import LandingPage from './components/LandingPage.jsx'
import VirtualLab from './components/VirtualLab.jsx'

export default function App() {
  const [page, setPage] = useState('landing')
  const [initialSection, setInitialSection] = useState('Introduction')

  function handleEnter(section = 'Introduction') {
    setInitialSection(section)
    setPage('lab')
  }

  if (page === 'lab') {
    return (
      <VirtualLab
        initialSection={initialSection}
        onBack={() => setPage('landing')}
      />
    )
  }

  return <LandingPage onEnter={handleEnter} />
}