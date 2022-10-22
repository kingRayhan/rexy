import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import AppResponse from '../../app/utils/app-response.class';
import { AppMessage } from '../../app/utils/messages.enum';
import { SessionService } from '../session/session.service';
import { AuthService } from './auth.service';
import { AuthStrategy } from './contracts/AuthStategy.enum';
import { Authenticated } from './decorators/authenticated.decorator';
import { FirebaseLoginDTO } from './dto/firebase-login.dto';
import { AuthLoginDTO } from './dto/login.dto';
import { AuthRegisterDTO } from './dto/register.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

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
  async login(
    @Body() payload: AuthLoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(payload);
    const token = await this.sessionService.claimToken(user._id);

    if (payload.setToCookie) {
      res.cookie('accessToken', token.accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }

    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.LOGIN_SUCCESS,
      data: token,
    });
  }

  @Post('login/firebase')
  @HttpCode(HttpStatus.OK)
  async firebaseLogin(
    @Body() payload: FirebaseLoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.firebaseLogin(payload.idToken);
    const token = await this.sessionService.claimToken(user._id);

    if (payload.setToCookie) {
      res.cookie('accessToken', token.accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }

    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.LOGIN_SUCCESS,
      data: token,
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

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard(AuthStrategy.AUTH_JWT_REFRESH_TOKEN))
  async refresh(@Req() request: Request) {
    const data = await this.authService.refresh(request['user']['session_id']);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.TOKEN_REFRESH,
      data,
    });
  }
}
