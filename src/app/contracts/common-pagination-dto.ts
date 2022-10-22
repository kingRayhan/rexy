import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommonPaginationDTO {
  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  public page: number;

  @ApiProperty({ default: 10, required: false })
  @IsOptional()
  public limit: number;
}
