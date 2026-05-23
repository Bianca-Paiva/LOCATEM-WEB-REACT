import { useState } from 'react'
import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'

export default function App() {
  const [route, setRoute] = useState('login')
  const navigate = (nextRoute: string) => setRoute(nextRoute)

  // Login and Cadastro have their own minimal header (logo only)
  if (route === 'login') return <Login navigate={navigate} />
  if (route === 'cadastro') return <Cadastro navigate={navigate} />

  return null
}
