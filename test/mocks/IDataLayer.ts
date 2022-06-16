import { IDataLayer } from "../../src/data-layer/IDataLayer";
import { TierDto } from "../../src/auctions/dtos/rewardTier.dto";

export class IDataLayerMock implements IDataLayer {
  constructor() {}
  async createAuction(auction) {}
  async removeAuction(id) {}
  async createRewardTier(tier: TierDto, auctionId: string) {}
  async getAuction(id: string) {}
  async editRewardTier(tier: TierDto, id: string, tierId: string) {}
  async removeRewardTier(id: string, tierId: string) {}
  async getAllRewardTiers(id: string) {}
  async getRewardTiers(id: string, tierId: string) {}
  async getRewardTiersLength(id: string) {}
}
