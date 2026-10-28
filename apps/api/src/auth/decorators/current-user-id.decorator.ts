import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { getRequest } from "../get-request.js";

export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const userId = getRequest(context).session?.userId;
    if (!userId) throw new UnauthorizedException("Unauthorized");
    return userId;
  },
);
