import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Role {
  @Prop({ required: true, unique: true })
  public name: string;

  @Prop({ required: false })
  public description: string;

  @Prop({ required: false })
  public permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
export type RoleDocument = HydratedDocument<Role>;
