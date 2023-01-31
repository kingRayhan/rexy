import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './api/user/user.module';
import { AppController } from './app.controller';
import { AppTestApisController } from './app.test-apis';
import configs from './app/config';

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
    MongooseModule.forRootAsync({
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
    // RoleModule,
    // SessionModule,
    // MailModule,
    // NotificationModule,
    // AuthModule,
    // TestDatabaseModule,
    // FirebaseModule,
    //  ----
  ],
  controllers: [AppTestApisController, AppController],
})
export class AppModule {}
