"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var user_module_1 = require("./api/user/user.module");
var role_module_1 = require("./api/role/role.module");
var session_module_1 = require("./api/session/session.module");
var mail_module_1 = require("./common/mail/mail.module");
var notification_module_1 = require("./common/notification/notification.module");
var index_1 = require("@tadashi-config/index");
var config_1 = require("@nestjs/config");
var auth_module_1 = require("./api/auth/auth.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    load: index_1["default"],
                    envFilePath: ['.env.prod', '.env.dev', '.env']
                }),
                user_module_1.UserModule,
                role_module_1.RoleModule,
                session_module_1.SessionModule,
                mail_module_1.MailModule,
                notification_module_1.NotificationModule,
                auth_module_1.AuthModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
