import { Controller, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiTags } from '@nestjs/swagger';
import { APP_EVENT } from './app/contracts/APP_EVENT.enum';
import { WelcomeMailable } from './shared/mail/mailables/WelcomeMailable';

@ApiTags('Test APIs')
@Controller('/tests')
export class AppTestApisController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Post('/send-mail')
  sendMail() {
    this.eventEmitter.emit(APP_EVENT.FIRE_MAILABLE, new WelcomeMailable());
    return 'send-mail';
  }
}
