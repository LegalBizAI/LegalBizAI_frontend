// https://vitejs.dev/config/
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import 'dotenv/config';

console.log(process.env.VITE_REPO_NAME);

export default defineConfig({
    base: process.env.VITE_REPO_NAME ? `/${process.env.VITE_REPO_NAME}/` : '/', // Đảm bảo rằng base path này đúng
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
