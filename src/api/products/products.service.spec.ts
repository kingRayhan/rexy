import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "./products.service";
import { ConfigModule } from "@nestjs/config";
import configs from "../../app/config";
import { TestDatabaseModule } from "@/shared/test-database/test-database.module";
import { ProductEventListener } from "@/api/products/products.event-listener";
import { getModelToken, TypegooseModule } from "nestjs-typegoose";
import { Product } from "@/api/products/entities/product.entity";
import { ReturnModelType } from "@typegoose/typegoose";

const demoProducts: Product[] = [
  {
    name: "Test Product 1",
    price: 100,
    availability: true,
    code: "test-product-1",
    discount_rate: 0,
    durability: 0,
    max_durability: 0,
    mileage: 0,
    minimum_rent_period: 0,
    needing_repair: false,
    type: "plain"
  },
  {
    name: "Test Product 2",
    price: 100,
    availability: true,
    code: "test-product-2",
    discount_rate: 0,
    durability: 0,
    max_durability: 0,
    mileage: 0,
    minimum_rent_period: 0,
    needing_repair: false,
    type: "plain"
  },
  {
    name: "Test Product 3",
    price: 100,
    availability: true,
    code: "test-product-3",
    discount_rate: 0,
    durability: 0,
    max_durability: 0,
    mileage: 0,
    minimum_rent_period: 0,
    needing_repair: false,
    type: "plain"
  },
  {
    name: "Test Product 4",
    price: 100,
    availability: true,
    code: "test-product-4",
    discount_rate: 0,
    durability: 0,
    max_durability: 0,
    mileage: 0,
    minimum_rent_period: 0,
    needing_repair: false,
    type: "plain"
  },
  {
    name: "Test Product 5",
    price: 100,
    availability: true,
    code: "test-product-5",
    discount_rate: 0,
    durability: 0,
    max_durability: 0,
    mileage: 0,
    minimum_rent_period: 0,
    needing_repair: false,
    type: "plain"
  }
];

describe("ProductsService", () => {
  let service: ProductsService;
  let productModel: ReturnModelType<typeof Product>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs
        }),
        TestDatabaseModule,
        //--
        TypegooseModule.forFeature([Product])
      ],
      providers: [ProductsService, ProductEventListener]
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productModel = module.get<ReturnModelType<typeof Product>>(getModelToken("Product"));
    await productModel.deleteMany({});
  });


  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("ProductsService.create", () => {
    it("should create a product", async () => {
      const product = await service.create({
        ...demoProducts[0],
        type: "plain"
      });

      expect(product).toBeDefined();
      expect(product.name).toEqual(demoProducts[0].name);
      expect(product.price).toEqual(demoProducts[0].price);
      expect(product.availability).toEqual(demoProducts[0].availability);
      expect(product.code).toEqual(demoProducts[0].code);
      expect(product.discount_rate).toEqual(demoProducts[0].discount_rate);
      expect(product.durability).toEqual(demoProducts[0].durability);
      expect(product.max_durability).toEqual(demoProducts[0].max_durability);
      expect(product.mileage).toEqual(demoProducts[0].mileage);
      expect(product.minimum_rent_period).toEqual(demoProducts[0].minimum_rent_period);
      expect(product.needing_repair).toEqual(demoProducts[0].needing_repair);

      await productModel.deleteMany({});
    });
  });

  describe("ProductsService.findAll -> List of all product", () => {
    it("Find All products with pagination", async () => {
      await productModel.create(demoProducts);
      const products = await service.findAll({
        page: 1,
        limit: 10
      });
      expect(products).toBeDefined();
      expect(products.meta.resourceCount).toEqual(demoProducts.length);
    });
  });

  describe("ProductsService.findOne -> Find a product by id", () => {
    it("should find a product by id", async () => {
      const product = await productModel.create(demoProducts[0]);
      const foundProduct = await service.findOne(product.id);
      expect(foundProduct).toBeDefined();
      expect(foundProduct.id).toEqual(product.id);
    });

    it("should throw an error if product not found", async () => {
      try {
        await service.findOne("123");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("ProductsService.update -> Update a product by id", () => {
    it("should update a product by id", async () => {
      const product = await productModel.create(demoProducts[0]);
      const updatedProduct = await service.update(product.id, {
        name: "Updated Product Name"
      });
      expect(updatedProduct).toBeDefined();
    });

    it("should throw an error if product not found", async () => {
      try {
        await service.update("123", {
          name: "Updated Product Name"
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("ProductsService.remove -> Delete a product by id", () => {
    it("should delete a product by id", async () => {
      const product = await productModel.create(demoProducts[0]);
      const deletedProduct = await service.remove(product.id);
      expect(deletedProduct).toBeDefined();
    });

    it("should throw an error if product not found", async () => {
      try {
        await service.remove("123");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
