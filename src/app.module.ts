import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { RoleModule } from './api/role/role.module';
import { SessionModule } from './api/session/session.module';
import { MailModule } from './common/mail/mail.module';
import { NotificationModule } from './common/notification/notification.module';
import configs from '@tadashi-config/index';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env.prod', '.env.dev', '.env'],
    }),
    UserModule,
    RoleModule,
    SessionModule,
    MailModule,
    NotificationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
