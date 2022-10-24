import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BookingReturnDto {
  @ApiProperty({ description: 'The id of the product' })
  @IsNotEmpty()
  product: string;

  @ApiProperty({ description: 'Need repair?', default: false, required: false })
  @IsNotEmpty()
  need_repair: boolean;
}
