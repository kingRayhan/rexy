import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Permission } from '@/api/roles/contracts/permission.enum';

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: Permission, isArray: true })
  @IsOptional()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}
