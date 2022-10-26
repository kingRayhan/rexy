import { Injectable } from '@nestjs/common';
import { UserService } from '@/api/user/user.service';
import { AuthService } from '@/api/auth/auth.service';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '@/api/user/entities/user.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { SessionService } from '@/api/session/session.service';

@Injectable()
export class TestScaffoldService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * Create a user and return the user and the access token
   */
  public async createTestUser() {
    await this.userModel.deleteMany();
    return this.userService.create({
      email: `${Date.now()}@test.com`,
      password: 'password',
      name: 'test-user',
      username: `test-username-${Date.now()}`,
    });
  }

  /**
   * Create Token for a test user
   * @param user
   */
  public async createTokenForTestUser(user: User) {
    return this.sessionService.claimToken(user._id);
  }

  /**
   * Create a user and return the user and the access token
   */
  public async createTestUserAndToken() {
    const user = await this.createTestUser();
    const token = await this.createTokenForTestUser(user);
    return { user, token };
  }
}
