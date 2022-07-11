import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthStrategy } from '../contracts/AuthStategy.enum';

@Injectable()
export class PassportJWTAccessTokenStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.AUTH_JWT_ACCESS_TOKEN,
) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
      ]),
      secretOrKey: config.get('auth.at_secret'),
    });
  }

  async validate(payload: any): Promise<any> {
    return { userId: payload };
  }
}
