import { prop, Ref } from '@typegoose/typegoose';
import { Product } from 'src/api/products/entities/product.entity';
import { User } from 'src/api/user/entities/user.entity';

export class Booking {
  @prop({ ref: () => Product })
  product: Ref<Product>;

  @prop({ ref: () => User })
  user: Ref<User>;

  @prop({ required: false })
  used_mileage: number;

  @prop({ required: false })
  booked_for_days: number;

  @prop({ required: false, default: false })
  need_repair: boolean;
}
