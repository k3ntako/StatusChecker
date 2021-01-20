import { expect } from "chai";
import StatusChecker from "../src/StatusChecker";
import LoggerWrapperMock from "./mock/LoggerWrapperMock";
import FetcherMock from "./mock/FetcherMock";
import { Response } from "node-fetch";
import ServerStatusError from "../src/ServerStatusError";

describe("StatusChecker", () => {
  before(() => {
    process.env.sender = "statuschecker_sender@example.com";
    process.env.recipients =
      "statuschecker_recipient1@example.com,statuschecker_recipient2@example.com";

    process.env.url = "https://example.com/";
  });

  after(() => {
    delete process.env.sender;
    delete process.env.recipients;
    delete process.env.url;
  });

  it("should log success message", async () => {
    const loggerWrapperMock = new LoggerWrapperMock();
    const fetcherMock = new FetcherMock();
    const statusChecker = new StatusChecker(loggerWrapperMock, fetcherMock);

    await statusChecker.start();

    expect(loggerWrapperMock.infoArgs).to.have.lengthOf(1);
    expect(loggerWrapperMock.infoArgs[0]).to.equal(
      "Success: Received expected response"
    );
  });

  it("should ping the website", async () => {
    const loggerWrapperMock = new LoggerWrapperMock();
    const fetcherMock = new FetcherMock();
    const statusChecker = new StatusChecker(loggerWrapperMock, fetcherMock);

    await statusChecker.start();

    expect(fetcherMock.pingArgs).to.have.lengthOf(1);
  });

  it("should throw an error if response returns a status that is not 200", async () => {
    const fetchMock = (_url: string) => {
      const response = new Response(undefined, {
        status: 404,
      });

      return Promise.resolve(response);
    };

    const loggerWrapperMock = new LoggerWrapperMock();
    const fetcherMock = new FetcherMock(fetchMock);
    const statusChecker = new StatusChecker(loggerWrapperMock, fetcherMock);

    let error;
    try {
      await statusChecker.start();
    } catch (err) {
      error = err;
    }

    expect(error).to.exist;
    expect(error).to.be.instanceOf(ServerStatusError);
  });
});
