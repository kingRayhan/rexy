import { prop } from '@typegoose/typegoose';

export class Product {
  @prop()
  code: string;

  @prop()
  name: string;

  @prop()
  type: string;

  @prop()
  availability: boolean;

  @prop()
  needing_repair: boolean;

  @prop()
  durability: number;

  @prop()
  max_durability: number;

  @prop()
  mileage: number;

  @prop()
  price: number;

  @prop()
  minimum_rent_period: number;
}
