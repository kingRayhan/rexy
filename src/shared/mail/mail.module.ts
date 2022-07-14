import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailEventController } from './mail.events';
import { MailService } from './mail.service';

@Module({
  imports: [ConfigModule],
  providers: [MailService],
  controllers: [MailEventController],
})
export class MailModule {}
