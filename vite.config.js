import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Documentacion/ no es parte de la app: se excluye del watcher para evitar
// que archivos bloqueados ahí (p. ej. .rar abiertos por otro proceso) tumben el dev server.
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/Documentacion/**'],
    },
  },
})
