import { getLogger, Logger, configure } from "log4js";
configure({
  appenders: {
    everything: {
      type: "file",
      filename: "./all-the-logs.log",
    },
  },
  categories: {
    default: { appenders: ["everything"], level: "info" },
  },
});

export interface ILoggerWrapper {
  info(message: string): void;
  error(message: string): void;
  fatal(message: string): void;
}

export default class LoggerWrapper implements ILoggerWrapper {
  private logger: Logger;
  constructor() {
    this.logger = getLogger();
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  fatal(message: string) {
    this.logger.fatal(message);
  }
}
