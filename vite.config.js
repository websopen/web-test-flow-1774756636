import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // Local development proxy to VPS OMNI Server
            '/api/messaging': {
                target: 'http://207.180.243.41:8080/api/v1/messaging',
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/api\/messaging/, ''); },
            }
        }
    }
});
