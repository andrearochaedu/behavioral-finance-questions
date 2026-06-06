import { defineConfig } from 'vite'
import react from '@vitejs/react-refresh' // ou o seu framework

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Aumenta o limite para 1000 kB (1MB)
  },
})
