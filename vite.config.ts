import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'INVALID_ANNOTATION' && warning.id?.includes('node_modules/zod/')) return
        warn(warning)
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@supabase/')) return 'vendor-supabase'
          if (id.includes('node_modules/zod/')) return 'vendor-zod'
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'vendor-react'
        },
      },
    },
  },
})
