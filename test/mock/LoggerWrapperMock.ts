import { ILoggerWrapper } from "../../src/LoggerWrapper";

export default class LoggerWrapperMock implements ILoggerWrapper {
  infoArgs: string[];
  errorArgs: string[];

  constructor() {
    this.infoArgs = [];
    this.errorArgs = [];
  }

  info(message: string) {
    this.infoArgs.push(message);
  }

  error(message: string) {
    this.errorArgs.push(message);
  }
}
