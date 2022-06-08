import { Module } from "@nestjs/common";
import { AuctionsService } from "./auctions.service";
import { AuctionsController } from "./auctions.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Auctions, AuctionsSchema } from "./schemas/auction.schema";
import { DataLayerService } from "src/data-layer/data-layer.service";
import { DATA_LAYER_SERVICE } from "src/utils";
import {
  NftUnavailable,
  NftUnavailableSchema,
} from "src/availability/schemas/nft-availability.schema";
import { AvailabilityService } from "src/availability/nft-availability.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Auctions.name,
        schema: AuctionsSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: NftUnavailable.name,
        schema: NftUnavailableSchema,
      },
    ]),
  ],
  providers: [
    AuctionsService,
    {
      useClass: DataLayerService,
      provide: DATA_LAYER_SERVICE,
    },
    {
      useClass: AvailabilityService,
      provide: NftUnavailable.name,
    },
  ],
  controllers: [AuctionsController],
})
export class AuctionsModule {}
