import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthStrategy } from '../contracts/AuthStategy.enum';

export const Authenticated = () => {
  return applyDecorators(
    UseGuards(AuthGuard(AuthStrategy.AUTH_JWT_ACCESS_TOKEN)),
    ApiBearerAuth(),
  );
};
