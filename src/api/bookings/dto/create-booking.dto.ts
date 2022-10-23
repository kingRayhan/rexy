import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'The id of the product' })
  @IsNotEmpty()
  product: string;

  @ApiProperty({
    description: 'Booking start date',
  })
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty({
    description: 'Booking estimated end date',
  })
  @IsNotEmpty()
  estimated_end_date: Date;
}
