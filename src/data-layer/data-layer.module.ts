import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Auctions, AuctionsSchema } from "src/auctions/schemas/auction.schema";
import {
  NftUnavailable,
  NftUnavailableSchema,
} from "src/availability/schemas/nft-availability.schema";
import { DataLayerService } from "./data-layer.service";

@Module({
  providers: [DataLayerService],
  exports: [DataLayerService],
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
})
export class DataLayerModule {}
