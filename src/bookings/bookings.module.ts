import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Booking } from './entities/booking.entity';
import { ProductsModule } from '../products/products.module';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypegooseModule.forFeature([Booking, Product]), ProductsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
