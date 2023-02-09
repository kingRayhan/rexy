import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleDocument } from '@/api/roles/entities/role.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  /**
   * Create a new role
   * @param createRoleDto
   */
  async create(createRoleDto: CreateRoleDto) {
    const role = await this.findOne({ name: createRoleDto.name });

    if (role) {
      throw new ForbiddenException('Role name already exists');
    }
    return this.roleModel.create(createRoleDto);
  }

  /**
   * Find all roles
   */
  findAll() {
    return this.roleModel.find();
  }

  /**
   * Find a role by id
   * @param id
   */
  findOneById(id: string) {
    return this.roleModel.findById(id);
  }

  /**
   * Find a role by filter
   * @param filter
   */
  findOne(filter: FilterQuery<RoleDocument>) {
    return this.roleModel.findOne(filter);
  }

  /**
   * Update a role
   * @param id
   * @param updateRoleDto
   */
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOneById(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return this.roleModel.updateOne({ _id: id }, updateRoleDto);
  }

  /**
   * Delete a role
   * @param id
   */
  async remove(id: string) {
    const role = await this.findOneById(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await role.delete();
  }
}
