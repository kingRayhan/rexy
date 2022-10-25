import { ForbiddenException, Injectable } from "@nestjs/common";
import { SessionService } from "../session/session.service";
import { UserService } from "../user/user.service";
import { AuthLoginDTO } from "./dto/login.dto";
import { AuthRegisterDTO } from "./dto/register.dto";
import { AppMessage } from "@/app/utils/messages.enum";
import { User } from "@/api/user/entities/user.entity";
import { FirebaseService } from "@/shared/firebase/firebase.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly firebaseService: FirebaseService
  ) {
  }

  public async register(payload: AuthRegisterDTO) {
    payload.email = payload.email.toLowerCase();
    payload.username = payload.username.toLowerCase();

    /**
     * Check if user exists with the same username
     */
    const userNameExists = await this.userService.getUser({
      username: payload.username
    });
    if (Boolean(userNameExists))
      throw new ForbiddenException(AppMessage.USERNAME_ALREADY_EXISTS);

    /**
     * Check if user exists with the same email
     */
    const emailExists = await this.userService.getUser({
      email: payload.email
    });
    if (Boolean(emailExists))
      throw new ForbiddenException(AppMessage.EMAIL_ALREADY_EXISTS);

    return await this.userService.create({
      ...payload,
      password: payload.password
    });
  }

  /**
   * User credentials check
   * @param payload AuthLoginDTO
   * @returns
   */
  public async validateCredential(payload: AuthLoginDTO): Promise<User> {
    // Is Email or Username
    const _user = this.__isEmail(payload.user);

    const fetchUser = await this.userService.getUser({
      [_user ? "email" : "username"]: payload.user
    });
    if (!Boolean(fetchUser))
      throw new ForbiddenException(AppMessage.INVALID_CREDENTIALS);

    const isPasswordValid = this.userService.comparePassword(
      fetchUser,
      payload.password
    );
    if (!Boolean(isPasswordValid))
      throw new ForbiddenException(AppMessage.INVALID_CREDENTIALS);

    return fetchUser;
  }

  /**
   * Logout a user session using session id
   * @param session_id string - session id
   * @returns
   */
  public async logout(session_id: string) {
    return this.sessionService.deleteSession({ _id: session_id });
  }

  /**
   * Delete previous session & create new session
   * @param session_id string - session id
   * @returns
   */
  public async refresh(session_id: string) {
    await this.sessionService.deleteSession({ _id: session_id });
    return this.sessionService.claimToken(session_id);
  }

  /**
   * Login a user using firebase token
   * @param idToken string - firebase id token
   */
  public async firebaseLogin(idToken: string): Promise<User> {
    const decodedToken = await this.firebaseService
      .getAdminApp()
      .auth()
      .verifyIdToken(idToken);

    let _user = await this.userService.getUser({ email: decodedToken.email });

    if (!_user) {
      _user = await this.userService.create({
        name: decodedToken.name,
        email: decodedToken.email,
        username: decodedToken.email.split("@")[0],
        password: Date.now().toString(),
        avatar: decodedToken.picture,
        emailConfirmed: true
      });
    }

    return _user;
  }

  /**
   * ----------------------------------------------------------------------------------
   * Utility functions
   * ----------------------------------------------------------------------------------
   */

  /**
   * Check if the string is an email
   * @param email string - email to check
   * @returns true if email is valid
   */
  private __isEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
}
