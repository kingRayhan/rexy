"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.RoleController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var RoleController = /** @class */ (function () {
    function RoleController(roleService) {
        this.roleService = roleService;
    }
    RoleController.prototype.create = function (createRoleDto) {
        return this.roleService.create(createRoleDto);
    };
    RoleController.prototype.findAll = function () {
        return this.roleService.findAll();
    };
    RoleController.prototype.findOne = function (id) {
        return this.roleService.findOne(+id);
    };
    RoleController.prototype.update = function (id, updateRoleDto) {
        return this.roleService.update(+id, updateRoleDto);
    };
    RoleController.prototype.remove = function (id) {
        return this.roleService.remove(+id);
    };
    __decorate([
        (0, common_1.Post)(),
        __param(0, (0, common_1.Body)())
    ], RoleController.prototype, "create");
    __decorate([
        (0, common_1.Get)()
    ], RoleController.prototype, "findAll");
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id'))
    ], RoleController.prototype, "findOne");
    __decorate([
        (0, common_1.Patch)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)())
    ], RoleController.prototype, "update");
    __decorate([
        (0, common_1.Delete)(':id'),
        __param(0, (0, common_1.Param)('id'))
    ], RoleController.prototype, "remove");
    RoleController = __decorate([
        (0, common_1.Controller)('role'),
        (0, swagger_1.ApiTags)('Role')
    ], RoleController);
    return RoleController;
}());
exports.RoleController = RoleController;
