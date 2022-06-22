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
  async getMyActiveAuctions(user: string, limit: number, offset: number) {}
  async getMyPastAuctions(user: string, limit: number, offset: number) {}
  async getMyDraftAuctions(user: string, limit: number, offset: number) {}
  async getMyActiveAuctionsCount(user: string) {}
  async getMyPastAuctionsCount(user: string) {}
  async getMyDraftAuctionsCount(user: string) {}
}
