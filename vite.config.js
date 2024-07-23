import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/LegalBizAI_frontend/', // Đảm bảo rằng base path này đúng
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    server: {
        host: true, // Allow Vite to listen on 0.0.0.0
        port: 3000, // Ensure Vite listens on port 3000
    },
});
