import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  /*
    |--------------------------------------------------------------------------
    | Mailer Configurations
    |--------------------------------------------------------------------------
    |
    | Here you can define your SMTP configurations.
    | You can use the following configuration options:
    | host: The host of your SMTP server.
    | port: The port of your SMTP server.
    | secure: Use secure or not.
    | auth: The credentials of your SMTP server.
    | debug: Use debug mode or not.
    | logger: Use the logger or not.
    | sender: The sender of the email.
    | replyTo: The replyTo of the email.
    | subject: The subject of the email.
    | text: The text of the email.
    */
  port: process.env.MAIL_PORT || 1025,
  host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
  secure: process.env.MAIL_SECURE === 'true',

  auth_user: process.env.MAIL_USER || 'user',
  auth_password: process.env.MAIL_PASSWORD || 'password',

  defaultEmail: process.env.MAIL_DEFAULT_EMAIL || 'rexy@rexy.app',
  defaultName: process.env.MAIL_DEFAULT_NAME || 'Rexy 🦕',
  ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
  requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
}));
