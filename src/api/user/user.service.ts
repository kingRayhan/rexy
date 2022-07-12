import { Injectable, NotFoundException } from '@nestjs/common';
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
   * @throws NotFoundException - If the user is not found
   */
  public async update(identifier: FilterQuery<User>, data: UpdateUserDto) {
    const updated = await this.model.findOneAndUpdate(identifier, data, {
      new: true,
    });

    if (!Boolean(updated)) {
      throw new NotFoundException();
    }

    return updated;
  }

  /**
   * Fetch a user
   * @param identifier FilterQuery<User>
   * @returns Promise<User>
   */
  public getUser(
    identifier: FilterQuery<User>,
    fields?: string,
  ): Promise<User> {
    return this.model.findOne(identifier).select(fields).exec();
  }

  public async getUserById(id: string, fields?: string) {
    return this.model.findById(id).select(fields).exec();
  }

  /**
   * Delete a user
   * @param identifier FilterQuery<User>
   * @throws NotFoundException - If the user is not found
   */
  public async delete(identifier: FilterQuery<User>) {
    const deleted = await this.model.deleteOne(identifier);
    if (deleted.deletedCount === 0) {
      throw new NotFoundException();
    }
    return deleted;
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
