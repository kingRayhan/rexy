import { Prop, Schema } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';

@Schema()
export class User {
  @Prop()
  public name?: string;

  @Prop({ required: true, unique: true })
  public username: string;

  @Prop({ required: false })
  public avatar?: string;

  @Prop({ required: true, unique: true })
  public email: string;

  @Prop({ required: true })
  public password: string;

  // @Prop({ ref: () => Role, required: false })
  // role?: Ref<Role>;

  // @Prop({ required: false })
  // permissions?: Permission[];

  @Prop({ required: false, default: false })
  emailConfirmed?: boolean;
}
