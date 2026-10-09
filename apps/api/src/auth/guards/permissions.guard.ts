import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Permission } from "../../generated/prisma/enums.js";
import { PERMISSIONS_KEYS } from "../decorators/permissions.decorator.js";
import { GqlContext } from "../gql-context.js";
import { PermissionsService } from "../permissions.service.js";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEYS, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const request: GqlContext["req"] = GqlExecutionContext.create(context).getContext().req;
    const userId = request.session?.userId;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }

    const effectivePermissions = await this.permissionsService.getEffective(userId);

    const hasPermission = requiredPermissions.every((permission) =>
      effectivePermissions.has(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException("Forbidden");
    }

    return true;
  }
}
