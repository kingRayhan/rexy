import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Product } from './entities/product.entity';
import { Booking } from "@/bookings/entities/booking.entity";



@Injectable()
export class ProductEventListener {
  private readonly logger = new Logger(ProductEventListener.name);

  constructor(
    @InjectModel(Product)
    private readonly model: ReturnModelType<typeof Product>,
  ) {}

  @OnEvent('order.created')
  async handleProducts(booking: Booking) {
    await this.model.updateOne(
      {
        _id: booking.product,
      },
      {
        availability: false,
      },
    );
    this.logger.debug('Product availability updated');
  }
}
