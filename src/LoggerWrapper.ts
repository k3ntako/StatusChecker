import winston, { Logger, format } from "winston";
const { combine, timestamp, json } = format;

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.Console(),
  ],
});

export interface ILoggerWrapper {
  info(message: string): void;
  error(message: string): void;
}

export default class LoggerWrapper implements ILoggerWrapper {
  private logger: Logger;
  constructor() {
    this.logger = logger;
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }
}
