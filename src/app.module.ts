import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './api/user/user.module';
import { AppController } from './app.controller';
import { RolesModule } from './api/roles/roles.module';
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
    MongooseModule.forRoot(process.env.DATABASE_URL),
    EventEmitterModule.forRoot(),

    // ---------------------------------------------------------
    // Application modules
    // ---------------------------------------------------------
    UserModule,

    RolesModule,
    // RoleModule,
    // SessionModule,
    // MailModule,
    // NotificationModule,
    // AuthModule,
    // TestDatabaseModule,
    // FirebaseModule,
    //  ----
  ],
  controllers: [AppController],
})
export class AppModule {}
