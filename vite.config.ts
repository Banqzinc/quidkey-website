import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'

// The Cloudflare plugin starts a workerd runtime that conflicts with Vitest's
// node/jsdom runner ("module is not defined"). Exclude it under test — the unit
// tests exercise pure logic + components and don't need the Worker environment.
const isVitest = process.env.VITEST === 'true'

const config = defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    // cloudflare() must come before tanstackStart() so the Workers (SSR) Vite
    // environment is registered before TanStack Start wires its server entry.
    ...(isVitest ? [] : [cloudflare({ viteEnvironment: { name: 'ssr' } })]),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
