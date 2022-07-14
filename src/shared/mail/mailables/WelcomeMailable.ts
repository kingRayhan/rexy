import { Mailable } from '../contracts/Mailable.abstract';
import { MAIL_TEMPLATES } from '../contracts/MAIL_TEMPLATES.enum';

export class WelcomeMailable implements Mailable {
  public to = 'example@example.com';
  public subject = 'Welcome to the application';
  public data = { name: 'John Doe' };
  public template?: MAIL_TEMPLATES = MAIL_TEMPLATES.WELCOME;
}
