import { Inject, Injectable } from "@nestjs/common";
import { IDataLayer } from "src/data-layer/IDataLayer";
import { DATA_LAYER_SERVICE } from "src/utils";

@Injectable()
export class AuctionsService {
  constructor(
    @Inject(DATA_LAYER_SERVICE)
    private readonly dataLayerService: IDataLayer
  ) {}

  async createAuction(auction) {
    return await this.dataLayerService.createAuction(auction);
  }
}
