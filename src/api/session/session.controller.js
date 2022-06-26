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
exports.SessionController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var SessionController = /** @class */ (function () {
    function SessionController(sessionService) {
        this.sessionService = sessionService;
    }
    SessionController.prototype.create = function (createSessionDto) {
        return this.sessionService.create(createSessionDto);
    };
    SessionController.prototype.findAll = function () {
        return this.sessionService.findAll();
    };
    SessionController.prototype.findOne = function (id) {
        return this.sessionService.findOne(+id);
    };
    SessionController.prototype.update = function (id, updateSessionDto) {
        return this.sessionService.update(+id, updateSessionDto);
    };
    SessionController.prototype.remove = function (id) {
        return this.sessionService.remove(+id);
    };
    __decorate([
        (0, common_1.Post)(),
        __param(0, (0, common_1.Body)())
    ], SessionController.prototype, "create");
    __decorate([
        (0, common_1.Get)()
    ], SessionController.prototype, "findAll");
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id'))
    ], SessionController.prototype, "findOne");
    __decorate([
        (0, common_1.Patch)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)())
    ], SessionController.prototype, "update");
    __decorate([
        (0, common_1.Delete)(':id'),
        __param(0, (0, common_1.Param)('id'))
    ], SessionController.prototype, "remove");
    SessionController = __decorate([
        (0, common_1.Controller)('session'),
        (0, swagger_1.ApiTags)('Session')
    ], SessionController);
    return SessionController;
}());
exports.SessionController = SessionController;
