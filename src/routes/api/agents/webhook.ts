import { createFileRoute } from '@tanstack/react-router'
import { runtime } from '../../../agents/runtime'

export const Route = createFileRoute('/api/agents/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => runtime.handleWebhookRequest(request),
    },
  },
})
