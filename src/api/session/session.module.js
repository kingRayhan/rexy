"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SessionModule = void 0;
var common_1 = require("@nestjs/common");
var session_service_1 = require("./session.service");
var session_controller_1 = require("./session.controller");
var SessionModule = /** @class */ (function () {
    function SessionModule() {
    }
    SessionModule = __decorate([
        (0, common_1.Module)({
            controllers: [session_controller_1.SessionController],
            providers: [session_service_1.SessionService]
        })
    ], SessionModule);
    return SessionModule;
}());
exports.SessionModule = SessionModule;
