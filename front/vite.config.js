import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: true,
    proxy: {
     '/api': 'http://localhost:3000',
    //'/api': 'https://7mdsfj35-3000.brs.devtunnels.ms',
    },
       
  },
})