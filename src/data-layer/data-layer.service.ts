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

  async removeAuction(auctionId: string): Promise<any> {
    return await this.auctionsModel.findOneAndDelete({ _id: auctionId });
  }

  async removeRewardTier(auctionId: string, tierId: string): Promise<any> {
    return await this.auctionsModel.findOneAndUpdate(
      {
        _id: auctionId,
        rewardTiers: { $elemMatch: { _id: tierId } },
      },
      { $pull: { rewardTiers: { _id: tierId } } }
    );
  }

  async getAuction(auctionId: string) {
    return await this.auctionsModel.findOne({ _id: auctionId });
  }

  async getAllRewardTiers(auctionId: string) {
    return await this.auctionsModel.aggregate([
      { $match: { _id: castToId(auctionId) } },
      { $project: { rewardTiers: { $concatArrays: "$rewardTiers" }, _id: 0 } },
    ]);
  }

  async getRewardTiers(auctionId: string, tierId: string) {
    return await this.auctionsModel.aggregate([
      { $match: { _id: castToId(auctionId) } },
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

  async getRewardTiersLength(auctionId: string) {
    return await this.auctionsModel.aggregate([
      { $match: { _id: castToId(auctionId) } },
      { $project: { count: { $size: "$rewardTiers" } } },
    ]);
  }

  async getMyActiveAuctionsCount(user: string): Promise<number> {
    return await this.auctionsModel
      .find({
        owner: user,
        onChain: true,
        startDate: { $lt: new Date() },
        endDate: { $gt: new Date() },
        canceled: { $in: [false, undefined] },
      })
      .count();
  }

  async getMyPastAuctionsCount(user: string): Promise<number> {
    return await this.auctionsModel
      .find({
        owner: user,
        onChain: true,
        endDate: { $lt: new Date() },
        canceled: { $in: [false, undefined] },
      })
      .count();
  }

  async getMyDraftAuctionsCount(user: string) {
    return await this.auctionsModel
      .find({
        owner: user,
        $or: [
          { startDate: { $gt: new Date() } },
          {
            startDate: { $lt: new Date() },
            onChain: { $in: [false, undefined] },
          },
          { startDate: { $lt: new Date() }, onChain: true, canceled: true },
        ],
      })
      .count();
  }

  async getMyActiveAuctions(user: string, limit: number, offset: number) {
    return await this.auctionsModel
      .find({
        owner: user,
        onChain: true,
        startDate: { $lt: new Date() },
        endDate: { $gt: new Date() },
        canceled: { $in: [false, undefined] },
      })
      .skip(offset)
      .limit(limit);
  }

  async getMyPastAuctions(user: string, limit: number, offset: number) {
    return await this.auctionsModel
      .find({
        owner: user,
        onChain: true,
        endDate: { $lt: new Date() },
        canceled: { $in: [false, undefined] },
      })
      .skip(offset)
      .limit(limit);
  }

  async getMyDraftAuctions(user: string, limit: number, offset: number) {
    return await this.auctionsModel
      .find({
        owner: user,
        $or: [
          { startDate: { $gt: new Date() } },
          {
            startDate: { $lt: new Date() },
            onChain: { $in: [false, undefined] },
          },
          { startDate: { $lt: new Date() }, onChain: true, canceled: true },
        ],
      })
      .skip(offset)
      .limit(limit);
  }
}
