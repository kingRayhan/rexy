import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshTokenPayload } from '../../../app/contracts/AccessTokenPayload.interface';
import { SessionService } from '../../session/session.service';
import { UserService } from '../../user/user.service';
import { AuthStrategy } from '../contracts/AuthStategy.enum';

@Injectable()
export class PassportJWTRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.AUTH_JWT_REFRESH_TOKEN,
) {
  constructor(
    private readonly config: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('refresh_token'),
        ExtractJwt.fromBodyField('refresh_token'),
      ]),
      secretOrKey: config.get('auth.refresh_token_secret'),
    });
  }

  async validate(payload: RefreshTokenPayload): Promise<any> {
    const isValidSession = await this.sessionService.getSession({
      rt_token: payload.rt_token,
    });

    if (!Boolean(isValidSession)) {
      throw new UnauthorizedException();
    }

    return {
      subscriber: payload.subscriber,
      session_id: payload.session_id,
    };
  }
}
