import { prop, ModelOptions, pre } from '@typegoose/typegoose';
import { hashSync } from 'bcryptjs';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
@pre<User>('save', function (next) {
  this.password = hashSync(this.password);
  next();
})
export class User {
  public _id?: string;

  @prop()
  public name: string;

  @prop({ required: true, unique: true })
  public username: string;

  @prop()
  public email: string;

  @prop()
  public password: string;

  // get avatar(): string {
  //   return 'https://www.gravatar.com/avatar/' + md5(this.email);
  // }
}
