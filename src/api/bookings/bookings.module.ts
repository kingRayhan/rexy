import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Booking } from './entities/booking.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypegooseModule.forFeature([Booking]), ProductsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
