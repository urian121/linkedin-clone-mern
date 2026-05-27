import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/auth/Login'
import MiRed from './pages/placeholders/MiRed'
import Empleos from './pages/placeholders/Empleos'
import Mensajeria from './pages/placeholders/Mensajeria'
import Notificaciones from './pages/placeholders/Notificaciones'

const protegida = (element) => <ProtectedRoute>{element}</ProtectedRoute>

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/"               element={protegida(<Home />)} />
        <Route path="/mi-red"         element={protegida(<MiRed />)} />
        <Route path="/empleos"        element={protegida(<Empleos />)} />
        <Route path="/mensajeria"     element={protegida(<Mensajeria />)} />
        <Route path="/notificaciones" element={protegida(<Notificaciones />)} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
