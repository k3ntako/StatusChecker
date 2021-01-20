import { expect } from "chai";
import App from "../src/App";
import LoggerWrapperMock from "./mock/LoggerWrapperMock";
import StatusCheckerMock from "./mock/StatusCheckerMock";
import Emailer from "../src/Emailer";
import SendGridWrapperMock from "./mock/SendGridWrapperMock";
import StatusChecker from "../src/StatusChecker";
import FetcherMock from "./mock/FetcherMock";
import { Response } from "node-fetch";

let statusCheckerMock: StatusCheckerMock,
  loggerWrapperMock: LoggerWrapperMock,
  sendGridWrapperMock: SendGridWrapperMock,
  emailer: Emailer;

describe("App", () => {
  before(() => {
    process.env.sender = "app_sender@example.com";
    process.env.recipients =
      "app_recipient1@example.com,app_recipient2@example.com";
    process.env.url = "https://example.com/";
  });

  beforeEach(() => {
    statusCheckerMock = new StatusCheckerMock();
    loggerWrapperMock = new LoggerWrapperMock();
    sendGridWrapperMock = new SendGridWrapperMock();
    emailer = new Emailer(sendGridWrapperMock);
  });

  after(() => {
    delete process.env.sender;
    delete process.env.recipients;
    delete process.env.url;
  });

  it("should log start message", async () => {
    const app = new App(statusCheckerMock, loggerWrapperMock, emailer);
    await app.run();

    expect(loggerWrapperMock.infoArgs).to.have.lengthOf(2);
    expect(loggerWrapperMock.infoArgs[0]).to.equal("Starting StatusChecker...");
  });

  it("should call StatusChecker.start", async () => {
    const app = new App(statusCheckerMock, loggerWrapperMock, emailer);
    await app.run();

    expect(statusCheckerMock.startCallNum).equal(1);
  });

  it("should log finish message", async () => {
    const app = new App(statusCheckerMock, loggerWrapperMock, emailer);
    await app.run();

    expect(loggerWrapperMock.infoArgs).to.have.lengthOf(2);
    expect(loggerWrapperMock.infoArgs[1]).to.equal(
      "Finished running StatusChecker"
    );
  });

  it("should log finish message even if StatusChecker throws an error", async () => {
    statusCheckerMock.start = () => {
      throw new Error("This is a test of App - 1");
    };

    const app = new App(statusCheckerMock, loggerWrapperMock, emailer);
    await app.run();

    expect(loggerWrapperMock.infoArgs).to.have.lengthOf(2);
    expect(loggerWrapperMock.infoArgs[1]).to.equal(
      "Finished running StatusChecker"
    );
  });

  it("should send email if an error is caught", async () => {
    statusCheckerMock.start = () => {
      throw new Error("This is a test of App - 2");
    };

    const app = new App(statusCheckerMock, loggerWrapperMock, emailer);
    await app.run();

    expect(sendGridWrapperMock.sendArgs).to.have.lengthOf(1);
    expect(sendGridWrapperMock.sendArgs[0].text).to.include(
      "This is a test of App - 2"
    );
  });

  it("should send email if API response status is not in the 200s", async () => {
    const fetchMock = (_url: string) => {
      const response = new Response(undefined, {
        status: 404,
      });

      return Promise.resolve(response);
    };

    const statusChecker = new StatusChecker(
      loggerWrapperMock,
      new FetcherMock(fetchMock)
    );
    const app = new App(statusChecker, loggerWrapperMock, emailer);
    await app.run();

    expect(sendGridWrapperMock.sendArgs).to.have.lengthOf(1);
    expect(sendGridWrapperMock.sendArgs[0].text).to.include("404");
  });

  it("should send email if fetch throws an error", async () => {
    const fetchMock = (_url: string) => {
      throw new Error("Fetch threw an error");
    };
    const statusChecker = new StatusChecker(
      loggerWrapperMock,
      new FetcherMock(fetchMock)
    );
    const app = new App(statusChecker, loggerWrapperMock, emailer);
    await app.run();

    expect(sendGridWrapperMock.sendArgs).to.have.lengthOf(1);
    expect(sendGridWrapperMock.sendArgs[0].text).to.include(
      "Fetch threw an error"
    );
  });
});
