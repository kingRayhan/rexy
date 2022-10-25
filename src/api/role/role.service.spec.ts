import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ReturnModelType } from '@typegoose/typegoose';
import { getModelToken, TypegooseModule } from 'nestjs-typegoose';
import configs from '../../app/config';
import { Permission } from './contracts/permission.enum';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';
import { TestDatabaseModule } from "@/shared/test-database/test-database.module";
import { User } from "@/api/user/entities/user.entity";

describe('RoleService', () => {
  let service: RoleService;
  let roleModel: ReturnModelType<typeof Role>;
  let userModel: ReturnModelType<typeof User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs,
          isGlobal: true,
        }),
        TestDatabaseModule,
        TypegooseModule.forFeature([Role, User]),
      ],
      providers: [RoleService],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleModel = module.get<ReturnModelType<typeof Role>>(getModelToken('Role'));
    userModel = module.get<ReturnModelType<typeof User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  beforeEach(async () => {
    await roleModel.deleteMany({});
    await userModel.deleteMany({});
  });

  describe("RoleService.create", () => {
    it('Should create a new role', async () => {
      const savedRole = await service.create({
        name: 'role-name',
        permissions: [Permission.ADMINISTRATOR, Permission.UPDATE_PROFILE],
      });
      expect(savedRole).toBeDefined();
      expect(savedRole.name).toBe('role-name');
      expect(savedRole.permissions).toEqual([
        Permission.ADMINISTRATOR,
        Permission.UPDATE_PROFILE,
      ]);
    });

    it('⛔ Should throw an error if the role already exists', async () => {
      const roleName = 'role-name';

      await service.create({
        name: roleName,
        permissions: [Permission.ADMINISTRATOR, Permission.UPDATE_PROFILE],
      });

      await expect(
        service.create({
          name: roleName,
          permissions: [Permission.ADMINISTRATOR, Permission.UPDATE_PROFILE],
        }),
      ).rejects.toThrow();
    });
  });

  describe('RoleService.update', () => {
    it('should update a role', async () => {
      const role = await service.create({
        name: 'role-name',
        permissions: [Permission.ADMINISTRATOR],
      });

      const updatedRole = await service.update(
        { _id: role._id },
        {
          name: 'new-name',
          permissions: [Permission.UPDATE_PASSWORD, Permission.UPDATE_PROFILE],
        },
      );

      expect(updatedRole).toBeDefined();
      expect(updatedRole.name).toBe('new-name');
      expect(updatedRole.permissions).toEqual([
        Permission.UPDATE_PASSWORD,
        Permission.UPDATE_PROFILE,
      ]);
    });

    it('⛔ Should throw an error if the role does not exist', async () => {
      await expect(
        service.update(
          { _id: '62cdd4927a1e8bd7d5f7b3d8' },
          { name: 'new-name' },
        ),
      ).rejects.toThrow();
    });

    it('⛔ Should throw an error if the role name already assigned to different role', async () => {
      const saved_1 = await service.create({
        name: 'role-name-1',
        permissions: [Permission.ADMINISTRATOR, Permission.UPDATE_PROFILE],
      });

      const saved_2 = await service.create({
        name: 'role-name-2',
        permissions: [Permission.ADMINISTRATOR, Permission.UPDATE_PROFILE],
      });

      await expect(
        service.update({ _id: saved_1._id }, { name: 'role-name-2' }),
      ).rejects.toThrow();
    });
  });

  describe('RoleService.delete', () => {
    it('should delete a role using _id', async () => {
      const role = await service.create({
        name: 'role-name',
        permissions: [Permission.ADMINISTRATOR],
      });

      service.delete({ _id: role._id }).then((res) => {
        expect(res).toBeDefined();
        expect(res.acknowledged).toBe(true);
        expect(res.deletedCount).toBe(1);
      });
    });

    it('⛔ Should throw an error if the role does not exist', async () => {
      await expect(service.delete({ name: 'role-name' })).rejects.toThrow();
    });
  });

  describe('RoleService.userHasPermissions', () => {
    it('user has some permissions through role', async () => {
      const role = await service.create({
        name: 'role-name',
        permissions: [Permission.ADMINISTRATOR, Permission.UPDATE_PROFILE],
      });

      const user = await userModel.create({
        name: 'user-name',
        username: 'user-username',
        email: 'user@user.com',
        password: 'user-password',
        role: role._id,
      });

      const hasPermissions = await service.userHasPermissions(user._id, [
        Permission.ADMINISTRATOR,
        Permission.UPDATE_PROFILE,
      ]);

      expect(hasPermissions).toBe(true);
    });

    it('user has some permissions through user collection permissions', async () => {
      const user = await userModel.create({
        name: 'user-name',
        username: 'user-username',
        email: 'user@user.com',
        password: 'user-password',
        permissions: [Permission.ADMINISTRATOR, Permission.UPDATE_PROFILE],
      });

      const hasPermissions = await service.userHasPermissions(user._id, [
        Permission.ADMINISTRATOR,
        Permission.UPDATE_PROFILE,
      ]);

      expect(hasPermissions).toBe(true);
    });
  });
});
