import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { getRequest } from "../get-request.js";

export const CurrentSessionId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const sessionId = getRequest(context).sessionId;
    if (!sessionId) throw new UnauthorizedException("Unauthorized");
    return sessionId;
  },
);
