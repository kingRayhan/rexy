import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload } from '../../../app/contracts/AccessTokenPayload.interface';
import { SessionService } from '../../session/session.service';
import { UserService } from '../../user/user.service';
import { AuthStrategy } from '../contracts/AuthStategy.enum';

@Injectable()
export class PassportJWTAccessTokenStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.AUTH_JWT_ACCESS_TOKEN,
) {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
      ]),
      secretOrKey: config.get('auth.access_token_secret'),
    });
  }

  async validate(payload: AccessTokenPayload): Promise<any> {
    const details = await this.userService.getUserById(
      payload.subscriber,
      '-password',
    );

    const isValidSession = await this.sessionService.getSession({
      _id: payload.session_id,
    });

    if (!Boolean(isValidSession)) {
      throw new UnauthorizedException();
    }

    return {
      subscriber: payload.subscriber,
      session_id: payload.session_id,
      details,
    };
  }
}
