import { Request, Response } from "express";
import { AuthPayload } from "./dto/auth.payload.js";

export interface GqlContext {
  req: Request & { user?: AuthPayload };
  res: Response;
}
