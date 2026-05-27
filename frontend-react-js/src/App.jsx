import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import MiRed from './pages/placeholders/MiRed'
import Empleos from './pages/placeholders/Empleos'
import Mensajeria from './pages/placeholders/Mensajeria'
import Notificaciones from './pages/placeholders/Notificaciones'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mi-red" element={<MiRed />} />
      <Route path="/empleos" element={<Empleos />} />
      <Route path="/mensajeria" element={<Mensajeria />} />
      <Route path="/notificaciones" element={<Notificaciones />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
