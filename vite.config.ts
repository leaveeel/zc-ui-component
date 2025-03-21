import { defineConfig, LibraryFormats } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    base: '/',
    build: {
      outDir: 'dist',
      lib: {
        formats: ['es', 'umd'] as LibraryFormats[],
        entry: resolve(__dirname, "src/packages/index.ts"),
        name: "zc-ui-component",
        fileName: (format: string) => `zc-ui-component.${format}.js`
      },
      rollupOptions: {
        external: ["vue"],
        output: {
          globals: {
            vue: "Vue",
          },
        },
      },
    },
    plugins: [
      vue(),
    ],
    server: {
      host: '0.0.0.0',
      port: 8888,
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: '/src'
        }
      ]
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      jsxInject: 'import { h } from \'vue\';'
    },
    css: {
      preprocessorOptions: {
        scss: {}
      }
    }
  };

  // 只在构建时注入 additionalData
  if (command === 'build') {
    config.css.preprocessorOptions.scss = {
      additionalData: `@use "@/style.scss";`
    };
  }

  return config;
})