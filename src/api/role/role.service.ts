import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { FilterQuery } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { union } from 'underscore';
import { User } from '../user/entities/user.entity';
import { Permission } from './contracts/permission.enum';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private readonly roleModel: ReturnModelType<typeof Role>,

    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  /**
   * Create a new role
   * @param payload CreateRoleDto - The payload of the request
   * @returns Promise<Role>
   */
  public async create(payload: CreateRoleDto): Promise<Role> {
    return this.roleModel.create(payload);
  }

  /**
   * Update a role
   * @param identifier FilterQuery<Role> - The filter query to find the role
   * @param data UpdateRoleDto - The data to update the role
   * @returns Promise<Role>
   * @throws Error - If the role is not found
   */
  public async update(identifier: FilterQuery<Role>, data: UpdateRoleDto) {
    const updated = await this.roleModel.findOneAndUpdate(
      identifier,
      { $set: { permissions: data.permissions }, name: data.name },
      { new: true },
    );
    if (!Boolean(updated)) {
      throw new NotFoundException();
    }
    return updated;
  }

  /**
   * Delete a role
   * @param identifier FilterQuery<Role> - The filter query to find the role
   * @throws Error - If the role is not found
   */
  public async delete(identifier: FilterQuery<Role>) {
    const deleted = await this.roleModel.deleteOne(identifier, { new: true });
    if (deleted.deletedCount === 0) {
      throw new NotFoundException();
    }
    return deleted;
  }

  /**
   * Check if a user has expected permissions
   * @param userId string - The user id
   * @param expectedPermissions  Permission[] - The expected permissions
   * @returns Promise<boolean>
   */
  public async userHasPermissions(
    userId: string,
    expectedPermissions: Permission[],
  ) {
    const user = await this.userModel
      .findById(userId)
      .select('permissions -_id')
      .populate({ path: 'role', select: 'permissions -_id' });

    const role = user.role as Role;
    const userPermissions = union(user.permissions, role?.permissions);

    if (userPermissions.includes(Permission.ADMINISTRATOR)) {
      return true;
    }

    return expectedPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
