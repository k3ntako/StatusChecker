import { expect } from "chai";
import Emailer from "../src/Emailer";
import SendGridWrapperMock from "./mock/SendGridWrapperMock";

describe("Emailer", () => {
  before(() => {
    process.env.sender = "emailer_sender@example.com";
    process.env.recipients =
      "emailer_recipient1@example.com,emailer_recipient2@example.com";
  });

  after(() => {
    delete process.env.sender;
    delete process.env.recipients;
  });

  describe("send", () => {
    it("should send email", async () => {
      const sendGridWrapperMock = new SendGridWrapperMock();
      const emailer = new Emailer(sendGridWrapperMock);

      await emailer.send("Server is down", "Some detail here");
      expect(sendGridWrapperMock.sendArgs).to.have.lengthOf(1);

      const args = sendGridWrapperMock.sendArgs[0];
      expect(args.to).to.eql([
        "emailer_recipient1@example.com",
        "emailer_recipient2@example.com",
      ]);

      expect(args.from).to.equal("emailer_sender@example.com");
      expect(args.subject).to.equal("[URGENT] Server is down");
      expect(args.text).to.equal("Some detail here");
      expect(args.html).to.equal(
        "Some detail here".split("\n").join("<br/>").split(" ").join("&nbsp;")
      );
    });
  });
});
