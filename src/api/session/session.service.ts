import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { hashSync } from 'bcryptjs';
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

  /**
   * Generate access and refresh token
   * @param subscriber user_id
   * @returns
   */
  generateAccessAndRefreshTokens(subscriber: string, rt_secret: string) {
    const accessToken = jwtSign(
      { subscriber },
      this.config.get('auth.at_secret'),
    );
    const refreshToken = jwtSign({ subscriber }, rt_secret);
    return { accessToken, refreshToken };
  }

  /**
   * Create session
   * @param subscriber user_id
   * @returns
   */
  async createSession(subscriber: string) {
    const session = await this.model.create({
      subscriber,
      rt_secret: this.generateRefreshTokenSecret(subscriber),
    });

    return session;
  }

  /**
   * Generate a new refresh token secret for a given user id
   * @param userId string - user id
   * @returns
   */
  generateRefreshTokenSecret(userId: string) {
    return hashSync(userId + '-' + Date.now(), 10);
  }
}
