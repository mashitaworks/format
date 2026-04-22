import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'ignore',
  plugins: ['prettier-plugin-astro'],
  compressHTML: false,
  scopedStyleStrategy: "attribute",
  build: {
    inlineStylesheets: 'never',
    format: 'preserve'
  },
  integrations: [
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `
            @use "src/styles/imports/_mixins.scss" as *;
            @use "src/styles/imports/_variables.scss" as *;
          `
        }
      }
    },
    build: {
      cssMinify: false,
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          assetFileNames: assetInfo => {
            const fileName = assetInfo?.names;
            if (fileName && Array.isArray(fileName)) {
              const extType = fileName[0].split('.').at(-1);
              if (extType === 'css') {
                return 'assets/css/[name][extname]';
              }
            }
            return `assets/[name][extname]`;
          },
        },
      }
    }
  }
});