import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Articles from './pages/Articles'
import Departments from './pages/Departments'
import About from './pages/About'



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/contacts" element={<div style={{padding: '4rem'}}>Contacts</div>} />
        <Route path="/about" element={<About />} />
        <Route path="/departments" element={<Departments />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App