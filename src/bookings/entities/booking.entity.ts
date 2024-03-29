import { prop, Ref } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { BOOKING_STATUS } from "../contracts/booking-types.enum";
import { User } from "@/api/user/entities/user.entity";
import { Product } from "@/api/products/entities/product.entity";

export class Booking extends TimeStamps {
  _id?: string;

  @prop({ ref: () => Product })
  product: Ref<Product>;

  @prop({ ref: () => User })
  user: Ref<User>;

  @prop({ required: false, default: BOOKING_STATUS.CONSUMING })
  status?: BOOKING_STATUS;

  @prop({ required: false, default: 0 })
  rent_price?: number;

  @prop({ required: true })
  borrowed_at: Date;

  @prop({ required: true })
  estimated_end_date: Date;

  @prop({ required: false })
  returned_at?: Date;
}
