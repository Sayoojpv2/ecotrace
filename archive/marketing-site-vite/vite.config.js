import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                forRecyclers: resolve(__dirname, 'for-recyclers.html'),
                forAgencies: resolve(__dirname, 'for-agencies.html'),
                howItWorks: resolve(__dirname, 'how-it-works.html'),
                features: resolve(__dirname, 'features.html'),
                knowledge: resolve(__dirname, 'knowledge.html'),
                contact: resolve(__dirname, 'contact.html')
            }
        }
    }
})
