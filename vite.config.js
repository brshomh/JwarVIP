import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // هذه الإعدادات ضرورية لـ Vercel
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      },
      // هذا يحل مشكلة الخطأ external
      external: []
    }
  },
  // هذا يحل مشكلة استيراد المسارات
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
