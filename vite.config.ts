/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // node_modules 裡的套件
          if (id.includes('node_modules')) {
            // React 核心相關 - 最常用,單獨分割
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }

            // React Router - 路由相關
            if (id.includes('react-router')) {
              return 'router';
            }

            // Mantine UI 框架 - 體積較大,單獨分割
            if (id.includes('@mantine/core')) {
              return 'mantine-core';
            }

            // Mantine 其他套件 - hooks, form, notifications
            if (id.includes('@mantine')) {
              return 'mantine-others';
            }

            // Tabler Icons - icon 套件通常較大
            if (id.includes('@tabler/icons-react')) {
              return 'icons';
            }

            // Zustand - 狀態管理
            if (id.includes('zustand')) {
              return 'zustand';
            }

            // 其他 node_modules 的套件統一放在 vendor
            return 'vendor';
          }

          // 你的程式碼 - 按功能模組分割
          // Features - 電影相關功能模組
          if (id.includes('/features/movies/')) {
            return 'features-movies';
          }

          // Features - watchlist 功能模組
          if (id.includes('/features/watchlist/')) {
            return 'features-watchlist';
          }

          // Components - 共用元件
          if (id.includes('/components/')) {
            return 'components';
          }

          // API & Adapters - API 相關邏輯
          if (id.includes('/lib/api/') || id.includes('/lib/adapters/')) {
            return 'api';
          }

          // Hooks - 共用 hooks
          if (id.includes('/hooks/')) {
            return 'hooks';
          }
        },
      },
    },
  },
  test: {},
});
