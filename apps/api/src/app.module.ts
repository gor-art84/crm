import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { Request, Response } from "express";
import { AppController } from "./app.controller.js";
import { AppResolver } from "./app.resolver.js";
import { AppService } from "./app.service.js";
import { AuthModule } from "./auth/auth.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { RedisModule } from "./redis/redis.module.js";
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../../.env",
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      sortSchema: true,
      driver: ApolloDriver,
      context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
