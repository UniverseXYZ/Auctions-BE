import { AuctionDto } from "src/auctions/dtos/auction.dto";
import { TierDto } from "src/auctions/dtos/rewardTier.dto";

export interface IDataLayer {
  createAuction(auction: AuctionDto);
  removeAuction(id: string);
  createRewardTier(tier: TierDto, id: string);
  editRewardTier(tier: TierDto, id: string, tierId: string);
  getAuction(id: string);
  removeRewardTier(d: string, tierId: string);
  // getRewardTiers(id: string);
}
