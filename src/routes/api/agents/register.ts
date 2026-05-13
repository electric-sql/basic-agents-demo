import { createFileRoute } from '@tanstack/react-router'
import { registerAgentTypes, runtime } from '../../../agents/runtime'

export const Route = createFileRoute('/api/agents/register')({
  server: {
    handlers: {
      GET: async () => {
        await registerAgentTypes()
        return Response.json({ registered: runtime.typeNames })
      },
      POST: async () => {
        await registerAgentTypes()
        return Response.json({ registered: runtime.typeNames })
      },
    },
  },
})
