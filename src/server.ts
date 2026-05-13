import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import type { Register } from '@tanstack/react-router'
import type { RequestHandler } from '@tanstack/react-start/server'
import { registerAgentTypes } from './agents/runtime'

const registrationPromise = registerAgentTypes().catch((error) => {
  console.error('[agents] Failed to register entity types on startup', error)
})

const startFetch = createStartHandler(defaultStreamHandler)

export type ServerEntry = { fetch: RequestHandler<Register> }

export default {
  async fetch(...args) {
    await registrationPromise
    return startFetch(...args)
  },
} satisfies ServerEntry
