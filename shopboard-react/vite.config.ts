import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // "@/" points at src/, as the shadcn/ui components expect.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
