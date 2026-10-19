import { BadRequestException, Injectable } from "@nestjs/common";
import sharp from "sharp";
import { ImagePreset, ProcessedImage } from "./image.types.js";

@Injectable()
export class ImageProcessingService {
  async processImage(buffer: Buffer, preset: ImagePreset): Promise<ProcessedImage> {
    try {
      switch (preset) {
        case "avatar":
          return {
            buffer: await sharp(buffer)
              .rotate()
              .resize(512, 512, { fit: "cover", position: "center" })
              .webp({ quality: 80 })
              .toBuffer(),
            contentType: "image/webp",
            extension: "webp",
          };
        default: {
          const _exhaustive: never = preset;
          throw new BadRequestException(`Unknown preset: ${_exhaustive}`);
        }
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(`Не удалось обработать изображение: ${error}`);
    }
  }
}
