import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './certificates/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, './certificates/server.crt')),
    },
  },
})
