import { Module } from "@nestjs/common";
import { AuctionsService } from "./auctions.service";
import { AuctionsController } from "./auctions.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Auctions, AuctionsSchema } from "./schemas/auction.schema";
import { DataLayerService } from "src/data-layer/data-layer.service";
import { DATA_LAYER_SERVICE } from "../utils/constants";
import { NftsModule } from "src/nfts/nfts.module";
import { Tokens } from "../utils/tokens";
import { AuctionGateway } from "./auctions.gateway";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Auctions.name,
        schema: AuctionsSchema,
      },
    ]),
    NftsModule,
  ],
  providers: [
    AuctionsService,
    Tokens,
    AuctionGateway,
    {
      useClass: DataLayerService,
      provide: DATA_LAYER_SERVICE,
    },
  ],
  controllers: [AuctionsController],
})
export class AuctionsModule {}
