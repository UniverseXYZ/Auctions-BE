import { Inject, Injectable } from "@nestjs/common";
import { IDataLayer } from "src/data-layer/IDataLayer";
import { DATA_LAYER_SERVICE } from "../utils";
import { AuctionDto } from "./dtos/auction.dto";

@Injectable()
export class AuctionsService {
  constructor(
    @Inject(DATA_LAYER_SERVICE)
    private readonly dataLayerService: IDataLayer
  ) {}

  async createAuction(auction: AuctionDto) {
    const createdAuction = await this.dataLayerService.createAuction(auction);
    return {
      id: createdAuction._id,
    };
  }

  async removeAuction(id: string) {
    return await this.dataLayerService.removeAuction(id);
  }
}
