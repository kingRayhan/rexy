import { index, ModelOptions, prop, Severity } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Permission } from '../contracts/permission.enum';

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
@index({ name: 1 }, { unique: true })
export class Role extends TimeStamps {
  public _id?: string;

  @prop({ required: true, unique: true })
  public name: string;

  @prop({ required: false })
  public permissions: Permission[];
}
