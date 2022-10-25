import { Module } from '@nestjs/common';
import { UserModule } from '@/api/user/user.module';
import { SessionModule } from '@/api/session/session.module';
import { PassportModule } from '@nestjs/passport';
import { FirebaseModule } from '@/shared/firebase/firebase.module';
import { AuthService } from '@/api/auth/auth.service';
import { PassportJWTAccessTokenStrategy } from '@/api/auth/passport-stategies/jwt-at';
import { PassportJWTRefreshTokenStrategy } from '@/api/auth/passport-stategies/jwt-rt';
import { ConfigModule } from '@nestjs/config';
import configs from '@/app/config';
import { TestDatabaseModule } from '@/shared/test-database/test-database.module';
import { TestScaffoldService } from '@/shared/test-scaffold/test-scaffold.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from '@/api/user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
    }),
    TestDatabaseModule,
    TypegooseModule.forFeature([User]),
    UserModule,
    SessionModule,
    PassportModule,
    FirebaseModule,
  ],
  providers: [
    TestScaffoldService,
    AuthService,
    PassportJWTAccessTokenStrategy,
    PassportJWTRefreshTokenStrategy,
  ],
})
export class TestScaffoldModule {}
