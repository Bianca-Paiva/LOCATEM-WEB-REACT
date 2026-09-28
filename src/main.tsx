/**
 * Ponto de entrada da aplicação React.
 * Monta o App dentro do StrictMode e carrega os estilos globais.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
