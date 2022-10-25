import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { TypegooseModule } from "nestjs-typegoose";
import configs from "../../app/config";
import { Role } from "./entities/role.entity";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import validationOptions from "@/app/utils/validation-options";
import { TestDatabaseModule } from "@/shared/test-database/test-database.module";
import { User } from "@/api/user/entities/user.entity";

describe("RoleController", () => {
  let app: INestApplication;
  let controller: RoleController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs
        }),
        TestDatabaseModule,
        TypegooseModule.forFeature([Role, User])
      ],
      controllers: [RoleController],
      providers: [RoleService]
    }).compile();

    controller = module.get<RoleController>(RoleController);
    app = module.createNestApplication();
    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe(validationOptions));
    await app.init();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
