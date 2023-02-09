import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import AppResponse from '@/app/utils/app-response.class';

@Controller('roles')
@ApiTags('Roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const data = await this.rolesService.create(createRoleDto);
    return new AppResponse({
      message: 'Role created successfully',
      data,
      statusCode: HttpStatus.CREATED,
    });
  }

  @Get()
  async findAll() {
    const data = await this.rolesService.findAll();
    return new AppResponse({
      message: 'Roles fetched successfully',
      data,
      statusCode: HttpStatus.OK,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.rolesService.findOne({ _id: id });
    return new AppResponse({
      message: 'Role fetched successfully',
      data,
      statusCode: HttpStatus.OK,
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const data = await this.rolesService.update(id, updateRoleDto);
    return new AppResponse({
      message: 'Role updated successfully',
      data,
      statusCode: HttpStatus.OK,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.rolesService.remove(id);
    return new AppResponse({
      message: 'Role deleted successfully',
      data,
      statusCode: HttpStatus.OK,
    });
  }
}
