import { Module } from "@nestjs/common";
import { DadataService } from "./dadata.service.js";

@Module({
  controllers: [],
  providers: [DadataService],
  exports: [DadataService],
})
export class DadataModule {}
