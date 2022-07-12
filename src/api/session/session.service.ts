import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReturnModelType } from '@typegoose/typegoose';
import { hashSync } from 'bcryptjs';
import { sign as jwtSign } from 'jsonwebtoken';
import { FilterQuery } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session)
    private readonly model: ReturnModelType<typeof Session>,
    private readonly config: ConfigService,
  ) {}

  /**
   * Claim token for a user id
   * @param subscriber user_id string - user id
   * @returns
   */
  async claimToken(subscriber: string) {
    // Refresh token secret for this specific claim
    const rt_token = this.generateRefreshTokenSecret(subscriber);

    // Store rt_token in database
    const { id: session_id } = await this.storeSessionToDatabase(
      subscriber,
      rt_token,
    );

    // Generate access and refresh tokens
    return this.generateAccessAndRefreshTokens(
      subscriber,
      rt_token,
      session_id,
    );
  }

  /**
   * Generate access and refresh token
   * @param subscriber user_id
   * @returns
   */
  public generateAccessAndRefreshTokens(
    subscriber: string,
    rt_token: string,
    session_id: string,
  ) {
    const accessToken = jwtSign(
      { subscriber, session_id },
      this.config.get('auth.access_token_secret'),
      { expiresIn: this.config.get('auth.access_token_expiration') },
    );
    const refreshToken = jwtSign(
      { subscriber, session_id, rt_token },
      this.config.get('auth.refresh_token_secret'),
      {
        expiresIn: this.config.get('auth.refresh_token_expiration'),
      },
    );
    return { accessToken, refreshToken };
  }

  /**
   * Create session
   * @param subscriber user_id
   * @returns
   */
  public async storeSessionToDatabase(subscriber: string, rt_token: string) {
    const session = await this.model.create({ subscriber, rt_token });
    return session;
  }

  /**
   * Get a session by using session fields
   * @param identifier FilterQuery<Session>
   * @returns Promise<Session>
   */
  public getSession(identifier: FilterQuery<Session>) {
    return this.model.findOne(identifier);
  }

  /**
   * Get sessions by using session fields
   * @param identifier FilterQuery<Session>
   * @returns Promise<Session[]>
   */
  public getSessions(identifier: FilterQuery<Session>) {
    return this.model.find(identifier);
  }

  /**
   * Delete a session by using session fields
   * @param identifier FilterQuery<Session>
   * @returns Promise<Session>
   */
  public async deleteSession(identifier: FilterQuery<Session>) {
    return this.model.deleteMany(identifier, { new: true });
  }

  /**
   * Generate a new refresh token secret for a given user id
   * @param userId string - user id
   * @returns
   */
  private generateRefreshTokenSecret(userId: string) {
    return hashSync(userId + '-' + Date.now(), 10);
  }
}
