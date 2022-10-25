import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: ['meter', 'plain'],
    description: 'The type of the product',
  })
  @IsEnum(['meter', 'plain'])
  @IsNotEmpty()
  type: 'plain' | 'meter';

  @ApiProperty()
  @IsNotEmpty()
  availability: boolean;

  @ApiProperty()
  @IsNotEmpty()
  needing_repair: boolean;

  @ApiProperty()
  @IsNotEmpty()
  durability: number;

  @ApiProperty()
  @IsNotEmpty()
  max_durability: number;

  @ApiProperty()
  @IsNotEmpty()
  mileage: number;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Discount rate: (1% ~ 99%)', required: false })
  @IsOptional()
  @Min(1)
  @Max(99)
  discount_rate?: number;

  @ApiProperty()
  @IsNotEmpty()
  minimum_rent_period: number;
}
