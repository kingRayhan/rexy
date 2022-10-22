import { FilterQuery } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { getModelForClass, ReturnModelType, types } from '@typegoose/typegoose';

interface IGetObjectListOptions<ModelRef> {
  pagination: {
    page: number;
    limit: number;
  };
  sort?: any;
  find?: FilterQuery<ModelRef>;
  fields?: string | any;
  population?: any;
}

interface IGetObjectShowOptions<ModelRef> {
  find?: FilterQuery<ModelRef>;
  fields?: string | any;
  population?: any;
}

export class DatabaseRepository<
  ModelRef extends types.AnyParamConstructor<any>,
> {
  public model: ReturnModelType<ModelRef>;

  constructor(model: ModelRef) {
    this.model = getModelForClass(model);
  }

  async list({
    find,
    pagination,
    fields,
    population,
    sort,
  }: IGetObjectListOptions<ModelRef>) {
    const count = await this.model.countDocuments(find);

    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;
    const skip = (page - 1) * limit;
    const pageCount = Math.ceil(count / limit);

    const contents = await this.model
      .find(find)
      .skip(skip)
      .limit(limit)
      .select(fields)
      .populate(population)
      .sort(sort || '-createdAt');

    return {
      contents,
      meta: {
        pagination: {
          total: pageCount,
          current: page,
          limit,
        },
        resourceCount: count,
      },
    };
  }

  /**
   * Get a single document
   * @param filter
   */
  async show({ find, population, fields }: IGetObjectShowOptions<ModelRef>) {
    const resource = await this.model
      .findOne(find)
      .populate(population)
      .select(fields);

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }
    return resource;
  }

  async update(filter: FilterQuery<ModelRef>, update: any) {
    const resource = await this.model.findOne(filter);
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }
    return resource.updateOne(update);
  }

  /**
   * Finds all documents in the collection.
   * @param filter
   */
  async destroy(filter: FilterQuery<ModelRef>) {
    const resource = await this.model.findOne(filter);
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }
    return resource.remove();
  }
}
