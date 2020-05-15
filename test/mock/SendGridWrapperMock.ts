import { ISendGridWrapper } from "../../src/SendGridWrapper";
import { MailDataRequired } from "@sendgrid/mail";
import { ClientResponse } from "@sendgrid/client/src/response";
import Response from "@sendgrid/helpers/classes/response";

export default class SendGridWrapperMock implements ISendGridWrapper {
  sendArgs: MailDataRequired[];

  constructor() {
    this.sendArgs = [];
  }

  async send(emailParams: MailDataRequired): Promise<[ClientResponse, {}]> {
    this.sendArgs.push(emailParams);

    const sendGridResponse = new Response(200, { okay: true });

    return [sendGridResponse, {}];
  }
}
