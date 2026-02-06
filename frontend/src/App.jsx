import { useState } from 'react'
import { Container } from '@mui/material'

// import './App.css'
import Home from "./pages/Home";


function App() {
  const [count, setCount] = useState(0)

  return (
    <Container maxWidth="md">
      <Home />
    </Container>
  )
}

export default App
