import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  type: string;

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

  @ApiProperty()
  @IsNotEmpty()
  minimum_rent_period: number;
}
