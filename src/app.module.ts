import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UserModule } from '@/api/user/user.module';
import { RoleModule } from '@/api/role/role.module';
import { SessionModule } from '@/api/session/session.module';
import { MailModule } from '@/shared/mail/mail.module';
import { NotificationModule } from '@/shared/notification/notification.module';
import { TypegooseModule } from 'nestjs-typegoose';
import configs from '@/app/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@/api/auth/auth.module';
import { TestDatabaseModule } from './shared/test-database/test-database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env.prod', '.env.dev', '.env'],
    }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('database.url'),
      }),
    }),
    UserModule,
    RoleModule,
    SessionModule,
    MailModule,
    NotificationModule,
    AuthModule,
    TestDatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
