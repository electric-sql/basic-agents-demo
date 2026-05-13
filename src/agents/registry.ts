import { createSpawnWorkerTool } from "@electric-ax/agents";
import {
  createEntityRegistry,
  type EntityRegistry,
} from "@electric-ax/agents-runtime";
import { Type } from "@sinclair/typebox";

export const registry: EntityRegistry = createEntityRegistry();

/*
registry.define('demo-agent', {
  description: 'A basic demo entity',

  async handler(ctx) {
    ctx.useAgent({
      systemPrompt: 'You are a concise, helpful demo agent.',
      model: process.env.ELECTRIC_AGENTS_MODEL!,
      tools: [...ctx.electricTools],
    })

    await ctx.agent.run()
  },
})
*/

/*
registry.define("demo-agent", {
  description: "A basic demo entity",

  async handler(ctx, wake) {
    ctx.spawn(
      `worker`,
      Math.random().toString(),
      { systemPrompt: `you're sassy and funny` },
      { initialMessage: `Roast this message: ${wake.payload}` },
    );

    ctx.useAgent({
      systemPrompt: "You are a concise, helpful demo agent.",
      model: process.env.ELECTRIC_AGENTS_MODEL!,
      tools: [...ctx.electricTools],
    });

    await ctx.agent.run();
  },
});
*/

registry.define("demo-agent", {
  description: "A basic demo entity",

  async handler(ctx) {
    const spawnWorkerTool = createSpawnWorkerTool(ctx);
    const spawnDebateDemoTool = {
      name: "spawnDebateDemo",
      label: "Spawn Debate Demo",
      description:
        "Spawn a judge worker that coordinates a two-sided debate and reports the result back here. Use this when the user asks agents to debate a topic.",
      parameters: Type.Object({
        topic: Type.String({
          description: "The topic the agents should debate.",
        }),
      }),
      execute: async (toolCallId: string, params: unknown) => {
        const { topic } = params as { topic: string };

        return spawnWorkerTool.execute(toolCallId, {
          systemPrompt:
            "You are a fair, concise judge coordinating a multi-agent debate.",
          tools: ["spawn_worker"],
          initialMessage: `Set up a good-vs-evil debate on this topic: ${topic}

Your job:
1. Spawn exactly two worker agents:
   - Good-side debater: argues the morally good/beneficial case.
   - Evil-side debater: argues the morally evil/harmful case.
2. Give each worker a clear brief with the debate topic and the side they must argue.
3. Ask each worker for a concise opening argument and their strongest three points.
4. End your turn after spawning them. When each worker finishes, wait until you have both responses.
5. Once both workers finish, compare their arguments fairly, summarize both sides, and provide your judge's verdict to the parent agent.

Do not argue either side yourself before the workers respond; use the workers to gather the two sides.`,
        });
      },
    };

    const model = process.env.ELECTRIC_AGENTS_MODEL;
    if (!model) {
      throw new Error("ELECTRIC_AGENTS_MODEL is required");
    }

    // biome-ignore lint/correctness/useHookAtTopLevel: Electric Agents exposes useAgent on the handler context; this is not a React hook.
    ctx.useAgent({
      systemPrompt:
        "You are a concise, helpful demo agent. When the user asks agents to debate a topic, call spawnDebateDemo with only the debate topic, then end your turn until the judge worker reports back.",
      model,
      tools: [...ctx.electricTools, spawnDebateDemoTool],
    });

    await ctx.agent.run();
  },
});
