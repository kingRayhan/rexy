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
exports.NotificationController = void 0;
var common_1 = require("@nestjs/common");
var NotificationController = /** @class */ (function () {
    function NotificationController(notificationService) {
        this.notificationService = notificationService;
    }
    NotificationController.prototype.create = function (createNotificationDto) {
        return this.notificationService.create(createNotificationDto);
    };
    NotificationController.prototype.findAll = function () {
        return this.notificationService.findAll();
    };
    NotificationController.prototype.findOne = function (id) {
        return this.notificationService.findOne(+id);
    };
    NotificationController.prototype.update = function (id, updateNotificationDto) {
        return this.notificationService.update(+id, updateNotificationDto);
    };
    NotificationController.prototype.remove = function (id) {
        return this.notificationService.remove(+id);
    };
    __decorate([
        (0, common_1.Post)(),
        __param(0, (0, common_1.Body)())
    ], NotificationController.prototype, "create");
    __decorate([
        (0, common_1.Get)()
    ], NotificationController.prototype, "findAll");
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id'))
    ], NotificationController.prototype, "findOne");
    __decorate([
        (0, common_1.Patch)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)())
    ], NotificationController.prototype, "update");
    __decorate([
        (0, common_1.Delete)(':id'),
        __param(0, (0, common_1.Param)('id'))
    ], NotificationController.prototype, "remove");
    NotificationController = __decorate([
        (0, common_1.Controller)('notification')
    ], NotificationController);
    return NotificationController;
}());
exports.NotificationController = NotificationController;
