import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BookingReturnDto {
  @ApiProperty({ description: 'Need repair?', default: false, required: false })
  @IsNotEmpty()
  need_repair: boolean;
}
