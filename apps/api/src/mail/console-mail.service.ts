import { Injectable, Logger } from "@nestjs/common";
import type { Mail, SendMailInput } from "./mail.js";

@Injectable()
export class ConsoleMailService implements Mail {
  private readonly logger = new Logger(ConsoleMailService.name);

  async send(input: SendMailInput): Promise<void> {
    this.logger.log(`To: ${input.to}`);
    this.logger.log(`Subject: ${input.subject}`);
    this.logger.log(input.text);
  }
}
