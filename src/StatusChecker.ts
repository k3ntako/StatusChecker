import { ILoggerWrapper } from "./LoggerWrapper";

export default class StatusChecker {
  logger: ILoggerWrapper;
  constructor(logger: ILoggerWrapper) {
    this.logger = logger;
  }

  start() {
    this.logger.info("Starting StatusChecker...");
  }
}
