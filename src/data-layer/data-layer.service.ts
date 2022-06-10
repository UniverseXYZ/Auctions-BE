import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { AuctionDto } from "../auctions/dtos/auction.dto";
import { Auctions, AuctionsDocument } from "../auctions/schemas/auction.schema";
import { IDataLayer } from "./IDataLayer";

@Injectable()
export class DataLayerService implements IDataLayer {
  constructor(
    @InjectModel(Auctions.name)
    private readonly auctionsModel: Model<AuctionsDocument>
  ) {}
  async createAuction(auction: AuctionDto) {
    return await this.auctionsModel.create(auction);
  }

  async removeAuction(id: string): Promise<any> {
    return await this.auctionsModel.deleteOne({ _id: id });
  }
}
