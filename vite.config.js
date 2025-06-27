import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    solid(),
    tailwindcss(),
    {
      name: 'html-transform',
      generateBundle(options, bundle) {
        // Move HTML files to root
        Object.keys(bundle).forEach(fileName => {
          if (fileName.includes('/') && fileName.endsWith('.html')) {
            const newFileName = fileName.split('/').pop();
            bundle[newFileName] = bundle[fileName];
            delete bundle[fileName];
          }
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.html'),
        options: resolve(__dirname, 'src/options/options.html'),
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: 'public',
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
});
