import { ILoggerWrapper } from "./LoggerWrapper";
import { IStatusChecker } from "./StatusChecker";
import Emailer from "./Emailer";
import ServerStatusError from "./ServerStatusError";

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
      await this.handleError(error);
    } finally {
      this.logger.info("Finished running StatusChecker");
    }
  }

  private async handleError(error: Error | ServerStatusError) {
    try {
      const emailBody = await error.toString();

      this.logger.error(emailBody);
      await this.emailer.send(error.message, emailBody);
    } catch (error) {
      this.logger.error("Failed to send email:" + error.toString());
    }
  }
}
