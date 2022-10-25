import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CommonPaginationDTO } from "@/app/contracts/common-pagination-dto";
import { BOOKING_STATUS } from "@/bookings/contracts/booking-types.enum";

export class BookingListQueryDto extends CommonPaginationDTO {
  @ApiProperty({
    required: false,
    description: 'Filter booking based on status',
    enum: BOOKING_STATUS,
  })
  @IsOptional()
  @IsEnum(BOOKING_STATUS)
  status?: BOOKING_STATUS;
}
