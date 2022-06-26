import { Injectable } from '@nestjs/common';
import { AuthLoginDTO } from './dto/login.dto';
import { AuthRegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  register(payload: AuthRegisterDTO) {
    return payload;
  }

  login(payload: AuthLoginDTO) {
    return payload;
  }
}
