import { prop, Ref } from '@typegoose/typegoose';
import { Product } from 'src/api/products/entities/product.entity';
import { User } from 'src/api/user/entities/user.entity';

export class Rent {
  product: Product;

  @prop({ required: true, ref: () => User })
  user: Ref<User>;
}
