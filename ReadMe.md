# Status Checker

Status Checker can be used with cron jobs in Linux to check if your website/server is still up every x minutes and email you if it is down. You will need to create a SendGrid account and generate an API key.

## Getting Started

1. Install dependencies:

   ```
   npm i
   ```

2. Build the program.

   ```
   npm run build
   ```

3. Create a [SendGrid](https://sendgrid.com/) account and generate an API key.

- More on creating API key, [here](https://sendgrid.com/docs/ui/account-and-settings/api-keys/#creating-an-api-key).

4. Set up your domain so SendGrid can send emails through your domain.

- Instructions can be found, [here](https://sendgrid.com/docs/ui/account-and-settings/how-to-set-up-domain-authentication/).

5. Create a `.env` file in root directory of this project
6. Inside the newly created `.env` file add the following:

   - `SENDGRID_API_KEY` - your SendGrid API key SendGrid API key
   - `recipients` - the email addresses you want alerted (comma separated)
   - `sender` - the address from which the emails will be sent from
   - `url` - the url that you want to check
   - `error_log_path`=/tmp/demo_app/logs/error.log
   - `combined_log_path`=/tmp/demo_app/logs/combined.log

   ```
   SENDGRID_API_KEY=SG.your_api_key
   recipients=person1@example.com,person2@example.com
   sender=something@your_domain.com
   url=https://www.example.com
   error_log_path=/var/log/demo-app/error.log
   combined_log_path=/var/log/demo-app/combined.log
   ```

7. Run `node ./dist/index.js`

- This part can be automated with a cron job (explained in the next section).

## Setting Up a Cron Job on Ubuntu

1. ssh into your Linux machine (e.g., Raspberry Pi, AWS instance, etc.).
   - Ideally this machine can run 24/7.
2. Clone this repository and follow the steps in _Getting Started_, above.
   - Where you clone it is up to you (e.g., `/opts`).
3. Open your cron file and paste in frequency you want the program to run.

   ```
   $ crontab -e
   ```

   - Decide how often you want this to run. For example, I set mine to run every 15 mins using the following.
     - The format the file requires is: `m h dom mon dow command`.
       - `m` is minute
       - `h` is hour
       - `dom` is day of month
       - `mon` is month
       - `dow` is day of week
     - More on formatting [here](https://www.gnu.org/software/mcron/manual/html_node/Crontab-file.html).
   - In the example below, the command will be run at minutes 0, 15, 30, and 45 every hour, every day (aka every 15 mins).

   ```
   # m h  dom mon dow   command
   00,15,30,45 * * * * node /opts/StatusChecker/dist/index.js
   ```

4. Once the program runs, your logs should be where you specified. To make sure that your machine doesn't get overwhelmed with massive log files, consider setting up log rotation in the next section.

## Log Rotation

1. Create config file in `/etc/logrotate.d/`

   ```
   $ cd /etc/logrotate.d/
   $ touch demo_app.conf
   ```

2. Add the configuration you want

   - I used vim, but you can edit a file using other methods such as `nano`

   ```
   $ vim demo_app.conf
   ```

   - Paste the following and make changes as necessary/desired.

   ```
   /var/log/demo_app/* {
       daily
       rotate 7
       size 10M
       compress
       delaycompress
       dateext
   }
   ```

3. Make sure the configurations are working. Make sure there are no errors.

   ```
   logrotate -d /etc/logrotate.d/demo_app.conf
   ```

4. Add log rotation to cron tab.

   ```
   $ crontab -e
   ```

   - Set up the `logrotate` to run as frequently as you feel necessary. You probably won't need it to run more than once a day to begin. The following will have it run once a day at 3 am. Make sure you have the correct time zone ([how to set time zone](https://askubuntu.com/questions/54364/how-do-you-set-the-timezone-for-crontab)).

   ```
   * 3 * * * logrotate /etc/logrotate.d/demo_app.conf
   ```

   - If you have a permission issue like: `/var/lib/logrotate/status.tmp: Permission denied`, you might need to move the state file to your user's directory. Replace `/ubuntu/` with your username (check with `$ whoami`). More [here](https://stackoverflow.com/questions/10761495/error-error-creating-state-file-var-lib-logrotate-status-permission-denied).

   ```
   * 3 * * * logrotate --state /home/ubuntu/logrotate.status --verbose /etc/logrotate.d/demo_app.conf
   ```

More information on log rotation setup:

- <https://www.tecmint.com/install-logrotate-to-manage-log-rotation-in-linux/>
- <https://www.tutorialspoint.com/unix_commands/logrotate.htm>
- <https://linux.die.net/man/8/logrotate>
