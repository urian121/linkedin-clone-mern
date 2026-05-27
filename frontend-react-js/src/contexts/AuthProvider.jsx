import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, loginConGoogle, cerrarSesion } from '../conn/firebase'
import { AuthContext } from './authContext'

/* Provee el estado de sesión a toda la app. Escucha onAuthStateChanged
   para detectar la sesión persistente al recargar. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, loginConGoogle, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}
