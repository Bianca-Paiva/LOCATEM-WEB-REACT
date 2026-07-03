import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { reactClickToComponent } from 'vite-plugin-react-click-to-component'

export default defineConfig({
  plugins: [
    react(),
    reactClickToComponent() // Adicione esta linha!
  ],
})