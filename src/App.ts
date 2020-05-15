import { ILoggerWrapper } from "./LoggerWrapper";
import { IStatusChecker } from "./StatusChecker";
import Emailer from "./Emailer";

export default class App {
  private statusChecker: IStatusChecker;
  private logger: ILoggerWrapper;
  private emailer: Emailer;

  constructor(
    statusChecker: IStatusChecker,
    logger: ILoggerWrapper,
    emailer: Emailer
  ) {
    this.statusChecker = statusChecker;
    this.logger = logger;
    this.emailer = emailer;
  }

  async run() {
    try {
      this.logger.info("Starting StatusChecker...");
      await this.statusChecker.start();
    } catch (error) {
      this.logger.error(`${error.message} \n ${error.stack}`);
      await this.emailer.send(error.message, error.stack);
    } finally {
      this.logger.info("Finished running StatusChecker");
    }
  }
}
