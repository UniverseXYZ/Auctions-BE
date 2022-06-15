import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiParam } from "@nestjs/swagger";
import { AuctionDto } from "./dtos/auction.dto";
import { AuctionsService } from "./auctions.service";
import { TierDto } from "./dtos/rewardTier.dto";
import { ExceptionInterceptor } from "./interceptors/auctions.interceptor";

//! TODO: add auth
@Controller("auctions")
export class AuctionsController {
  constructor(private auctionService: AuctionsService) {}

  @Post()
  @ApiOperation({ summary: "Create new auction" })
  async createAuction(@Body() auction: AuctionDto) {
    return await this.auctionService.createAuction(auction);
  }

  @UseInterceptors(ExceptionInterceptor)
  @Patch("/:id/tier/")
  @ApiOperation({ summary: "Create reward tier" })
  async createRewardTier(
    @Body() tier: TierDto,
    @Param("id") id,
    @Query("tierId") tierId
  ) {
    if (!tierId) {
      return await this.auctionService.createRewardTier(tier, id);
    } else {
      return await this.auctionService.editRewardTier(tier, id, tierId);
    }
  }

  @UseInterceptors(ExceptionInterceptor)
  @Delete("/:id")
  @ApiOperation({ summary: "Remove draft auction" })
  @ApiParam({
    name: "Auction id",
    type: String,
    required: true,
  })
  async removeAuction(@Param("id") id) {
    return await this.auctionService.removeAuction(id);
  }

  @UseInterceptors(ExceptionInterceptor)
  @Get("/:id")
  @ApiOperation({ summary: "Get auction" })
  async getAuction(@Param("id") id) {
    //TODO: get NFTs name etc
    return await this.auctionService.getAuction(id);
  }

  @UseInterceptors(ExceptionInterceptor)
  @Delete("/:id/tier/:rewardTierId")
  @ApiOperation({ summary: "Remove reward tier" })
  async removeRewardTier(@Param("id") id, @Param("rewardTierId") rewardTierId) {
    return await this.auctionService.removeRewardTier(id, rewardTierId);
  }

  // @Get("/:id/tiers")
  // @ApiOperation({ summary: "Get auction reward tiers" })
  // async getRewardTiers(@Param("id") id) {
  //   // * Check if id is a valid ObjectId
  //   if (!isValidId(id)) {
  //     Exceptions.auctionNotFound(id);
  //   }
  //   return this.auctionService.getRewardTiers(id);
  // }
}
