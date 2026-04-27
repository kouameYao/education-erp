import pino from "pino";

const isPretty = process.env.LOG_PRETTY === "true";

export const baseLogger = pino({
  level: process.env.LOG_LEVEL || "info",
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
  ...(isPretty && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
        messageFormat: "{msg}",
        hideObject: false,
        singleLine: false,
        useLevelLabels: true,
        levelFirst: true,
      },
    },
  }),
});

export function createLoggerAdapter(
  pinoLogger: pino.Logger,
  prefixContext?: string,
) {
  const formatContext = (ctx?: string): string => {
    if (!ctx) return "";
    if (ctx.startsWith("[") && ctx.endsWith("]")) return ctx;
    return `[${ctx}]`;
  };

  const formattedContext = formatContext(prefixContext);

  const log = (
    level: "info" | "error" | "warn" | "debug",
    message: string,
    data?: object,
  ) => {
    try {
      const fullMessage = formattedContext
        ? `${formattedContext} ${message}`
        : message;
      if (data) {
        pinoLogger[level](data, fullMessage);
      } else {
        pinoLogger[level](fullMessage);
      }
    } catch (_error) {
      // Silently ignore logger stream errors to prevent crashes
      // (e.g. pino-pretty transport stream closing).
    }
  };

  return {
    info: (message: string, data?: object) => log("info", message, data),
    error: (message: string, data?: object) => log("error", message, data),
    warn: (message: string, data?: object) => log("warn", message, data),
    debug: (message: string, data?: object) => log("debug", message, data),
  };
}
