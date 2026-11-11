import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json' with { type: 'json' }
import siteAppTools from './src/site-app-tools.json' with { type: 'json' }

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // The definitions of the assistant tools (window.__OPDS_APP__) next to the bundle, for OpenAEC SuperCloud.
    { name: 'mcp-tools', apply: 'build', generateBundle() { this.emitFile({ type: 'asset', fileName: 'mcp-tools.json', source: JSON.stringify(siteAppTools, null, 2) }) } },
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
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
