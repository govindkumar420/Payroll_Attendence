import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Exposes the dev server to your local network (Wi-Fi / LAN) for mobile devices
    port: 5173
  }
})
