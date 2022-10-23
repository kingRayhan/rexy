import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppRequest } from 'src/app/contracts/AppRequest.interface';
import AppResponse from 'src/app/utils/app-response.class';
import { AppMessage } from 'src/app/utils/messages.enum';
import { Authenticated } from '../auth/decorators/authenticated.decorator';
import { BookingsService } from './bookings.service';
import { BookingListQueryDto } from './dto/booking-list-query.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
@ApiTags('Bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('my-bookings')
  @ApiOperation({ summary: 'Get all bookings by the authenticated user' })
  @Authenticated()
  async myBookings(
    @Query() payload: BookingListQueryDto,
    @Req() req: AppRequest,
  ) {
    const data = await this.bookingsService.myBookings(payload, req.user);
    return new AppResponse({
      data,
      statusCode: HttpStatus.OK,
      message: AppMessage.MY_BOOKINGS,
    });
  }

  @Get('my-bookings/:id')
  @Authenticated()
  async myBookingFindOne(@Param('id') id: string, @Req() req: AppRequest) {
    const data = await this.bookingsService.myBookingFindOne(id, req.user);
    return new AppResponse({
      data,
      statusCode: HttpStatus.OK,
      message: AppMessage.BOOKED_ENTRY_FOUND,
    });
  }

  @Post()
  @Authenticated()
  async create(@Body() payload: CreateBookingDto, @Req() req: AppRequest) {
    const data = await this.bookingsService.create(payload, req.user);
    return new AppResponse({
      data,
      statusCode: HttpStatus.CREATED,
      message: AppMessage.PRODUCT_BOOKED,
    });
  }

  @Post('return/:id')
  @Authenticated()
  async return(@Body() payload: CreateBookingDto, @Req() req: AppRequest) {
    const data = await this.bookingsService.returnBooking(payload, req.user);
    return new AppResponse({
      data,
      statusCode: HttpStatus.CREATED,
      message: AppMessage.PRODUCT_BOOKED,
    });
  }
}
