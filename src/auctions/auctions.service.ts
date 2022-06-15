import { Inject, Injectable } from "@nestjs/common";
import { IDataLayer } from "../data-layer/IDataLayer";
import { DATA_LAYER_SERVICE } from "../utils";
import { AuctionDto } from "./dtos/auction.dto";
import { TierDto } from "./dtos/rewardTier.dto";

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

  async createRewardTier(tier: TierDto, id: string) {
    // const createdTier = await this.dataLayerService.createRewardTier(tier, id);
    // const createdTerId =
    //   createdTier?.rewardTiers[createdTier.rewardTiers.length - 1]._id || null;
    // return {
    //   id: createdTerId,
    // };
    //TODO: check if the above logic is needed or the auction can be returned
    return await this.dataLayerService.createRewardTier(tier, id);
  }

  async editRewardTier(tier: TierDto, id: string, tierId: string) {
    const editedTier = await this.dataLayerService.editRewardTier(
      tier,
      id,
      tierId
    );

    return editedTier;
  }

  async removeAuction(id: string) {
    return await this.dataLayerService.removeAuction(id);
  }

  async getAuction(id: string) {
    return await this.dataLayerService.getAuction(id);
  }

  async removeRewardTier(id: string, tierId: string) {
    return await this.dataLayerService.removeRewardTier(id, tierId);
  }

  // async getRewardTiers(id: string) {
  //   const rewardTiers = await this.dataLayerService.getRewardTiers(id);
  //   return rewardTiers[0];
  // }
}
