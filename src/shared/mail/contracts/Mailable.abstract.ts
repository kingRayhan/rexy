import { MAIL_TEMPLATES } from './MAIL_TEMPLATES.enum';

/**
 * Base class for all mailable classes
 * @abstract
 * @class Mailable
 * @implements {Mailable}
 * @author KingRayhan
 */
export abstract class Mailable {
  /**
   * Receiver mail address
   * @type {string}
   * @memberof Mailable
   * @example johndoe@example.com
   */
  public abstract to: string;

  /**
   * Subject of the email
   * @type {string}
   * @memberof Mailable
   * @example Welcome to the application
   */
  public abstract subject: string;

  /**
   * Key value pairs of data to use in the template
   * @type {[key: string]: any}
   * @memberof Mailable
   * @example { name: 'John Doe' }
   * @example { name: 'John Doe', age: 30 }
   * @example { name: 'John Doe', age: 30, isAdmin: true }
   */
  public abstract data?: { [key: string]: any };

  /**
   * The template to use
   * @type {MAIL_TEMPLATES}
   * @memberof Mailable
   * @abstract
   * @readonly
   * @example MAIL_TEMPLATES.WELCOME
   * @example MAIL_TEMPLATES.RESET_PASSWORD
   * @example MAIL_TEMPLATES.RESET_PASSWORD_CONFIRMATION
   * @example MAIL_TEMPLATES.RESET_PASSWORD_SUCCESS
   */
  public abstract template?: MAIL_TEMPLATES;
}
