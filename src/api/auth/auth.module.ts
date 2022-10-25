import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { PassportJWTAccessTokenStrategy } from './passport-stategies/jwt-at';
import { PassportJWTRefreshTokenStrategy } from './passport-stategies/jwt-rt';
import { UserModule } from "@/api/user/user.module";
import { SessionModule } from "@/api/session/session.module";
import { FirebaseModule } from "@/shared/firebase/firebase.module";

@Module({
  imports: [UserModule, SessionModule, PassportModule, FirebaseModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PassportJWTAccessTokenStrategy,
    PassportJWTRefreshTokenStrategy,
  ],
})
export class AuthModule {}
