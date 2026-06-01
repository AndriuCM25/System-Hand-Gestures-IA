import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Asegurar que Three.js solo se instancie una vez
  resolve: {
    dedupe: ['three', 'react', 'react-dom'],
    alias: {
      'three': path.resolve('./node_modules/three'),
    }
  },

  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react-is')) return 'react-vendor';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('three') || id.includes('@react-three') || id.includes('@splinetool')) {
              return 'three-vendor';
            }
            if (id.includes('recharts')) {
              return 'charts-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-is',
      'framer-motion',
      'recharts',
      '@splinetool/runtime',
      '@splinetool/react-spline',
      '@teachablemachine/image'
    ],
    exclude: [
      '@mediapipe/hands',
    ]
  },

  server: {
    hmr: {
      overlay: false
    },
    port: 5173,
    strictPort: false,
    // Suprimir warnings de preload de CDN externos
    headers: {
      'Cache-Control': 'no-cache'
    }
  }
})
