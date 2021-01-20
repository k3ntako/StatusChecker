import { Response } from "node-fetch";

interface IHeader {
  [key: string]: string;
}

interface IResponseJson {
  [key: string]: string | number | boolean | IHeader;
}

export default class ServerStatusError extends Error {
  private response: Response;

  constructor(message: string, response: Response) {
    super(message);

    this.response = response;
  }

  public async toString(): Promise<string> {
    const str = `${this.message} \n ${this.stack} \n `;
    return str + (await this.stringifyResponse(this.response));
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
