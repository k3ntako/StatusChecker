import { IStatusChecker } from "../../src/StatusChecker";

export default class StatusCheckerMock implements IStatusChecker {
  startCallNum: number;
  constructor() {
    this.startCallNum = 0;
  }

  async start() {
    this.startCallNum++;
  }
}
