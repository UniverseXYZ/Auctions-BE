import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TierDto } from "../auctions/dtos/rewardTier.dto";
import { castToId } from "../utils";
import { AuctionDto } from "../auctions/dtos/auction.dto";
import { Auctions, AuctionsDocument } from "../auctions/schemas/auction.schema";
import { IDataLayer } from "./IDataLayer";

//TODO: revisit all mongo db queries
@Injectable()
export class DataLayerService implements IDataLayer {
  constructor(
    @InjectModel(Auctions.name)
    private readonly auctionsModel: Model<AuctionsDocument>
  ) {}
  async createAuction(auction: AuctionDto) {
    return await this.auctionsModel.create(auction);
  }

  async createRewardTier(tier: TierDto, auctionId: string): Promise<any> {
    return await this.auctionsModel.findOneAndUpdate(
      { _id: auctionId },
      { $push: { rewardTiers: tier } },
      { new: true }
    );
  }

  async editRewardTier(
    tier: TierDto,
    auctionId: string,
    tierId: string
  ): Promise<any> {
    const editedTier = await this.auctionsModel.findOneAndUpdate(
      {
        _id: auctionId,
        rewardTiers: { $elemMatch: { _id: tierId } },
      },
      { $set: { "rewardTiers.$": tier } },
      { new: true }
    );
    return editedTier;
  }

  async removeAuction(id: string): Promise<any> {
    return await this.auctionsModel.findOneAndDelete({ _id: id });
  }

  async removeRewardTier(id: string, tierId: string): Promise<any> {
    return await this.auctionsModel.findOneAndUpdate(
      {
        _id: id,
        rewardTiers: { $elemMatch: { _id: tierId } },
      },
      { $pull: { rewardTiers: { _id: tierId } } }
    );
  }

  async getAuction(id: string) {
    return await this.auctionsModel.findOne({ _id: id });
  }

  async getAllRewardTiers(id: string) {
    return await this.auctionsModel.aggregate([
      { $match: { _id: castToId(id) } },
      { $project: { rewardTiers: { $concatArrays: "$rewardTiers" }, _id: 0 } },
    ]);
  }

  async getRewardTiers(id: string, tierId: string) {
    return await this.auctionsModel.aggregate([
      { $match: { _id: castToId(id) } },
      {
        $project: {
          _id: 0,
          rewardTiers: {
            $filter: {
              input: "$rewardTiers",
              as: "tiers",
              cond: { $ne: ["$$tiers._id", castToId(tierId)] },
            },
          },
        },
      },
    ]);
  }

  async getRewardTiersLength(id: string) {
    return await this.auctionsModel.aggregate([
      { $match: { _id: castToId(id) } },
      { $project: { count: { $size: "$rewardTiers" } } },
    ]);
  }
}
