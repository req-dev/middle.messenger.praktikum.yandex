import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        target: 'es2020',
        outDir: 'dist',
        sourcemap: false,
    },
});
