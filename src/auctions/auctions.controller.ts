import { Body, Controller, Post } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Auctions, AuctionsDocument } from "./schemas/auction.schema";
import { ApiOperation } from "@nestjs/swagger";
import { AuctionDto } from "./dtos/auction.dto";
import { AuctionsService } from "./auctions.service";

@Controller("auctions")
export class AuctionsController {
  constructor(
    private auctionService: AuctionsService,
    @InjectModel(Auctions.name)
    readonly nftCollectionAttributesModel: Model<AuctionsDocument>
  ) {}

  @Post()
  @ApiOperation({ summary: "Create new auction" })
  async getAuctions(@Body() auction: AuctionDto) {
    return await this.auctionService.createAuction(auction);
  }
}
