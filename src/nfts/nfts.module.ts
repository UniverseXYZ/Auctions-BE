import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { NftsService } from "./nfts.service";

@Module({
  imports: [HttpModule],
  providers: [NftsService],
  exports: [NftsService],
})
export class NftsModule {}
