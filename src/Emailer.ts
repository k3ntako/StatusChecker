import { ISendGridWrapper } from "./SendGridWrapper";
import { MailDataRequired } from "@sendgrid/mail";

export default class Emailer {
  private sendGridWrapper: ISendGridWrapper;
  constructor(sendGridWrapper: ISendGridWrapper) {
    this.sendGridWrapper = sendGridWrapper;
  }

  async send(subject: string, body: string) {
    const recipients = this.getRecipients();
    const sender = this.getSender();

    const emailParams: MailDataRequired = this.composeEmail(
      subject,
      body,
      recipients,
      sender
    );

    await this.sendGridWrapper.send(emailParams);
  }

  private getRecipients(): string[] {
    const recipientsStr: string = process.env.recipients || "";

    if (recipientsStr.trim().length === 0) {
      throw new Error("Recipients not specified in .env file");
    }

    return recipientsStr.split(",");
  }

  private getSender(): string {
    const sender: string | undefined = process.env.sender;

    if (!sender || !sender.trim()) {
      throw new Error("Sender not specified in .env file");
    }

    return sender;
  }

  private composeEmail(
    subject: string,
    body: string,
    recipients: string[],
    sender: string
  ): MailDataRequired {
    return {
      to: recipients,
      from: sender,
      subject: "[URGENT] " + subject,
      text: body,
      html: body.split("\n").join("<br/>").split(" ").join("&nbsp;"),
    };
  }
}
