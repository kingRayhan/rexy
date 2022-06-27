import { User } from '../../user/entities/user.entity';
import { ModelOptions, prop } from '@typegoose/typegoose';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Session {
  _id?: string;

  @prop({ required: true, ref: () => User })
  subscriber: User;
}
