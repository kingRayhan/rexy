import { Controller, Get, HttpStatus, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Authenticated } from "@/api/auth/decorators/authenticated.decorator";
import { AppRequest } from "@/app/contracts/AppRequest.interface";
import AppResponse from "@/app/utils/app-response.class";
import { AppMessage } from "@/app/utils/messages.enum";

@Controller("user")
@ApiTags("User")
export class UserController {
  @Get()
  @Authenticated()
  user(@Req() req: AppRequest) {
    return new AppResponse({
      message: AppMessage.AUTHENTICATED_USER,
      data: req.user.details,
      statusCode: HttpStatus.OK
    });
  }
}
