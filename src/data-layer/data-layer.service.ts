import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuctionDto } from "../auctions/dtos/auction.dto";
import {
  NftUnavailable,
  NftUnavailableDocument,
} from "../availability/schemas/nft-availability.schema";
import { Auctions, AuctionsDocument } from "../auctions/schemas/auction.schema";
import { IDataLayer } from "./IDataLayer";

@Injectable()
export class DataLayerService implements IDataLayer {
  constructor(
    @InjectModel(Auctions.name)
    private readonly auctionsModel: Model<AuctionsDocument>,
    @InjectModel(NftUnavailable.name)
    private readonly nftsUnavailableModel: Model<NftUnavailableDocument>
  ) {}
  async createAuction(auction: AuctionDto) {
    return await this.auctionsModel.create(auction);
  }

  async getUnavailable(contract: string) {
    return await this.nftsUnavailableModel.find(
      {
        contract: contract,
      },
      { _id: 0 }
    );
  }

  async setUnavailable(nfts: NftUnavailable[]) {
    return await this.nftsUnavailableModel.insertMany(nfts);
  }
}
