import SendGridWrapper from "./SendGridWrapper";
import Emailer from "./Emailer";
import Fetcher from "./Fetcher";
import StatusChecker from "./StatusChecker";
import LoggerWrapper from "./LoggerWrapper";
import App from "./App";

export default class Setup {
  constructor() {}

  async setup(): Promise<App | null> {
    await this.configureDotEnv();
    return this.generateApp();
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
    const logger = new LoggerWrapper();
    const emailer = new Emailer(new SendGridWrapper());
    const statusChecker = new StatusChecker(logger, new Fetcher());

    return new App(statusChecker, logger, emailer);
  }
}
