import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'The id of the product' })
  @IsNotEmpty()
  product: string;

  @ApiProperty({
    description: 'Used mileage for this product if applicable',
    required: false,
  })
  @IsOptional()
  used_mileage?: number;

  @ApiProperty({ description: 'Need repair?', default: false, required: false })
  need_repair: boolean;
}
