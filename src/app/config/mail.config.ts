import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  /*
    |--------------------------------------------------------------------------
    | Mailer Configurations
    |--------------------------------------------------------------------------
    | This is the configuration for the mailer service.
    | The mailer service is used to send emails to users.
    | The mailer service uses the nodemailer package.
    | The mailer service uses the pug template engine.
    */
  port: process.env.MAIL_PORT || 1025,
  host: process.env.MAIL_HOST || '0.0.0.0',
  secure: process.env.MAIL_SECURE === 'true',

  auth_user: process.env.MAIL_USER || null,
  auth_password: process.env.MAIL_PASSWORD || null,

  defaultEmail: process.env.MAIL_DEFAULT_EMAIL || 'rexy@rexy.app',
  defaultName: process.env.MAIL_DEFAULT_NAME || 'Rexy 🦕',
  ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
  requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
}));
