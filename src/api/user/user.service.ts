import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly model: ReturnModelType<typeof User>,
  ) {}

  /**
   *  Create a new user
   * @param data CreateUserDto
   * @returns Promise<User>
   */
  create(data: User): Promise<User> {
    return this.model.create(data);
  }
}
