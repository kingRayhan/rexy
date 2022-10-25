import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "./products.controller";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { ConfigModule } from "@nestjs/config";
import configs from "@/app/config";
import { TestDatabaseModule } from "@/shared/test-database/test-database.module";
import { getModelToken, TypegooseModule } from "nestjs-typegoose";
import validationOptions from "@/app/utils/validation-options";
import { Product } from "@/api/products/entities/product.entity";
import { ProductsService } from "@/api/products/products.service";
import { ProductEventListener } from "@/api/products/products.event-listener";
import * as request from "supertest";

describe("ProductsController", () => {
  let app: INestApplication;
  let controller: ProductsController;
  let productModel: ReturnModelType<typeof Product>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs
        }),
        TestDatabaseModule,
        TypegooseModule.forFeature([Product])
        // ---
      ],
      controllers: [ProductsController],
      providers: [
        ProductsService, ProductEventListener
      ]
    }).compile();
    controller = module.get<ProductsController>(ProductsController);
    productModel = module.get<ReturnModelType<typeof Product>>(getModelToken("Product"));

    app = module.createNestApplication();
    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe(validationOptions));
    await app.init();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe('POST /products', () => {
    it('should create a product', async () => {

    });
    // const response = await request(app.getHttpServer())
    //   .post('/products')
    //   .send();
  });
});
