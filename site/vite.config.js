/* eslint-env node */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: ["**/icon-layers.svg?react", "**/icon-refresh.svg?react", "**/icon-bug.svg?react", "**/icon-indent.svg?react", "**/icon-info.svg?react"],
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['../../'],
    },
  },
  base: process.env.BASE_ARIA_URL
})
