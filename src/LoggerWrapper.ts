import winston, { Logger, format } from "winston";
const { combine, timestamp, json } = format;

export interface ILoggerWrapper {
  info(message: string): void;
  error(message: string): void;
}

interface ILogger extends Logger {
  [key: string]: any;
}

export default class LoggerWrapper implements ILoggerWrapper {
  private logger: ILogger;
  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: combine(timestamp(), json()),
      transports: [
        new winston.transports.File({
          filename: process.env.error_log_path,
          level: "error",
        }),
        new winston.transports.File({
          filename: process.env.combined_log_path,
        }),
        new winston.transports.Console(),
      ],
    });
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }
}
