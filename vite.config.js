import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Use a barra "/" e não o ponto "."

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
})