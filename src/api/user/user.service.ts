import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PartialType } from '@nestjs/mapped-types';
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
  create(user: CreateUserDto) {
    return this.model.create(user);
  }

  /**
   * Update a user
   * @param identifier FilterQuery<User>
   * @param data  UpdateUserDto
   * @returns Promise<User>
   */
  update(identifier: FilterQuery<User>, data: UpdateUserDto) {
    return this.model.findOneAndUpdate(identifier, data, { new: true });
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
}
