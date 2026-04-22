import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: false,
    outDir: 'dist/assets/js',
    target: 'es2020',
    terserOptions: {
      mangle: false, // 変数名の変更を無効にする
    },
    rollupOptions: {
      input: 'src/scripts/main.js',
      output: {
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      }
    },
    emptyOutDir: false,
  },
  publicDir: false
});
