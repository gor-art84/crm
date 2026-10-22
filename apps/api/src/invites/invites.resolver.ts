import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { SessionAuthGuard } from "../auth/guards/session-auth.guard.js";
import { Permission } from "../generated/prisma/enums.js";
import { AcceptInviteInput } from "./dto/accept-invite.input.js";
import { InvitePreviewObject } from "./dto/invite-preview.object.js";
import { InvitesService } from "./invites.service.js";

@Resolver()
export class InvitesResolver {
  constructor(private readonly invitesService: InvitesService) {}

  @Query(() => InvitePreviewObject)
  invitePreview(@Args("token") token: string) {
    return this.invitesService.preview(token);
  }

  @Mutation(() => Boolean)
  async acceptInvite(@Args("input") input: AcceptInviteInput) {
    await this.invitesService.accept(input.token, input.password);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(SessionAuthGuard, PermissionsGuard)
  @Permissions(Permission.USERS_WRITE)
  async resendInvite(@Args("userId") userId: string) {
    await this.invitesService.resend(userId);
    return true;
  }
}
