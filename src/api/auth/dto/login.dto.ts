import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({ title: 'Username or email' })
  @IsNotEmpty()
  user: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ title: 'Set token to cookie', required: false })
  @IsOptional()
  cookie: boolean;
}
