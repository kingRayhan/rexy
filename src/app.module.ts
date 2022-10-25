import { AuthModule } from './api/auth/auth.module';
import { RoleModule } from './api/role/role.module';
import { SessionModule } from './api/session/session.module';
import { UserModule } from './api/user/user.module';
import configs from './app/config';
import { MailModule } from './shared/mail/mail.module';
import { NotificationModule } from './shared/notification/notification.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppTestApisController } from './app.test-apis';
import { TestDatabaseModule } from './shared/test-database/test-database.module';
import { FirebaseModule } from './shared/firebase/firebase.module';
import { AppController } from './app.controller';
import { ProductsModule } from '@/api/products/products.module';

@Module({
  imports: [
    // ---------------------------------------------------------
    //  Support modules
    // ---------------------------------------------------------
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
    EventEmitterModule.forRoot(),

    // ---------------------------------------------------------
    // Application modules
    // ---------------------------------------------------------
    UserModule,
    RoleModule,
    SessionModule,
    MailModule,
    NotificationModule,
    AuthModule,
    TestDatabaseModule,
    FirebaseModule,
    //  ----
    ProductsModule,
  ],
  controllers: [AppTestApisController, AppController],
})
export class AppModule {}
