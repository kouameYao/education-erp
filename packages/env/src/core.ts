import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Variables d'env communes à tous les services / packages Node.
 * Étendre via `createEnv` dans chaque package qui a des vars supplémentaires.
 */
export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
    LOG_PRETTY: z
      .string()
      .optional()
      .transform((v) => v === "true"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export type Env = typeof env;
