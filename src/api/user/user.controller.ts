import { Controller, Get, HttpStatus, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import AppResponse from 'src/app/utils/app-response.class';
import { AppMessage } from 'src/app/utils/messages.enum';
import { AppRequest } from '../../app/contracts/AppRequest.interface';
import { Authenticated } from '../auth/decorators/authenticated.decorator';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Authenticated()
  user(@Req() req: AppRequest) {
    return new AppResponse({
      message: AppMessage.AUTHENTICATED_USER,
      data: req.user.details,
      statusCode: HttpStatus.OK,
    });
  }
}
