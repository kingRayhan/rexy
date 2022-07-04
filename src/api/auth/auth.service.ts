import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthLoginDTO } from './dto/login.dto';
import { AuthRegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(payload: AuthRegisterDTO) {
    // if(payload.email)
    payload.email = payload.email.toLowerCase();
    payload.username = payload.username.toLowerCase();

    const userNameExists = await this.userService.getUser({
      username: payload.username,
    });

    if (userNameExists) {
      throw new ForbiddenException('Username already exists');
    }

    const emailExists = await this.userService.getUser({
      email: payload.email,
    });

    if (emailExists) {
      throw new ForbiddenException('Email already exists');
    }

    const user = await this.userService.create({
      ...payload,
      password: payload.password,
    });
    return user;
  }

  login(payload: AuthLoginDTO) {
    return payload;
  }
}
