/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Eloquence — Speaking Coach',
        short_name: 'Eloquence',
        description: 'Think clearly. Speak confidently.',
        theme_color: '#1f4d3a',
        background_color: '#f6f1e8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallback: '/index.html',
        // Never cache API calls: coaching must always be fresh and never served stale.
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
  server: {
    // Listen on the local network so you can open the dev server on your phone.
    host: true,
    // In development, forward /api to the FastAPI server so the app and API share one origin.
    proxy: { '/api': 'http://localhost:8000' },
  },
  test: {
    environment: 'node',
  },
})
