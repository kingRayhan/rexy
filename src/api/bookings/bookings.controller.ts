import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppRequest } from 'src/app/contracts/AppRequest.interface';
import AppResponse from 'src/app/utils/app-response.class';
import { AppMessage } from 'src/app/utils/messages.enum';
import { Authenticated } from '../auth/decorators/authenticated.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
@ApiTags('Bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

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
