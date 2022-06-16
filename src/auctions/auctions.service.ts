import { Inject, Injectable } from "@nestjs/common";
import {
  AUCTION_CANCELED_STATUS,
  REWARD_TIER_MODIFIED_STATUS,
} from "src/utils/constants";
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

  async createRewardTier(tier: TierDto, id: string) {
    return await this.dataLayerService.createRewardTier(tier, id);
  }

  async editRewardTier(tier: TierDto, id: string, tierId: string) {
    const auction = await this.dataLayerService.getAuction(id);

    const { canceled, onChain, depositedNfts, finalised } = auction;

    // * check if the reward tier is not finalised, doesn't have any deposited NFTs, is not onChain and is not canceled
    if (!finalised || !depositedNfts || (!onChain && !canceled)) {
      const editedTier = await this.dataLayerService.editRewardTier(
        tier,
        id,
        tierId
      );
      return editedTier;
    }

    return { status: REWARD_TIER_MODIFIED_STATUS.notEdited };
  }

  async removeAuction(id: string) {
    const auction = await this.dataLayerService.getAuction(id);
    let status = AUCTION_CANCELED_STATUS.notCanceled;

    const { depositedNfts, canceled, onChain } = auction;

    // * check if the auction is onChain, but not canceled and that there aren't any deposited NFTs
    if (!(depositedNfts || (!canceled && onChain))) {
      await this.dataLayerService.removeAuction(id);
      status = AUCTION_CANCELED_STATUS.canceled;
    }
    return {
      id: auction._id,
      status,
    };
  }

  async getAuction(id: string) {
    return await this.dataLayerService.getAuction(id);
  }

  async removeRewardTier(id: string, tierId: string) {
    const auction = await this.dataLayerService.getAuction(id);
    let status = REWARD_TIER_MODIFIED_STATUS.notCanceled;

    const { canceled, onChain, depositedNfts, finalised } = auction;

    // * check if the reward tier is not finalised, doesn't have any deposited NFTs, is not onChain and is not canceled
    if (!finalised || !depositedNfts || (!onChain && !canceled)) {
      await this.dataLayerService.removeRewardTier(id, tierId);
      status = REWARD_TIER_MODIFIED_STATUS.canceled;
    }
    return {
      status,
    };
  }

  async getAllRewardTiers(id: string) {
    const rewardTiers = await this.dataLayerService.getAllRewardTiers(id);
    return rewardTiers[0];
  }

  async getRewardTiers(id: string, tierId: string) {
    const rewardTiers = await this.dataLayerService.getRewardTiers(id, tierId);
    return rewardTiers.length ? rewardTiers[0] : [];
  }

  async getRewardTiersLength(id: string) {
    const rewartTiersCount = await this.dataLayerService.getRewardTiersLength(
      id
    );
    return rewartTiersCount.length ? rewartTiersCount[0].count : 0;
  }
}
