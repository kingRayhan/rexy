import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class AuthLoginDTO {
  @ApiProperty({ description: 'Username or email' })
  @IsNotEmpty()
  user: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Set jwt access token to client cookie',
    default: false,
  })
  @IsOptional()
  setToCookie?: boolean;
}
