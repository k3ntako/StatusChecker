import { ILoggerWrapper } from "./LoggerWrapper";
import { IFetcher } from "./Fetcher";
import { Response } from "node-fetch";
import ServerStatusError from "./ServerStatusError";

export interface IStatusChecker {
  start(): Promise<void>;
}

export default class StatusChecker implements IStatusChecker {
  private logger: ILoggerWrapper;
  private fetcher: IFetcher;

  constructor(logger: ILoggerWrapper, fetcher: IFetcher) {
    this.logger = logger;
    this.fetcher = fetcher;
  }

  public start = async (): Promise<void> => {
    await this.checkStatus();
  };

  private async checkStatus(): Promise<void> {
    const url: string | undefined = process.env.url;
    if (!url || !url.trim()) {
      throw new Error("No url specified in .env file");
    }

    const response: Response = await this.fetcher.ping(url);
    if (response.status !== 200) {
      const message = `Server responded with status: ${response.status}`;
      throw new ServerStatusError(message, response);
    }

    this.logger.info("Success: Received expected response");
  }
}
