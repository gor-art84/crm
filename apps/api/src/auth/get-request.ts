import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { GqlContext } from "./gql-context.js";

export function getRequest(context: ExecutionContext): GqlContext["req"] {
  if (context.getType<"http" | "graphql">() === "graphql") {
    return GqlExecutionContext.create(context).getContext().req;
  }
  return context.switchToHttp().getRequest<Request>();
}
