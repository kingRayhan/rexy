import { ForbiddenException, Injectable } from '@nestjs/common';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';
import { AuthLoginDTO } from './dto/login.dto';
import { AuthRegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  public async register(payload: AuthRegisterDTO) {
    payload.email = payload.email.toLowerCase();
    payload.username = payload.username.toLowerCase();

    /**
     * Check if user exists with the same username
     */
    const userNameExists = await this.userService.getUser({
      username: payload.username,
    });
    if (Boolean(userNameExists))
      throw new ForbiddenException('Username already exists');

    /**
     * Check if user exists with the same email
     */
    const emailExists = await this.userService.getUser({
      email: payload.email,
    });
    if (Boolean(emailExists))
      throw new ForbiddenException('Email already exists');

    const user = await this.userService.create({
      ...payload,
      password: payload.password,
    });
    return user;
  }

  /**
   * Login a user
   * @param payload AuthLoginDTO
   * @returns
   */
  public async login(payload: AuthLoginDTO) {
    // Is Email or Username
    const _user = this.__isEmail(payload.user);

    const fetchUser = await this.userService.getUser({
      [_user ? 'email' : 'username']: payload.user,
    });

    if (!fetchUser) throw new ForbiddenException('Invalid credentials');

    const isPasswordValid = this.userService.comparePassword(
      fetchUser,
      payload.password,
    );
    if (!isPasswordValid) throw new ForbiddenException('Invalid credentials');

    const session = await this.sessionService.createSession(fetchUser._id);
    return session;
  }

  /**
   * ----------------------------------------------------------------------------------
   * Utility functions
   * ----------------------------------------------------------------------------------
   */

  /**
   * Check if the string is an email
   * @param email string - email to check
   * @returns true if email, false if username
   */
  private __isEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
  };
}
