import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Role } from './entities/role.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypegooseModule.forFeature([Role, User])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
