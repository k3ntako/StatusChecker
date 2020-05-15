import { ILoggerWrapper } from "./LoggerWrapper";
import SendGridWrapper from "./SendGridWrapper";
import Emailer from "./Emailer";
import Fetcher from "./Fetcher";
import StatusChecker from "./StatusChecker";
import App from "./App";

export default class Setup {
  logger: ILoggerWrapper;
  constructor(loggerWrapper: ILoggerWrapper) {
    this.logger = loggerWrapper;
  }

  async setup(): Promise<App | null> {
    try {
      await this.configureDotEnv();
      return this.generateApp();
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }

  private async configureDotEnv() {
    const path = require("path");
    const mainFileName: string | undefined = require.main?.filename;

    const rootPath = path.resolve(path.dirname(mainFileName), "../");
    const envPath = path.resolve(rootPath, ".env");

    const result = require("dotenv").config({ path: envPath });

    if (!result || result.error) {
      throw new Error("Could not find env file");
    }
  }

  private generateApp() {
    const emailer = new Emailer(new SendGridWrapper());
    const statusChecker = new StatusChecker(
      this.logger,
      new Fetcher(),
      emailer
    );

    return new App(statusChecker, this.logger, emailer);
  }
}
