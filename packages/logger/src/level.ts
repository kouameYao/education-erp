import { baseLogger } from "./instance.js";

/**
 * Change the log level at runtime. Affects every existing child logger.
 */
export function setLogLevel(level: string) {
  baseLogger.level = level;
}
