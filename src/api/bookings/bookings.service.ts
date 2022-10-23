import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { RequestUser } from 'src/app/contracts/RequestUser.interface';
import { DatabaseRepository } from 'src/app/database/DatabaseRepository';
import { ProductsService } from '../products/products.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  private readonly db = new DatabaseRepository(Booking);

  constructor(
    @InjectModel(Booking)
    private readonly model: ReturnModelType<typeof Booking>,
    private readonly productsService: ProductsService,
  ) {}

  async create(payload: CreateBookingDto, authenticatedUser: RequestUser) {
    const product = await this.productsService.findOne(payload.product);

    // dat

    // const booked_for_days =
    //   payload.end_date.getTime() - payload.start_date.getTime();
    const booking = new this.model({
      product: payload.product,
      // booked_for_days: payload.booked_for_days,
      user: authenticatedUser.subscriber,
    });
    return booking.save();
  }
}
