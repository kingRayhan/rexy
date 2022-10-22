import { getModelForClass, ReturnModelType, types } from '@typegoose/typegoose';
import { ForbiddenException } from '@nestjs/common';
import { toMongooseObjectId } from '../utils/mongoose-helper';

export class DatabasePolicy<ModelRef extends types.AnyParamConstructor<any>> {
  public readonly model: ReturnModelType<ModelRef>;
  private readonly resourceOwnerKey: string;

  constructor(model: ModelRef, resourceOwnerKey: string) {
    this.model = getModelForClass(model);
    this.resourceOwnerKey = resourceOwnerKey;
  }

  public async mutationable(resourceId: string, userId: string) {
    const resource = await this.model.findOne({
      _id: toMongooseObjectId(resourceId),
      [this.resourceOwnerKey]: toMongooseObjectId(userId),
    });

    if (!resource) {
      throw new ForbiddenException(
        'Insufficient permission to mutate the resource or the resource does not exist',
      );
    }
    return resource;
  }
}
