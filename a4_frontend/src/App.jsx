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
import Posts from './pages/admin/Posts'
import Members from './pages/admin/Members'
import AdminDepartments from './pages/admin/AdminDepartments'
import Accounts from './pages/admin/Accounts'
import AccountRequests from './pages/admin/AccountRequests'
import Devices from './pages/admin/Devices'
import NewPost from './pages/admin/NewPost'
import PostPreview from './pages/admin/PostPreview'
import NewMember from './pages/admin/NewMember'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext.jsx'
import EditPost from './pages/admin/EditPost'
import EditMember from './pages/admin/EditMember'
import DepartmentDetail from './pages/admin/DepartmentDetail'
import RegisterDevice from './pages/RegisterDevice'
import PostView from './pages/PostView'




function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles/:id" element={<PostView />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/about" element={<About />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/panou" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
            <Route index element={<Dashboard />} />
            <Route path="postari" element={<Posts />} />
            <Route path="postari/nou" element={<NewPost />} />
            <Route path="postari/preview" element={<PostPreview />} />
            <Route path="membri" element={<Members />} />
            <Route path="membri/nou" element={<NewMember />} />
            <Route path="departamente" element={<AdminDepartments />} />
            <Route path="conturi" element={<Accounts />} />
            <Route path="cereri" element={<AccountRequests />} />
            <Route path="dispozitive" element={<Devices />} />
            <Route path="postari/editeaza/:id" element={<EditPost />} />
            <Route path="membri/editeaza/:id" element={<EditMember />} />
            <Route path="departamente/:id" element={<DepartmentDetail />} />
          </Route>
          <Route path="/register-device" element={<RegisterDevice />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App