import { createRuntimeHandler } from '@electric-ax/agents-runtime'
import { registry } from './registry.ts'

const ELECTRIC_AGENTS_URL =
  process.env.ELECTRIC_AGENTS_URL ?? 'http://localhost:4437'
const PORT = Number(process.env.PORT ?? 3000)
const SERVE_URL = process.env.SERVE_URL ?? `http://localhost:${PORT}`

export const runtime = createRuntimeHandler({
  baseUrl: ELECTRIC_AGENTS_URL,
  serveEndpoint: `${SERVE_URL}/api/agents/webhook`,
  webhookPath: '/api/agents/webhook',
  registry,
  name: 'basic-agents-demo',
  publicUrl: SERVE_URL,
})

let registrationPromise: Promise<void> | undefined

export function registerAgentTypes() {
  registrationPromise ??= runtime.registerTypes()
  return registrationPromise
}
