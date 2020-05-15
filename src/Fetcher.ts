import nodeFetch, { Response } from "node-fetch";

export interface IFetcher {
  ping(url: string): Promise<Response>;
}

export default class Fetcher implements IFetcher {
  fetch: Function;
  constructor(fetch: Function = nodeFetch) {
    this.fetch = fetch;
  }

  async ping(url: string): Promise<Response> {
    let timeout;
    const promise: Promise<Response> = new Promise((resolve, reject) => {
      timeout = setTimeout(
        () => reject(new Error("Request timed out after 5 seconds")),
        5000
      );
      return this.fetch(url).then(resolve, reject);
    });

    const response = await promise;

    clearTimeout(timeout);

    return response;
  }
}
