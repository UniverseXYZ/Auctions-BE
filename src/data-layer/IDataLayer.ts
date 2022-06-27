import { AuctionDto } from "src/auctions/dtos/auction.dto";
import { TierDto } from "src/auctions/dtos/rewardTier.dto";

export interface IDataLayer {
  //* TODO: separate interfaces
  createAuction(auction: AuctionDto);
  removeAuction(id: string);
  createRewardTier(tier: TierDto, id: string);
  editRewardTier(tier: TierDto, id: string, tierId: string);
  getAuction(id: string);
  removeRewardTier(id: string, tierId: string);
  getAllRewardTiers(id: string);
  getRewardTiersExcept(id: string, tierId: string);
  getRewardTiersLength(id: string);
  getMyActiveAuctions(user: string, limit: number, offset: number);
  getMyPastAuctions(user: string, limit: number, offset: number);
  getMyDraftAuctions(user: string, limit: number, offset: number);
  getMyActiveAuctionsCount(user: string);
  getMyPastAuctionsCount(user: string);
  getMyDraftAuctionsCount(user: string);
  editAuction(auctionId: string, auction: AuctionDto);
  checkUrlAvailability(owner: string, link: string);
  uploadAuctionImages(
    auctionId: string,
    promoImageUrl: string,
    backgroundImageUrl: string
  );
  checkAuctionNameAvailability(owner: string, name: string);
  checkTierNameAvailability(owner: string, auctionId: string, name: string);
}
