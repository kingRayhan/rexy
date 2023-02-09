import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from './api/roles/roles.module';
import { UserModule } from './api/user/user.module';
import { AppController } from './app.controller';
import configs from './app/config';
import { AppCacheModule } from './shared/app-cache/app-cache.module';
import { TokenModule } from './api/token/token.module';
import { AuthModule } from './api/auth/auth.module';

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
    MongooseModule.forRoot(process.env.DATABASE_URL),
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS_URL,
      },
    }),
    EventEmitterModule.forRoot(),
    AppCacheModule,

    // ---------------------------------------------------------
    // Application modules
    // ---------------------------------------------------------
    UserModule,
    RolesModule,
    TokenModule,
    AuthModule,
    // SessionModule,
    // MailModule,
    // NotificationModule,
    // AuthModule,
    // TestDatabaseModule,
    //  ----
  ],
  controllers: [AppController],
})
export class AppModule {}
