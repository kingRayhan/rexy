import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { compareSync } from 'bcryptjs';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from './entities/user.entity';
import { FilterQuery } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

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
  public create(user: CreateUserDto) {
    return this.model.create(user);
  }

  /**
   * Update a user
   * @param identifier FilterQuery<User>
   * @param data  UpdateUserDto
   * @returns Promise<User>
   */
  public update(identifier: FilterQuery<User>, data: UpdateUserDto) {
    return this.model.findOneAndUpdate(identifier, data, { new: true });
  }

  /**
   * Fetch a user
   * @param identifier FilterQuery<User>
   * @returns Promise<User>
   */
  public getUser(identifier: FilterQuery<User>): Promise<User> {
    return this.model.findOne(identifier).exec();
  }

  public async getUserById(id: string) {
    return this.model.findById(id).exec();
  }

  /**
   * Delete a user
   * @param identifier FilterQuery<User>
   * @returns  Promise<User>
   */
  public delete(identifier: FilterQuery<User>) {
    return this.model.deleteOne(identifier);
  }

  /**
   * Delete all users
   * @returns
   */
  public deleteAll() {
    return this.model.deleteMany({});
  }

  /**
   * Compare user password
   * @param user User - User to check
   * @param password  string - password to compare
   * @returns boolean
   */
  public comparePassword(user: User, password: string) {
    return compareSync(password, user.password);
  }
}
