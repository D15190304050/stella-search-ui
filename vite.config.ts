import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    envDir: "./env",
    plugins: [react()],
    server: {
        host: '127.0.0.1',
        port: 3300,
        open: false,
        cors: true,
        proxy:
            {
                "/api":
                    {
                        target: "http://localhost:19332",
                        changeOrigin: true,
                        rewrite: (path) => path.replace(/^\/api/, '')
                    }
            }
    }
})
