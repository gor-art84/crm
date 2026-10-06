import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { DadataModule } from "../dadata/dadata.module.js";
import { ClientsResolver } from "./clients.resolver.js";
import { ClientsService } from "./clients.service.js";

@Module({
  imports: [DadataModule, AuthModule],
  providers: [ClientsResolver, ClientsService],
})
export class ClientsModule {}
