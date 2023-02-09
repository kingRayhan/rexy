import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Permission } from '@/api/roles/contracts/permission.enum';

export type UserDocument = HydratedDocument<User>;

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

  @Prop({ required: false })
  permissions?: Permission[];

  @Prop({ required: false, default: false })
  emailConfirmed?: boolean;

  public comparePassword(password: string): boolean {
    console.log(password);
    return;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
