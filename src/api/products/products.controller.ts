import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProductListQueryDto } from './dto/product-list-query.dto';
import { Authenticated } from "@/api/auth/decorators/authenticated.decorator";
import AppResponse from "@/app/utils/app-response.class";

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Authenticated()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      await this.productsService.create(createProductDto);
      return new AppResponse({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Product created successfully',
      });
    } catch (error) {
      return new AppResponse({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Get()
  async findAll(@Query() query: ProductListQueryDto) {
    const data = await this.productsService.findAll(query);
    return new AppResponse({
      data,
      statusCode: HttpStatus.OK,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.productsService.findOne(id);
    return new AppResponse({
      data,
      statusCode: HttpStatus.OK,
    });
  }

  @Patch(':id')
  @Authenticated()
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Authenticated()
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
