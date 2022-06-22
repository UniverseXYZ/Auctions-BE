import { Inject, Injectable } from "@nestjs/common";
import {
  AUCTION_CANCELED_STATUS,
  REWARD_TIER_MODIFIED_STATUS,
} from "../utils/constants";
import { IDataLayer } from "../data-layer/IDataLayer";
import { DATA_LAYER_SERVICE } from "../utils/constants";
import { AuctionDto } from "./dtos/auction.dto";
import { TierDto } from "./dtos/rewardTier.dto";

@Injectable()
export class AuctionsService {
  constructor(
    @Inject(DATA_LAYER_SERVICE)
    private readonly dataLayerService: IDataLayer
  ) {}

  async createAuction(auction: AuctionDto) {
    // ! TODO: We need to validate that this owner address matches the one sent using the JWT auth token
    const createdAuction = await this.dataLayerService.createAuction(auction);
    return {
      id: createdAuction._id,
    };
  }

  async createRewardTier(
    tier: TierDto,
    auctionId: string,
    auction: AuctionDto
  ) {
    const { depositedNfts, canceled, finalised, startDate, onChain } = auction;

    const now = new Date();
    const started = now >= startDate;

    if (started || finalised || depositedNfts || (onChain && !canceled)) {
      return { status: REWARD_TIER_MODIFIED_STATUS.notEdited };
    }
    return await this.dataLayerService.createRewardTier(tier, auctionId);
  }

  async editRewardTier(
    tier: TierDto,
    auctionId: string,
    tierId: string,
    auction: AuctionDto
  ) {
    const { depositedNfts, canceled, finalised, startDate, onChain } = auction;

    const now = new Date();
    const started = now >= startDate;

    if (started || finalised || depositedNfts || (onChain && !canceled)) {
      return { status: REWARD_TIER_MODIFIED_STATUS.notEdited };
    }

    const editedTier = await this.dataLayerService.editRewardTier(
      tier,
      auctionId,
      tierId
    );

    if (!editedTier) return;

    return editedTier;
  }

  async removeAuction(auctionId: string) {
    const auction = await this.dataLayerService.getAuction(auctionId);
    let status = AUCTION_CANCELED_STATUS.notCanceled;

    if (!auction) return;

    const { depositedNfts, canceled, onChain } = auction;

    // * check if the auction is onChain, but not canceled and that there aren't any deposited NFTs
    if (!(depositedNfts || (!canceled && onChain))) {
      await this.dataLayerService.removeAuction(auctionId);
      status = AUCTION_CANCELED_STATUS.canceled;
    }
    return {
      auctionId: auction._id,
      status,
    };
  }

  async getAuction(auctionId: string) {
    return await this.dataLayerService.getAuction(auctionId);
  }

  async removeRewardTier(
    auctionId: string,
    tierId: string,
    auction: AuctionDto
  ) {
    let status = REWARD_TIER_MODIFIED_STATUS.notDeleted;

    const { canceled, onChain, depositedNfts, finalised } = auction;

    // * check if the reward tier is not finalised, doesn't have any deposited NFTs, is not onChain and is not canceled
    if (!finalised || !depositedNfts || (!onChain && !canceled)) {
      const result = await this.dataLayerService.removeRewardTier(
        auctionId,
        tierId
      );
      if (!result) {
        return {
          status,
        };
      }

      status = REWARD_TIER_MODIFIED_STATUS.canceled;
    }
    return {
      status,
    };
  }

  async getAllRewardTiers(auctionId: string) {
    const rewardTiers = await this.dataLayerService.getAllRewardTiers(
      auctionId
    );
    return rewardTiers[0];
  }

  async getRewardTiersExcept(auctionId: string, tierId: string) {
    const rewardTiers = await this.dataLayerService.getRewardTiersExcept(
      auctionId,
      tierId
    );
    return rewardTiers.length ? rewardTiers[0] : [];
  }

  async getRewardTiersLength(auctionId: string) {
    const rewartTiersCount = await this.dataLayerService.getRewardTiersLength(
      auctionId
    );
    return rewartTiersCount.length ? rewartTiersCount[0].count : 0;
  }

  async getMyActiveAuctions(user: string, limit: number, offset: number) {
    return this.dataLayerService.getMyActiveAuctions(user, limit, offset);
  }

  async getMyPastAuctions(user: string, limit: number, offset: number) {
    return this.dataLayerService.getMyPastAuctions(user, limit, offset);
  }

  async getMyDraftAuctions(user: string, limit: number, offset: number) {
    return this.dataLayerService.getMyDraftAuctions(user, limit, offset);
  }

  async getMyActiveAuctionsCount(user: string) {
    return this.dataLayerService.getMyActiveAuctionsCount(user);
  }

  async getMyPastAuctionsCount(user: string) {
    return this.dataLayerService.getMyPastAuctionsCount(user);
  }

  async getMyDraftAuctionsCount(user: string) {
    return this.dataLayerService.getMyDraftAuctionsCount(user);
  }
}
