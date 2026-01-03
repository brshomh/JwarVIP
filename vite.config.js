import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// هذا التكوين البسيط يعمل دائماً
export default defineConfig({
  plugins: [react()],
  // جرب تغيير هذا بين '/' و './'
  base: './',
  build: {
    outDir: 'dist'
  }
})
