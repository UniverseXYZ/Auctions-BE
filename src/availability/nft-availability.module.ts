import { Module } from "@nestjs/common";
import { DataLayerService } from "src/data-layer/data-layer.service";
import { DATA_LAYER_SERVICE } from "src/utils";
import { AvailabilityService } from "./nft-availability.service";

@Module({
  exports: [AvailabilityService],
  providers: [
    AvailabilityService,
    {
      useClass: DataLayerService,
      provide: DATA_LAYER_SERVICE,
    },
  ],
  imports: [],
})
export class AvailabilityModule {}
