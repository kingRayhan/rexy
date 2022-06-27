import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from './entities/user.entity';
import { FilterQuery } from 'mongoose';

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
  create(user: User) {
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
   * Fetch a user
   * @param identifier FilterQuery<User>
   * @returns Promise<User>
   */
  getUser(identifier: FilterQuery<User>): Promise<User> {
    return this.model.findOne(identifier).exec();
  }

  /**
   * Delete a user
   * @param id User id
   * @returns  Promise<User>
   */
  delete(identifier: FilterQuery<User>) {
    return this.model.deleteOne(identifier);
  }

  /**
   * Delete all users
   */
  deleteAll() {
    return this.model.deleteMany();
  }
}
