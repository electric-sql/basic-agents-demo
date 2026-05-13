import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function startAgentsRuntimeOnPreview(): Plugin {
  return {
    name: 'start-agents-runtime-on-preview',
    apply: 'serve',
    configurePreviewServer() {
      void import(pathToFileURL(resolve('dist/server/server.js')).href)
        .catch((error) => {
          console.error('[agents] Failed to register runtime during preview', error)
        })
    },
  }
}

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    startAgentsRuntimeOnPreview(),
    viteReact(),
  ],
})

export default config
