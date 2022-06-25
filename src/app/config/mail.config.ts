import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  /*
    |--------------------------------------------------------------------------
    | Default Mailer
    |--------------------------------------------------------------------------
    |
    | This option controls the default mailer that is used to send any email
    | messages sent by your application. Alternative mailers may be setup
    | and used as needed; however, this mailer will be used by default.
    |
    */
  default: 'smtp',

  /*
    |--------------------------------------------------------------------------
    | Mailer Configurations
    |--------------------------------------------------------------------------
    |
    | Here you may configure all of the mailers used by your application plus
    | their respective settings. Several examples have been configured for
    | you and you are free to add your own as your application requires.
    |
    | Laravel supports a variety of mail "transport" drivers to be used while
    | sending an e-mail. You will specify which one you are using for your
    | mailers below. You are free to add additional mailers as required.
    |
    | Supported: "smtp"
    */

  mailers: {
    smtp: {
      port: parseInt(process.env.MAIL_PORT, 10),
      host: process.env.MAIL_HOST,
      user: process.env.MAIL_USER,
      password: process.env.MAIL_PASSWORD,
      defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
      defaultName: process.env.MAIL_DEFAULT_NAME,
      ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
      secure: process.env.MAIL_SECURE === 'true',
      requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
    },
  },
}));
