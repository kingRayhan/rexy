import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { sign as jwtSign } from 'jsonwebtoken';
import { Session } from './entities/session.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session)
    private readonly model: ReturnModelType<typeof Session>,
    private readonly config: ConfigService,
  ) {}

  generateAccessAndRefreshTokens(subscriber: string) {
    // const accessToken = jwtSign(
    //   { subscriber },
    //   this.config.getOrThrow('auth.at_secret'),
    // );
    return this.config.getOrThrow('auth.at_secret');
    // return { accessToken };
  }
}
