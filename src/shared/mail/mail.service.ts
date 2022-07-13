import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as juice from 'juice';
import { createTransport } from 'nodemailer';
import { renderFile } from 'pug';
import { MAIL_TEMPLATES } from './contracts/MAIL_TEMPLATES.enum';

@Injectable()
export class MailService {
  constructor(private readonly config: ConfigService) {}

  private transport() {
    const mailConfig = {
      host: this.config.get('mail.host'),
      port: this.config.get('mail.port'),
      secure: this.config.get('mail.secure'), // true for 465, false for other ports
      auth: {
        user: this.config.get('mail.auth_user'),
        pass: this.config.get('mail.auth_password'),
      },
    };
    return createTransport(mailConfig);
  }

  /**
   * Send a mail
   * @param param0 { to: string, subject: string, text: string }
   * @returns
   */
  public async sendMail({
    to,
    subject,
    text,
    html,
  }: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    const mailOptions = {
      from: `"${this.config.get('mail.defaultName')}" <${this.config.get(
        'mail.defaultEmail',
      )}>`,
      to,
      subject,
      text,
      html,
    };
    const info = await this.transport().sendMail(mailOptions);
    return info;
  }

  /**
   * Render a mail template
   * @param template MAIL_TEMPLATES enum - the template to use
   * @param data any - the data to use
   * @returns string
   */
  public renderTemplate(template: MAIL_TEMPLATES, data?: any) {
    const templatePath = `${__dirname}/templates/${template}.pug`;
    const html = renderFile(templatePath, data);
    return juice(html);
  }
}
