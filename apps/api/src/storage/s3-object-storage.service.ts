import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "../config/env.schema.js";
import { ObjectStorage, PutObjectInput } from "./object-storage.js";

@Injectable()
export class S3ObjectStorageService implements ObjectStorage {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor(configService: ConfigService<EnvConfig, true>) {
    this.bucket = configService.get("S3_BUCKET", { infer: true });
    this.publicBaseUrl = configService
      .get("S3_PUBLIC_BASE_URL", { infer: true })
      .replace(/\/$/, "");
    this.client = new S3Client({
      region: configService.get("S3_REGION", { infer: true }),
      endpoint: configService.get("S3_ENDPOINT", { infer: true }),
      credentials: {
        accessKeyId: configService.get("S3_ACCESS_KEY_ID", { infer: true }),
        secretAccessKey: configService.get("S3_SECRET_ACCESS_KEY", { infer: true }),
      },
    });
  }

  async put(input: PutObjectInput): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: input.key,
        Body: input.body,
        ContentType: input.contentType,
      }),
    );
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  getPublicUrl(key: string): string {
    const normalizedKey = key.replace(/^\//, "");
    return `${this.publicBaseUrl}/${normalizedKey}`;
  }
}
