import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins:[
        react(),
        visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true,
        }),
    ],
    assetsInclude: ['**/*.docx', '**/*.xlsx'],
    server: {
        port: 3000
    }
})