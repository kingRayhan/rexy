import md5 from 'md5';
import { prop, ModelOptions } from '@typegoose/typegoose';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class User {
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
