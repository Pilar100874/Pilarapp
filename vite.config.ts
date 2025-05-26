import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo_branco.png'],
      manifest: {
        name: 'Pilar Papéis',
        short_name: 'Pilar',
        description: 'Pilar Papéis - Sua solução em papéis',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'fullscreen',
        orientation: 'portrait',
        icons: [
          {
            src: 'logo_branco.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'logo_branco.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});