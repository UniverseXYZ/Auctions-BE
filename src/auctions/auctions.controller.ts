import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiParam } from "@nestjs/swagger";
import { AuctionDto } from "./dtos/auction.dto";
import { AuctionsService } from "./auctions.service";
import { TierDto } from "./dtos/rewardTier.dto";
import { AuctionsExceptionInterceptor } from "./interceptors/auctions.interceptor";
import { RewardTiersExceptionInterceptor } from "./interceptors/rewardTiers.interceptor";
import { NftsService } from "../nfts/nfts.service";
import { getNftsEndpoint, getNftsAvailability } from "../utils";

//! TODO: add auth
@Controller("auctions")
export class AuctionsController {
  constructor(
    private readonly auctionService: AuctionsService,
    private readonly nftsService: NftsService
  ) {}

  @Post()
  @ApiOperation({ summary: "Create new auction" })
  async createAuction(@Body() auction: AuctionDto) {
    return await this.auctionService.createAuction(auction);
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @UseInterceptors(RewardTiersExceptionInterceptor)
  @Patch("/:id/tier/")
  @ApiOperation({ summary: "Create or edit reward tier" })
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

  @UseInterceptors(AuctionsExceptionInterceptor)
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

  @UseInterceptors(AuctionsExceptionInterceptor)
  @Get("/:id")
  @ApiOperation({ summary: "Get auction" })
  async getAuction(@Param("id") id) {
    //TODO: get NFTs name etc
    return await this.auctionService.getAuction(id);
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @UseInterceptors(RewardTiersExceptionInterceptor)
  @Delete("/:id/tier/:rewardTierId")
  @ApiOperation({ summary: "Remove reward tier" })
  async removeRewardTier(@Param("id") id, @Param("rewardTierId") rewardTierId) {
    return await this.auctionService.removeRewardTier(id, rewardTierId);
  }

  @UseInterceptors(AuctionsExceptionInterceptor)
  @Get("/:id/availability")
  @ApiOperation({ summary: "Get available NFTs" })
  async getAvailableNfts(
    @Req() req,
    @Param("id") id,
    @Query("tierId") tierId,
    @Query("page") page
  ) {
    const cloundFunctionUrl = getNftsEndpoint(
      // ! TODO: remove at some point
      "0x13BBDC67f17A0C257eF67328C658950573A16aDe",
      page || "1"
    );

    //get reward tiers count
    const rewardTiersLength = await this.auctionService.getRewardTiersLength(
      id
    );

    //get all user nfts
    const userNfts = await this.nftsService.getNfts(cloundFunctionUrl);

    if (!tierId) {
      if (!rewardTiersLength) {
        return userNfts.data;
      } else {
        const rewardTiersResult = await this.auctionService.getAllRewardTiers(
          id
        );

        const nftsWithFlag = getNftsAvailability(
          rewardTiersResult.rewardTiers,
          userNfts.data
        );

        return nftsWithFlag;
      }
    }

    const rewardTiersResult = await this.auctionService.getRewardTiers(
      id,
      tierId
    );

    const nftsWithFlag = getNftsAvailability(
      rewardTiersResult.rewardTiers || [],
      userNfts.data
    );

    return nftsWithFlag;
  }
}
