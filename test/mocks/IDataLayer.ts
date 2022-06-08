import { NftUnavailable } from "../../src/availability/schemas/nft-availability.schema";
import { IDataLayer } from "../../src/data-layer/IDataLayer";

export class IDataLayerMock implements IDataLayer {
  constructor() {}
  async createAuction(auction) {}
  async setUnavailable(nfts: NftUnavailable[]) {}
  async getUnavailable(contract: string) {}
}
