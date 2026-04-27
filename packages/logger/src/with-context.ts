import { baseLogger, createLoggerAdapter } from "./instance.js";

/**
 * Create a child logger that prefixes every message with `[context]`.
 *
 * @example
 * const log = createLoggerWithContext("auth");
 * log.info("User signed in", { userId: 123 });
 */
export function createLoggerWithContext(context: string) {
  const childLogger = baseLogger.child({ context });
  return createLoggerAdapter(childLogger, context);
}
