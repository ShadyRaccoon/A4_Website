import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Articles from './pages/Articles'
import Departments from './pages/Departments'
import About from './pages/About'
import Contacts from './pages/Contacts'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import DashboardLayout from './pages/admin/DashboardLayout'





function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/about" element={<About />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/panou" element={<DashboardLayout role="admin" />}>
          <Route index element={<Dashboard role="admin" />} />
          <Route path="postari" element={<div>Postări</div>} />
          <Route path="membri" element={<div>Membri</div>} />
          <Route path="departamente" element={<div>Departamente</div>} />
          <Route path="conturi" element={<div>Conturi</div>} />
          <Route path="cereri" element={<div>Cereri Cont</div>} />
          <Route path="dispozitive" element={<div>Dispozitive</div>} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App