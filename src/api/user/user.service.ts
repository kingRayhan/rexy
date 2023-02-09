import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/api/user/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from '@/api/user/entities/user.entity';
import { compareSync, hashSync } from 'bcryptjs';
import { UpdateUserDto } from '@/api/user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    console.log('UserService created');
  }

  async findAll(): Promise<any[]> {
    return [];
  }

  /**
   * Find a user
   * @param filter
   */
  async findOne(filter: FilterQuery<UserDocument>) {
    return this.userModel.findOne(filter);
  }

  /**
   * Create a new user
   * @param body
   */
  async createUser(body: CreateUserDto) {
    const user = await this.findOne({
      $and: [{ $or: [{ email: body.email }, { username: body.username }] }],
    });

    if (user) {
      throw new ForbiddenException('User already exists');
    }

    return this.userModel.create({
      ...body,
      password: hashSync(body.password, 10),
    });
  }

  /**
   * Update a user
   * @param filter
   * @param body
   */
  async updateUser(filter: FilterQuery<UserDocument>, body: UpdateUserDto) {
    return this.userModel.updateOne(filter, body);
  }

  /**
   * Delete a user
   * @param filter
   * @returns
   */
  async deleteUser(filter: FilterQuery<UserDocument>) {
    return this.userModel.deleteOne(filter);
  }

  /**
   * Compare password
   * @param user User
   * @param password
   * @returns
   */
  comparePassword(user: UserDocument, password: string): boolean {
    return compareSync(password, user.password);
  }
}
