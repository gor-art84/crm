import { Request, Response } from "express";
import { RedisSessionData } from "./session.js";

export interface GqlContext {
  req: Request & { session?: RedisSessionData };
  res: Response;
}
