import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiProperty } from "@nestjs/swagger";
import { AuctionDto } from "./dtos/auction.dto";
import { AuctionsService } from "./auctions.service";
import { isValidId } from "../utils";
import { Exceptions } from "./exceptions";

@Controller("auctions")
export class AuctionsController {
  constructor(private auctionService: AuctionsService) {}

  @Post()
  @ApiOperation({ summary: "Create new auction" })
  async createAuction(@Body() auction: AuctionDto) {
    return await this.auctionService.createAuction(auction);
  }

  @Delete("/:id")
  @ApiOperation({ summary: "Remove draft auction" })
  @ApiParam({
    name: "Auction id",
    type: String,
    required: true,
  })
  async removeAuction(@Param("id") id) {
    //TODO: add auth and checks if there are deposited NFTs etc
    // * Check if id is a valid ObjectId
    if (!isValidId(id)) {
      Exceptions.auctionNotFound(id);
    }

    const auction = await this.auctionService.getAuctionById(id);

    if (!auction) {
      Exceptions.auctionNotFound(id);
    }

    return await this.auctionService.removeAuction(id);
  }
}
