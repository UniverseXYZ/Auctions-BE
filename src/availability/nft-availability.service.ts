import { Inject, Injectable } from "@nestjs/common";
import { Nfts } from "../auctions/schemas/nfts.schema";
import { IDataLayer } from "../data-layer/IDataLayer";
import { DATA_LAYER_SERVICE } from "../utils";

@Injectable()
export class AvailabilityService {
  constructor(
    @Inject(DATA_LAYER_SERVICE)
    private readonly dataLayerService: IDataLayer
  ) {}

  async getUnavailable(nfts: Nfts[]) {
    const uniqueAddresses = [
      ...new Set(nfts.map((nft: Nfts) => nft.contractAddress)),
    ];

    const usedTokens = await Promise.all(
      uniqueAddresses.map((address: string) => {
        return this.dataLayerService.getUnavailable(address);
      })
    );

    const unavailableNfts = [];

    nfts.forEach((nft) => {
      usedTokens.flat().forEach((_nft) => {
        if (
          nft.contractAddress === _nft.contract &&
          nft.nftId === _nft.tokenId
        ) {
          unavailableNfts.push(nft);
        }
      });
    });

    return unavailableNfts;
  }

  async setUnavailable(nft) {
    return await this.dataLayerService.setUnavailable(nft);
  }
}
