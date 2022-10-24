import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Product } from './entities/product.entity';
import { ProductEventListener } from './products.event-listener';

@Module({
  imports: [TypegooseModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductEventListener],
  exports: [ProductsService],
})
export class ProductsModule {}
