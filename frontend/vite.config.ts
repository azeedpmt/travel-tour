// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss(),],
//   test: {
//     globals: true,
//     environment: 'jsdom',
//   },
  
  
//   server: {
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:9000',
//         changeOrigin: true,
//       },
//       '/socket.io': {
//         target: 'http://localhost:8007',
//         ws: true,
//         changeOrigin: true,
//       },
//     },
//   },
// })


import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  test: {
    globals: true,
    environment: 'jsdom',
  },

  server: {
    port: 5173,

    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },

      '/socket.io': {
        target: 'http://localhost:8007',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
/// <reference types="vitest" />