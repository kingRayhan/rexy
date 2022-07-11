import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthLoginDTO {
  @ApiProperty({ description: 'Username or email' })
  @IsNotEmpty()
  user: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
