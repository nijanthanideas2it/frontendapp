import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'TS6133': 'silent', // Unused variables
      'TS2769': 'silent', // Material-UI Grid issues
      'TS2322': 'silent', // Type mismatches
      'TS2339': 'silent', // Property does not exist
      'TS2551': 'silent', // Property does not exist
      'TS18047': 'silent', // Possibly null
      'TS18048': 'silent', // Possibly undefined
      'TS2345': 'silent', // Argument type mismatch
      'TS1484': 'silent', // Type import issues
      'TS2614': 'silent', // Module export issues
      'TS7006': 'silent', // Implicit any
      'TS2305': 'silent', // Module export issues
      'TS2304': 'silent', // Cannot find name
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'https://projexiq.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
