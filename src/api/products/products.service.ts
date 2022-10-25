import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductListQueryDto } from './dto/product-list-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { DatabaseRepository } from "@/app/database/DatabaseRepository";
import { toMongooseObjectId } from "@/app/utils/mongoose-helper";

@Injectable()
export class ProductsService {
  /**
   * Database repository instance for common database operations
   */
  private readonly db = new DatabaseRepository(Product);

  constructor(
    @InjectModel(Product)
    private readonly model: ReturnModelType<typeof Product>,
  ) {}

  /**
   * Create a new product
   * @param createProductDto - CreateProductDto
   * @returns
   */
  create(createProductDto: CreateProductDto) {
    return this.model.create(createProductDto);
  }

  /**
   * List products
   * @param payload
   */
  findAll(payload: ProductListQueryDto) {
    return this.db.list({
      find: payload.search
        ? { name: { $regex: payload?.search, $options: 'i' } }
        : undefined,
      pagination: {
        limit: payload.limit,
        page: payload.page,
      },
      sort: payload.sortBy,
    });
  }

  findOne(id: string) {
    return this.db.show({
      find: { _id: toMongooseObjectId(id) },
    });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.db.update(
      { find: { _id: toMongooseObjectId(id) } },
      updateProductDto,
    );
  }

  remove(id: string) {
    return this.db.destroy({ find: { _id: toMongooseObjectId(id) } });
  }
}
