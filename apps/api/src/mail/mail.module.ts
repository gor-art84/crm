import { Global, Module } from "@nestjs/common";
import { ConsoleMailService } from "./console-mail.service.js";
import { MAIL } from "./mail.js";

@Global()
@Module({
  providers: [{ provide: MAIL, useClass: ConsoleMailService }],
  exports: [MAIL],
})
export class MailModule {}
