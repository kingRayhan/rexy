import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypegooseModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
