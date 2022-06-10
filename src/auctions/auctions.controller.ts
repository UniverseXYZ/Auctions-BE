import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiProperty } from "@nestjs/swagger";
import { AuctionDto } from "./dtos/auction.dto";
import { AuctionsService } from "./auctions.service";
import { isValidId, notExistingAuction } from "src/utils";

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
    type: Number,
    required: true,
  })
  async removeAuction(@Param("id") id) {
    if (!isValidId(id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: notExistingAuction(id),
        },
        HttpStatus.BAD_REQUEST
      );
    }
    return await this.auctionService.removeAuction(id);
  }
}
