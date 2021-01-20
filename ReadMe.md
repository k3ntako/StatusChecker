# Status Checker

Status Checker can be used with cron jobs in Linux to check if your website/server is still up every x minutes and email you if it is down. You will need to create a SendGrid account and generate an API key.

## Getting Started

1. Install dependencies:

```
npm i
```

2. Create a [SendGrid](https://sendgrid.com/) account and generate an API key.

- More on creating API key, [here](https://sendgrid.com/docs/ui/account-and-settings/api-keys/#creating-an-api-key).

3. Set up your domain so SendGrid can send emails through your domain.

- Instructions can be found, [here](https://sendgrid.com/docs/ui/account-and-settings/how-to-set-up-domain-authentication/).

4. Create a `.env` file in root directory of this project
5. Inside the newly created `.env` file add the following:

- `SENDGRID_API_KEY` - your SendGrid API key SendGrid API key
- `recipients` - the email addresses you want alerted (comma separated)
- `sender` - the address from which the emails will be sent from
- `url` - the url that you want to check

```
SENDGRID_API_KEY=SG.your_api_key
recipients=person1@example.com,person2@example.com
sender=something@your_domain.com
url=https://www.example.com
```

6. Run `node ./src/index.js`

- This part can be automated with a cron job.
