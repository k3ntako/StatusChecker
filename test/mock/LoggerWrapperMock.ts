import { ILoggerWrapper } from "../../src/LoggerWrapper";

export default class LoggerWrapperMock implements ILoggerWrapper {
  infoArgs: string[];
  errorArgs: string[];
  fatalArgs: string[];
  constructor() {
    this.infoArgs = [];
    this.errorArgs = [];
    this.fatalArgs = [];
  }

  info(message: string) {
    this.infoArgs.push(message);
  }

  error(message: string) {
    this.errorArgs.push(message);
  }

  fatal(message: string) {
    this.fatalArgs.push(message);
  }
}
