import { AppRequest } from '@/app/contracts/AppRequest.interface';
import AppResponse from '@/app/utils/app-response.class';
import { AppMessage } from '@/app/utils/messages.enum';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '@/api/user/dto/create-user.dto';
import { UserService } from '@/api/user/user.service';
import { UpdateUserDto } from '@/api/user/dto/update-user.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  user(@Req() req: AppRequest) {
    return new AppResponse({
      message: AppMessage.AUTHENTICATED_USER,
      data: req.user.details,
      statusCode: HttpStatus.OK,
    });
  }

  @Post()
  async crateUser(@Body() body: CreateUserDto) {
    const data = await this.userService.createUser(body);
    return new AppResponse({
      message: 'User created',
      data,
      statusCode: HttpStatus.OK,
    });
  }

  @Patch(':id')
  async updateUser(@Param() id: UpdateUserDto, @Body() body: UpdateUserDto) {
    const data = await this.userService.updateUser({ _id: id }, body);
    return new AppResponse({
      message: 'User updated',
      data,
      statusCode: HttpStatus.OK,
    });
  }
}
