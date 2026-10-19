import { Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { SessionAuthGuard } from "../auth/guards/session-auth.guard.js";
import { Permission } from "../generated/prisma/enums.js";
import { UsersService } from "./users.service.js";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post(":id/avatar")
  @UseGuards(SessionAuthGuard, PermissionsGuard)
  @Permissions(Permission.USERS_WRITE)
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadAvatar(@Param("id") userId: string, @UploadedFile() file: Express.Multer.File | undefined) {
    return this.usersService.uploadAvatar(userId, file);
  }
}
