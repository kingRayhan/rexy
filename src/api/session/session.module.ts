import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Session } from './entities/session.entity';

@Module({
  imports: [TypegooseModule.forFeature([Session])],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
