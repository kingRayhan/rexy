import AppResponse from '@/app/utils/app-response.class';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDTO } from './dto/login.dto';
import { AuthRegisterDTO } from './dto/register.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() payload: AuthRegisterDTO) {
    const data = this.authService.register(payload);
    return data;
  }

  @Post()
  login(@Body() payload: AuthLoginDTO) {
    return this.authService.login(payload);
  }
}
