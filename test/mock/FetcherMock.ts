import { IFetcher } from "../../src/Fetcher";
import { Response } from "node-fetch";

export default class FetcherMock implements IFetcher {
  private fetch: Function;
  pingArgs: string[];

  constructor(fetch: Function = () => {}) {
    this.fetch = fetch;
    this.pingArgs = [];
  }
  async ping(url: string) {
    this.pingArgs.push(url);
    const response = (await this.fetch(url)) || new Response();

    return response;
  }
}
