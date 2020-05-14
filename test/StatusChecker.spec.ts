import { expect } from "chai";
import StatusChecker from "../src/StatusChecker";
import LoggerWrapperMock from "./mock/LoggerWrapperMock";

describe("Logger", () => {
  it("should log start message", () => {
    const loggerWrapperMock = new LoggerWrapperMock();

    const statusChecker = new StatusChecker(loggerWrapperMock);
    statusChecker.start();

    expect(loggerWrapperMock.infoArgs).to.have.lengthOf(1);
    expect(loggerWrapperMock.infoArgs[0]).to.equal("Starting StatusChecker...");
  });
});
