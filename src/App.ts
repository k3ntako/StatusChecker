import { ILoggerWrapper } from "./LoggerWrapper";
import { IStatusChecker } from "./StatusChecker";
import Emailer from "./Emailer";
import SendGridWrapper from "./SendGridWrapper";

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
      this.handleError(error);
    } finally {
      this.logger.info("Finished running StatusChecker");
    }
  }

  private async handleError(error: Error) {
    try {
      const emailer = new Emailer(new SendGridWrapper());
      this.logger.error(`${error.message} \n ${error.stack}`);
      await emailer.send(error.message, error.stack || "");
    } catch (error) {}
  }
}
