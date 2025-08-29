import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Security headers for development
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  build: {
    // Security optimizations
    target: 'es2022',
    minify: 'esbuild', // Use esbuild instead of terser
    rollupOptions: {
      output: {
        // Remove console.log in production via esbuild
        manualChunks: undefined
      }
    }
  },
  esbuild: {
    // Remove console.log in production
    drop: process.env.NODE_ENV === 'production' ? ['console'] : []
  }
})
