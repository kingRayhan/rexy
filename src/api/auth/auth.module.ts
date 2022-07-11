import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [UserModule, SessionModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
