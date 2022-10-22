import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class FirebaseLoginDTO {
  @ApiProperty()
  @IsNotEmpty()
  idToken: string;

  @ApiProperty({
    description: 'Set jwt access token to client cookie',
    default: false,
  })
  @IsOptional()
  setToCookie?: boolean;
}
