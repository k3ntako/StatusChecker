import sgMail, { MailDataRequired } from "@sendgrid/mail";
import { ClientResponse } from "@sendgrid/client/src/response";

export interface ISendGridWrapper {
  send(emailParams: MailDataRequired): Promise<[ClientResponse, {}]>;
}

export default class SendGridWrapper implements ISendGridWrapper {
  constructor() {
    const apiKey: string | undefined = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
      throw new Error("SendGrid API key is undefined");
    }

    sgMail.setApiKey(apiKey);
  }

  async send(emailParams: MailDataRequired): Promise<[ClientResponse, {}]> {
    return await sgMail.send(emailParams);
  }
}
