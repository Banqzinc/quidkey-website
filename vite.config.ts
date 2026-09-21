/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import { cloudflare } from '@cloudflare/vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'

// The Cloudflare plugin starts a workerd runtime that conflicts with Vitest's
// node/jsdom runner ("module is not defined"). Exclude it under test — the unit
// tests exercise pure logic + components and don't need the Worker environment.
//
// TanStack Start is excluded under test as well: its SSR `noExternal` list makes
// Vitest inline `react` while react-dom still loads Node's copy, so rendering a
// component in jsdom fails with "Invalid hook call". Server functions are only
// defined, never invoked, in unit tests, so they need no compilation there.
const isVitest = process.env.VITEST === 'true'

const config = defineConfig({
  // The build day becomes WebPage.dateModified on every route (the sitemap's
  // lastmod for static routes is stamped the same way). An import.meta.env key
  // resolves in every Vite environment, including jsdom tests.
  define: { 'import.meta.env.VITE_BUILD_DATE': JSON.stringify(new Date().toISOString().slice(0, 10)) },
  // .claude/worktrees holds other checkouts of this repo; their tests must not run here.
  test: { exclude: [...configDefaults.exclude, '**/.claude/**'] },
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
    ...(isVitest ? [] : [tanstackStart()]),
    viteReact(),
  ],
})

export default config
