import { expect } from "chai";
import StatusChecker from "../src/StatusChecker";
import LoggerWrapperMock from "./mock/LoggerWrapperMock";
import SendGridWrapperMock from "./mock/SendGridWrapperMock";
import FetcherMock from "./mock/FetcherMock";
import { Response } from "node-fetch";
import Emailer from "../src/Emailer";

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
    const statusChecker = new StatusChecker(
      loggerWrapperMock,
      fetcherMock,
      new Emailer(new SendGridWrapperMock())
    );

    await statusChecker.start();

    expect(loggerWrapperMock.infoArgs).to.have.lengthOf(1);
    expect(loggerWrapperMock.infoArgs[0]).to.equal(
      "Success: Received expected response"
    );
  });

  it("should ping the website", async () => {
    const loggerWrapperMock = new LoggerWrapperMock();
    const fetcherMock = new FetcherMock();
    const statusChecker = new StatusChecker(
      loggerWrapperMock,
      fetcherMock,
      new Emailer(new SendGridWrapperMock())
    );

    await statusChecker.start();

    expect(fetcherMock.pingArgs).to.have.lengthOf(1);
  });

  it("should log an error if fetch throws an error", async () => {
    const fetchMock = (_url: string) => {
      throw new Error("This is a test");
    };

    const loggerWrapperMock = new LoggerWrapperMock();
    const fetcherMock = new FetcherMock(fetchMock);
    const statusChecker = new StatusChecker(
      loggerWrapperMock,
      fetcherMock,
      new Emailer(new SendGridWrapperMock())
    );

    await statusChecker.start();

    expect(loggerWrapperMock.errorArgs).to.have.lengthOf(1);
    expect(loggerWrapperMock.errorArgs[0]).to.include("This is a test");

    expect(loggerWrapperMock.infoArgs).to.have.lengthOf(0);
  });

  it("should log an error if response returns a status that is not 200", async () => {
    const fetchMock = (_url: string) => {
      const response = new Response(undefined, {
        status: 404,
      });

      return Promise.resolve(response);
    };

    const loggerWrapperMock = new LoggerWrapperMock();
    const fetcherMock = new FetcherMock(fetchMock);
    const statusChecker = new StatusChecker(
      loggerWrapperMock,
      fetcherMock,
      new Emailer(new SendGridWrapperMock())
    );

    await statusChecker.start();

    expect(loggerWrapperMock.errorArgs).to.have.lengthOf(1);
    expect(loggerWrapperMock.errorArgs[0]).to.include(
      "Server responded with status: 404"
    );

    expect(loggerWrapperMock.infoArgs).to.have.lengthOf(0);
  });

  it("should send email on error", async () => {
    const fetchMock = (_url: string) => {
      const response = new Response(undefined, {
        status: 404,
      });

      return Promise.resolve(response);
    };

    const loggerWrapperMock = new LoggerWrapperMock();
    const fetcherMock = new FetcherMock(fetchMock);
    const sendGridWrapperMock = new SendGridWrapperMock();
    const statusChecker = new StatusChecker(
      loggerWrapperMock,
      fetcherMock,
      new Emailer(sendGridWrapperMock)
    );

    await statusChecker.start();

    expect(sendGridWrapperMock.sendArgs).to.have.lengthOf(1);
    expect(sendGridWrapperMock.sendArgs[0].subject).to.equal(
      "[URGENT] Server responded with status: 404"
    );

    const expectedResponse = {
      status: 404,
      statusText: "Not Found",
      url: "",
      redirected: false,
      body: null,
      headers: {},
    };

    const text: string | undefined = sendGridWrapperMock.sendArgs[0].text;
    if (text) {
      const textResponseJson = JSON.parse(text);

      expect(textResponseJson).to.eql(expectedResponse);
    } else {
      expect.fail();
    }

    const html: string | undefined = sendGridWrapperMock.sendArgs[0].html;
    if (html) {
      const htmlResponseJson = JSON.parse(
        html.split("&nbsp;").join(" ").split("<br/>").join("\n") // reverse HTML formatting
      );

      expect(htmlResponseJson).to.eql(expectedResponse);
    } else {
      expect.fail();
    }
  });
});
