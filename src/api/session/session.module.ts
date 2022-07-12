import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { Session } from './entities/session.entity';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  imports: [TypegooseModule.forFeature([Session]), ConfigModule],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
