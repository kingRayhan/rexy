import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CommonPaginationDTO } from 'src/app/contracts/common-pagination-dto';

export class ProductListQuetyDto extends CommonPaginationDTO {
  @ApiProperty({
    required: false,
    enum: [
      'name',
      'type',
      'availability',
      'needing_repair',
      'durability',
      'max_durability',
      'mileage',
      'price',
      'minimum_rent_period',

      '-name',
      '-type',
      '-availability',
      '-needing_repair',
      '-durability',
      '-max_durability',
      '-mileage',
      '-price',
      '-minimum_rent_period',
    ],
  })
  @IsOptional()
  @IsEnum([
    'name',
    'type',
    'availability',
    'needing_repair',
    'durability',
    'max_durability',
    'mileage',
    'price',
    'minimum_rent_period',

    '-name',
    '-type',
    '-availability',
    '-needing_repair',
    '-durability',
    '-max_durability',
    '-mileage',
    '-price',
    '-minimum_rent_period',
  ])
  sortBy?: string;

  @ApiProperty({ required: false, description: 'Search based on product name' })
  @IsOptional()
  search?: string;
}
