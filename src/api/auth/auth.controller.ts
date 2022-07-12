import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import AppResponse from '../../app/utils/app-response.class';
import { AppMessage } from '../../app/utils/messages.enum';
import { AuthService } from './auth.service';
import { Authenticated } from './decorators/authenticated.decorator';
import { AuthLoginDTO } from './dto/login.dto';
import { AuthRegisterDTO } from './dto/register.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() payload: AuthRegisterDTO) {
    const data = await this.authService.register(payload);
    return new AppResponse({
      statusCode: HttpStatus.CREATED,
      message: AppMessage.REGISTER_SUCCESS,
      data,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() payload: AuthLoginDTO) {
    const data = await this.authService.login(payload);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.LOGIN_SUCCESS,
      data,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Authenticated()
  @Post('logout')
  async logout(@Req() request: Request) {
    await this.authService.logout(request['user']['session_id']);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.LOGOUT_SUCCESS,
    });
  }
}
