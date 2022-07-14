import { APP_EVENT } from '../../app/types/APP_EVENT.enum';
import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Mailable } from './contracts/Mailable.abstract';
import { MailService } from './mail.service';

@Controller()
export class MailEventController {
  constructor(private readonly mailService: MailService) {}

  @OnEvent(APP_EVENT.FIRE_MAILABLE)
  fireMailable(mailable: Mailable) {
    this.mailService.sendMailWithTemplate(
      mailable.template,
      mailable.data,
      mailable.to,
      mailable.subject,
    );
  }
}
