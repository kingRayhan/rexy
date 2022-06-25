import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { RoleModule } from './api/role/role.module';
import { SessionModule } from './api/session/session.module';
import { MailModule } from './common/mail/mail.module';
import { NotificationModule } from './common/notification/notification.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    SessionModule,
    MailModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
