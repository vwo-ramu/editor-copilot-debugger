import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 700
  },
  plugins: [react()],
  base: '/editor-copilot-debugger/'
})
