import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { DadataResolver } from "./dadata.resolver.js";
import { DadataService } from "./dadata.service.js";

@Module({
  imports: [AuthModule],
  providers: [DadataService, DadataResolver],
  exports: [DadataService],
})
export class DadataModule {}
