// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'unsafe-none', // More permissive
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    }
  }
})