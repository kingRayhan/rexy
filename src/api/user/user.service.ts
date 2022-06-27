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
   * @param user User
   * @returns Promise<User>
   */
  create(user: User): Promise<User> {
    return this.model.create(user);
  }

  /**
   * Update a user
   * @param id User id
   * @param data  UpdateUserDto
   * @returns Promise<User>
   */
  update(id: string, data: User) {
    return this.model.findOneAndUpdate({ _id: id }, data, { new: true });
  }

  /**
   * Find a user by id
   * @param id User id
   * @returns Promise<User>
   * @throws {Error} If user not found
   */
  findById(id: string) {
    return this.model.findById(id);
  }

  /**
   * Delete a user
   * @param id User id
   * @returns  Promise<User>
   */
  delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  /**
   * Delete all users
   * @returns Promise<User[]>
   */
  deleteAll() {
    return this.model.deleteMany({});
  }
}
