import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken, TypegooseModule } from 'nestjs-typegoose';
import validationOptions from '@/app/utils/validation-options';
import { Product } from '@/api/products/entities/product.entity';
import { ProductsService } from '@/api/products/products.service';
import { ProductEventListener } from '@/api/products/products.event-listener';
import * as request from 'supertest';
import { TestScaffoldModule } from '@/shared/test-scaffold/test-scaffold.module';
import { TestScaffoldService } from '@/shared/test-scaffold/test-scaffold.service';

const demoProducts: Product[] = [
  {
    name: 'Test Product 1',
    price: 100,
    availability: true,
    code: 'test-product-1',
    discount_rate: 0,
    durability: 0,
    max_durability: 0,
    mileage: 0,
    minimum_rent_period: 0,
    needing_repair: false,
    type: 'plain',
  },
  {
    name: 'Test Product 2',
    price: 100,
    availability: true,
    code: 'test-product-2',
    discount_rate: 0,
    durability: 0,
    max_durability: 0,
    mileage: 0,
    minimum_rent_period: 0,
    needing_repair: false,
    type: 'plain',
  },
  {
    name: 'Test Product 3',
    price: 100,
    availability: true,
    code: 'test-product-3',
    discount_rate: 0,
    durability: 0,
    max_durability: 0,
    mileage: 0,
    minimum_rent_period: 0,
    needing_repair: false,
    type: 'plain',
  },
  {
    name: 'Test Product 4',
    price: 100,
    availability: true,
    code: 'test-product-4',
    discount_rate: 0,
    durability: 0,
    max_durability: 0,
    mileage: 0,
    minimum_rent_period: 0,
    needing_repair: false,
    type: 'plain',
  },
  {
    name: 'Test Product 5',
    price: 100,
    availability: true,
    code: 'test-product-5',
    discount_rate: 0,
    durability: 0,
    max_durability: 0,
    mileage: 0,
    minimum_rent_period: 0,
    needing_repair: false,
    type: 'plain',
  },
];

describe('ProductsController', () => {
  let app: INestApplication;
  let controller: ProductsController;
  let productModel: ReturnModelType<typeof Product>;
  let testScaffoldService: TestScaffoldService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestScaffoldModule,
        TypegooseModule.forFeature([Product]),
        // ---
      ],
      controllers: [ProductsController],
      providers: [ProductsService, ProductEventListener],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    testScaffoldService = module.get<TestScaffoldService>(TestScaffoldService);
    productModel = module.get<ReturnModelType<typeof Product>>(
      getModelToken('Product'),
    );

    app = module.createNestApplication();
    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe(validationOptions));
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /products', () => {
    it('Product list route defined', () => {
      expect(controller.findAll).toBeDefined();
    });

    it('Get list of products with pagination', async () => {
      await productModel.deleteMany();
      await productModel.create(demoProducts);
      const response = await request(app.getHttpServer()).get('/products');
      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.body.data.contents).toBeDefined();
      expect(response.body.data.meta.resourceCount).toBe(demoProducts.length);
    });
  });

  describe('POST /products', () => {
    it('Create a product with token', async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer --`);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toHaveProperty('message');
    });

    it('⛔ Throw 401: For unauthenticated request', async () => {
      const user = await testScaffoldService.createTestUser();

      // const response = await request(app.getHttpServer())
      //   .post('/products')
      //   .set('Authorization', `Bearer --`);
      // expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      // expect(response.body).toHaveProperty('message');
    });
  });
});
