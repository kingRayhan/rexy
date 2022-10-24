import { prop, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Product } from 'src/api/products/entities/product.entity';
import { User } from 'src/api/user/entities/user.entity';
import { BOOKING_STATUS } from '../contracts/booking-types.enum';

export class Booking extends TimeStamps {
  _id?: string;

  @prop({ ref: () => Product })
  product: Ref<Product>;

  @prop({ ref: () => User })
  user: Ref<User>;

  @prop({ required: false, default: 0 })
  used_mileage?: number;

  @prop({ required: false, default: 0 })
  booked_for_days?: number;

  @prop({ required: false, default: false })
  need_repair?: boolean;

  @prop({ required: false, default: BOOKING_STATUS.CONSUMING })
  status?: BOOKING_STATUS;

  @prop({ required: false, default: 0 })
  rent_price?: number;

  @prop({ required: true })
  start_date: Date;

  @prop({ required: true })
  estimated_end_date: Date;

  @prop({ required: false })
  end_date?: Date;

  @prop({ required: false })
  returned_at?: Date;
}
