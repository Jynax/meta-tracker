import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@xyflow/react/dist/style.css',
        replacement: fileURLToPath(new URL('./src/lib/xyflow-style.css', import.meta.url)),
      },
      { find: '@xyflow/react', replacement: fileURLToPath(new URL('./src/lib/xyflow-react.tsx', import.meta.url)) },
    ],
  },
});
