import {
  index,
  ModelOptions,
  pre,
  prop,
  Ref,
  Severity,
} from '@typegoose/typegoose';
import { hashSync } from 'bcryptjs';
import { Permission } from '../../role/contracts/permission.enum';
import { Role } from '../../role/entities/role.entity';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@pre<User>('save', function (next) {
  this.password = hashSync(this.password);
  next();
})
@index({ username: 1 }, { unique: true })
@index({ email: 1 }, { unique: true })
export class User {
  public _id?: string;

  @prop()
  public name?: string;

  @prop({ required: true, unique: true })
  public username: string;

  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: true })
  public password: string;

  // get avatar(): string {
  //   return 'https://www.gravatar.com/avatar/' + md5(this.email);
  // }

  @prop({ ref: () => Role, required: false })
  role?: Ref<Role>;

  @prop({ required: false })
  permissions?: Permission[];
}
