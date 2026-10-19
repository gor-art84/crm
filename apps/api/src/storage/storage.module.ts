import { Global, Module } from "@nestjs/common";
import { OBJECT_STORAGE } from "./object-storage.js";
import { S3ObjectStorageService } from "./s3-object-storage.service.js";

@Global()
@Module({
  providers: [{ provide: OBJECT_STORAGE, useClass: S3ObjectStorageService }],
  exports: [OBJECT_STORAGE],
})
export class StorageModule {}
