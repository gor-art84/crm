import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUserId } from "../auth/decorators/current-user-id.decorator.js";
import { SessionAuthGuard } from "../auth/guards/session-auth.guard.js";
import { UsersService } from "./users.service.js";

@Controller("me")
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  @Post("avatar")
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadMyAvatar(
    @CurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    return await this.usersService.uploadMyAvatar(userId, file);
  }
}
