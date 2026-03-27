import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Prevent Vite from obscuring Rust errors
  clearScreen: false,
  server: {
    // Tauri expects a fixed port
    port: 3042,
    strictPort: true,
    host: true,
    // Allow Tauri's custom protocol to connect
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
})
