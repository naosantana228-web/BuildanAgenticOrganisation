import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { AGENT_DEFINITIONS } from "./agents/definitions";
import { executePipeline } from "./agents/pipelineService";
import { createPipelineRun, getPipelineRunWithArtifacts, getRecentPipelineRuns } from "./pipelineDb";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  agents: router({
    list: publicProcedure.query(() => AGENT_DEFINITIONS),
  }),

  pipeline: router({
    recent: publicProcedure.query(() => getRecentPipelineRuns()),
    get: publicProcedure.input(z.object({ runId: z.string().min(1) })).query(({ input }) => getPipelineRunWithArtifacts(input.runId)),
    create: publicProcedure.input(z.object({
      objective: z.string().trim().min(20).max(800),
    })).mutation(({ input }) => createPipelineRun(input.objective)),
    execute: publicProcedure.input(z.object({ runId: z.string().min(1) })).mutation(({ input }) => executePipeline(input.runId)),
  }),
});

export type AppRouter = typeof appRouter;
