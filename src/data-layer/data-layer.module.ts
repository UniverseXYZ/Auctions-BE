import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Auctions, AuctionsSchema } from "src/auctions/schemas/auction.schema";
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
  ],
})
export class DataLayerModule {}
