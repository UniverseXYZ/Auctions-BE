import { Body, Injectable, Req } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Auctions, AuctionsDocument } from "./schemas/auction.schema";

@Injectable()
export class AuctionsService {
  constructor(
    @InjectModel(Auctions.name)
    readonly auctionsModel: Model<AuctionsDocument>
  ) {}

  async createAuction(auction) {
    return await this.auctionsModel.create(auction);
  }
}
