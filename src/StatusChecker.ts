import { ILoggerWrapper } from "./LoggerWrapper";
import { IFetcher } from "./Fetcher";
import Emailer from "./Emailer";
import { Response } from "node-fetch";

export interface IStatusChecker {
  start(): Promise<void>;
}

interface IHeader {
  [key: string]: string;
}

interface IResponseJson {
  [key: string]: string | number | boolean | IHeader;
}

export default class StatusChecker implements IStatusChecker {
  private logger: ILoggerWrapper;
  private fetcher: IFetcher;
  private emailer: Emailer;
  constructor(logger: ILoggerWrapper, fetcher: IFetcher, emailer: Emailer) {
    this.logger = logger;
    this.fetcher = fetcher;
    this.emailer = emailer;
  }

  async start(): Promise<void> {
    await this.checkStatus();
  }

  private async checkStatus(): Promise<void> {
    try {
      const url: string | undefined = process.env.url;
      if (!url || !url.trim()) {
        throw new Error("No url specified in .env file");
      }

      const response = await this.fetcher.ping(url);
      if (response.status !== 200) {
        return await this.handleError(
          `Server responded with status: ${response.status}`,
          await this.stringifyResponse(response)
        );
      }

      this.logger.info("Success: Received expected response");
    } catch (err) {
      await this.handleError(err.message, err.stack);
    }
  }

  private async handleError(message: string, details: string) {
    this.logger.error(`${message} \n ${details}`);
    await this.emailer.send(message, details);
  }

  private async stringifyResponse(response: Response): Promise<string> {
    const responseJSON: IResponseJson = {
      status: response.status,
      statusText: response.statusText,
      type: response.type,
      url: response.url,
      redirected: response.redirected,
      body: await this.parseBody(response),
      headers: this.parseHeader(response),
    };

    return JSON.stringify(responseJSON, null, 2);
  }

  private parseHeader(response: Response): IHeader {
    const headers: IHeader = {};
    for (const pair of response.headers.entries()) {
      const key: string = pair[0];
      const value: string = pair[1];
      headers[key] = value;
    }

    return headers;
  }

  private async parseBody(response: Response) {
    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  }
}
