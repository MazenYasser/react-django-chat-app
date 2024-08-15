import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/auth/login/Login"
import SignUp from "./pages/auth/signup/SignUp"
import Home from "./pages/home/Home"
import { AuthProvider } from "./context/AuthContext"
import Toaster from "./components/Toaster/Toaster"

function App() {
  return (
    
    <BrowserRouter>
    <AuthProvider>
      <Toaster />
      <Routes>
      
      <Route path='/home' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<SignUp/>} />
      
      </Routes>
      </AuthProvider>

    </BrowserRouter>
    
  )
}

export default App
