import { baseLogger, createLoggerAdapter } from "./instance.js";

export const logger = createLoggerAdapter(baseLogger);

export default logger;
